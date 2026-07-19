from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import html
import time

from simulator import store
from agents.fan_assistant import handle_chat
from agents.ops_intelligence import generate_ops_summary
from agents.incident_triage import classify_incident
import utils

router = APIRouter(prefix="/api")

# Trace store in memory
trace_store: Dict[str, Any] = {}

# Security
security = HTTPBearer()

def verify_ops_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    if credentials.credentials != "ops-secret-token":
        raise HTTPException(status_code=403, detail="Invalid token")
    return credentials.credentials

class RateLimiter:
    def __init__(self, requests_per_minute: int):
        self.rpm = requests_per_minute
        self.clients: Dict[str, List[float]] = {}
    
    def check(self, request: Request):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        if client_ip not in self.clients:
            self.clients[client_ip] = []
        self.clients[client_ip] = [t for t in self.clients[client_ip] if now - t < 60]
        if len(self.clients[client_ip]) >= self.rpm:
            raise HTTPException(status_code=429, detail="Too Many Requests")
        self.clients[client_ip].append(now)

rate_limiter = RateLimiter(10)

class ChatRequest(BaseModel):
    messages: List[Dict[str, Any]]

class IncidentRequest(BaseModel):
    raw_text: str = Field(..., max_length=500)
    reported_by: str = Field(default="staff", max_length=100)

@router.post("/chat", dependencies=[Depends(rate_limiter.check)])
async def chat_endpoint(req: ChatRequest) -> Dict[str, Any]:
    with open("debug.log", "a") as f: f.write("Entering chat_endpoint\n")
    try:
        # Sanitize messages
        for m in req.messages:
            if "content" in m and isinstance(m["content"], str):
                if len(m["content"]) > 1000:
                    raise HTTPException(status_code=422, detail="Message too long")
                m["content"] = html.escape(m["content"])
        
        result = await handle_chat(req.messages)
        with open("debug.log", "a") as f: f.write("Finished handle_chat\n")
        trace_store[result["trace_id"]] = result["trace_details"]
        return {
            "text": result["text"],
            "trace_id": result["trace_id"],
            "messages": result["messages"]
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        with open("debug.log", "a") as f: 
            f.write(f"Error in chat_endpoint: {e}\n")
            f.write(traceback.format_exc())
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An internal error occurred.")

@router.get("/route")
def get_route_endpoint(from_loc: str, to_loc: str, accessibility: bool = False) -> Dict[str, Any]:
    return utils.get_route(from_loc, to_loc, accessibility)

@router.get("/ops/summary", dependencies=[Depends(verify_ops_token)])
async def get_ops_summary() -> Dict[str, Any]:
    # In a real app this might be cached and updated by a background worker every 60s
    summary = await generate_ops_summary()
    return {
        "live_state": {
            "zones": store.get_zone_densities(),
            "transport": store.get_transport_status()
        },
        "intelligence": summary
    }

@router.get("/ops/incidents", dependencies=[Depends(verify_ops_token)])
def list_incidents() -> Dict[str, Any]:
    return {"incidents": store.incidents}

@router.post("/ops/incidents", dependencies=[Depends(rate_limiter.check), Depends(verify_ops_token)])
async def create_incident(req: IncidentRequest) -> Dict[str, Any]:
    sanitized_text = html.escape(req.raw_text)
    sanitized_reporter = html.escape(req.reported_by)
    
    # Classify first
    classification = await classify_incident(sanitized_text)
    
    # File it
    res = utils.file_incident(sanitized_text, sanitized_reporter)
    
    # Update the stored incident with classification
    for inc in store.incidents:
        if inc["id"] == res["incident_id"]:
            inc.update(classification)
            break
            
    return res

@router.get("/trace/{trace_id}")
def get_trace(trace_id: str) -> Dict[str, Any]:
    if trace_id not in trace_store:
        raise HTTPException(status_code=404, detail="Trace not found")
    return {"trace_id": trace_id, "tool_calls": trace_store[trace_id]}
