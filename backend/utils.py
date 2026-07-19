import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from functools import lru_cache
from simulator import store

@lru_cache(maxsize=100)
def get_route(from_node_name: str, to_node_name: str, accessibility: bool = False) -> Dict[str, Any]:
    # Mock routing logic for hackathon purposes.
    # In reality, this would use NetworkX or similar over store.venue["edges"]
    from_node = next((n for n in store.venue["nodes"] if from_node_name.lower() in n["name"].lower()), None)
    to_node = next((n for n in store.venue["nodes"] if to_node_name.lower() in n["name"].lower()), None)
    
    if not from_node or not to_node:
        return {"error": "Location not found in venue graph."}
        
    # Simulate a path
    steps = [
        {"instruction": f"Head from {from_node['name']} towards Central Concourse.", "distance_m": 20},
        {"instruction": "Use the elevator if needed." if accessibility else "Take the stairs or escalator.", "distance_m": 0},
        {"instruction": f"Arrive at {to_node['name']}.", "distance_m": 30}
    ]
    
    return {
        "steps": steps,
        "total_distance_m": 50,
        "total_time_est_s": 120,
        "step_free": accessibility
    }

@lru_cache(maxsize=100)
def search_knowledge(query: str) -> Dict[str, Any]:
    # Simple keyword/mock retrieval
    query_lower = query.lower()
    results = []
    for doc in store.knowledge:
        if any(word in query_lower for word in doc["title"].lower().split()) or any(word in query_lower for word in doc["text"].lower().split()):
            results.append({
                "doc_id": doc["id"],
                "title": doc["title"],
                "text_snippet": doc["text"],
                "relevance_score": 0.9
            })
    return {"results": results[:2]}

def get_transport_status() -> Dict[str, Any]:
    return {"routes": store.get_transport_status()}

def file_incident(raw_text: str, reported_by: str) -> Dict[str, str]:
    incident_id = f"INC-{uuid.uuid4().hex[:6].upper()}"
    store.incidents.append({
        "id": incident_id,
        "reported_by": reported_by,
        "raw_text": raw_text,
        "status": "received",
        "created_at": datetime.now().isoformat()
    })
    return {"incident_id": incident_id, "status": "received"}
