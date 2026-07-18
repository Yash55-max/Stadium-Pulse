import json
import asyncio
import random
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any

# In-memory store
class Store:
    def __init__(self):
        data_dir = Path(__file__).parent / "data"
        with open(data_dir / "venue_graph.json", "r") as f:
            self.venue = json.load(f)
        
        with open(data_dir / "knowledge.json", "r") as f:
            self.knowledge = json.load(f)
            
        self.incidents: List[Dict[str, Any]] = []

    def get_zone_densities(self):
        return {z["id"]: {"name": z["name"], "capacity": z["capacity"], "current": z["current_density"], "pct": z["current_density"]/z["capacity"]} for z in self.venue["zones"]}
        
    def get_transport_status(self):
        return self.venue["transport_routes"]

store = Store()

async def simulate_live_data():
    """Background task to simulate live stadium events."""
    while True:
        # Simulate crowd movement
        for zone in store.venue["zones"]:
            change = random.randint(-50, 150)
            zone["current_density"] = max(0, min(zone["capacity"], zone["current_density"] + change))
            
        # Simulate transport load
        for route in store.venue["transport_routes"]:
            change = random.randint(-10, 30)
            route["current_load"] = max(0, min(route["capacity"], route["current_load"] + change))
            
        await asyncio.sleep(5) # Tick every 5 seconds
