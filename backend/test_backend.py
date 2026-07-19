import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app
from agents.incident_triage import classify_incident
from agents.ops_intelligence import generate_ops_summary
from simulator import store
import utils

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

@pytest.mark.asyncio
async def test_incident_triage_collapse():
    """Test that 'Someone collapsed' is classified as critical medical."""
    # Run the triage agent directly
    result = await classify_incident("Someone near me just collapsed and needs help")
    
    assert result is not None
    assert result["type"] == "medical"
    assert result["severity"] in ["high", "critical"]

@pytest.mark.asyncio
async def test_ops_intelligence_schema():
    """Test that the ops intelligence agent outputs the expected JSON schema."""
    # Mocking standard state in the global store
    store.attendance = 50000
    store.incidents = []
    
    summary = await generate_ops_summary()
    assert summary is not None
    assert "summary" in summary
    assert "actions" in summary
    
    assert isinstance(summary["summary"], str)
    assert isinstance(summary["actions"], list)

def test_get_route():
    """Test venue graph pathfinding"""
    # Test valid route
    res = utils.get_route("Gate A", "Section 105", accessibility=False)
    assert "error" not in res
    assert "steps" in res
    assert res["step_free"] is False
    
    # Test accessibility route
    res_acc = utils.get_route("Gate B", "Section 118", accessibility=True)
    assert res_acc["step_free"] is True
    
    # Test invalid route
    res_err = utils.get_route("Nowhere", "Section 105")
    assert "error" in res_err

def test_rate_limiting():
    """Test that the 11th request in a minute returns 429 Too Many Requests"""
    # Patch the LLM handler to avoid API calls and speed up the test
    with patch("routers.api.handle_chat") as mock_handle:
        # We must mock an async function correctly
        import asyncio
        future = asyncio.Future()
        future.set_result({"text": "mocked", "trace_id": "123", "trace_details": [], "messages": []})
        mock_handle.return_value = future
        
        # Make 10 successful requests
        for _ in range(10):
            res = client.post("/api/chat", json={"messages": [{"role": "user", "content": "hi"}]})
            assert res.status_code == 200
            
        # 11th request should hit rate limit
        res = client.post("/api/chat", json={"messages": [{"role": "user", "content": "hi"}]})
        assert res.status_code == 429

def test_input_validation():
    """Test that oversized inputs are rejected with 422"""
    long_text = "a" * 501
    res = client.post(
        "/api/ops/incidents",
        headers={"Authorization": "Bearer ops-secret-token"},
        json={"raw_text": long_text}
    )
    assert res.status_code == 422
