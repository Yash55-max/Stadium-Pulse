import pytest
from fastapi.testclient import TestClient
from main import app
from agents.incident_triage import classify_incident
from agents.ops_intelligence import generate_ops_summary
from simulator import store

client = TestClient(app)

def test_api_chat_success():
    """Test that /api/chat returns 200 with valid input"""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "Where is the nearest restroom?"}]}
    )
    if response.status_code != 200:
        print(response.json())
    assert response.status_code == 200
    data = response.json()
    assert "text" in data

def test_api_chat_malformed():
    """Test that /api/chat returns 422 for malformed input"""
    response = client.post(
        "/api/chat",
        json={"invalid_field": "test"} # Missing 'message'
    )
    assert response.status_code == 422

def test_incident_triage_collapse():
    """Test that 'Someone collapsed' is classified as critical medical."""
    # Run the triage agent directly
    result = classify_incident("Someone near me just collapsed and needs help")
    
    assert result is not None
    assert result["type"] == "medical"
    assert result["severity"] in ["high", "critical"]

def test_ops_intelligence_schema():
    """Test that the ops intelligence agent outputs the expected JSON schema."""
    # Mocking standard state in the global store
    store.attendance = 50000
    store.incidents = []
    
    summary = generate_ops_summary()
    assert summary is not None
    assert "summary" in summary
    assert "actions" in summary
    
    assert isinstance(summary["summary"], str)
    assert isinstance(summary["actions"], list)
