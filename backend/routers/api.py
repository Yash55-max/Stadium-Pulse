from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from simulator import store
from agents.fan_assistant import handle_chat
from agents.ops_intelligence import generate_ops_summary
from agents.incident_triage import classify_incident
import utils

router = APIRouter(prefix="/api")

# Trace store in memory
trace_store: Dict[str, Any] = {}

class ChatRequest(BaseModel):
    messages: List[Dict[str, Any]]

class IncidentRequest(BaseModel):
    raw_text: str
    reported_by: str = "staff"

@router.post("/chat")
def chat_endpoint(req: ChatRequest):
    try:
        result = handle_chat(req.messages)
        trace_store[result["trace_id"]] = result["trace_details"]
        return {
            "text": result["text"],
            "trace_id": result["trace_id"],
            "messages": result["messages"] # For client to keep history (excluding system prompt ideally, but simpler this way)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/route")
def get_route_endpoint(from_loc: str, to_loc: str, accessibility: bool = False):
    return utils.get_route(from_loc, to_loc, accessibility)

@router.get("/ops/summary")
def get_ops_summary():
    # In a real app this might be cached and updated by a background worker every 60s
    summary = generate_ops_summary()
    return {
        "live_state": {
            "zones": store.get_zone_densities(),
            "transport": store.get_transport_status()
        },
        "intelligence": summary
    }

@router.get("/ops/incidents")
def list_incidents():
    return {"incidents": store.incidents}

@router.post("/ops/incidents")
def create_incident(req: IncidentRequest):
    # Classify first
    classification = classify_incident(req.raw_text)
    
    # File it
    res = utils.file_incident(req.raw_text, req.reported_by)
    
    # Update the stored incident with classification
    for inc in store.incidents:
        if inc["id"] == res["incident_id"]:
            inc.update(classification)
            break
            
    return res

@router.get("/trace/{trace_id}")
def get_trace(trace_id: str):
    if trace_id not in trace_store:
        raise HTTPException(status_code=404, detail="Trace not found")
    return {"trace_id": trace_id, "tool_calls": trace_store[trace_id]}
