import os
import asyncio
from typing import Dict, Any, List
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from contextlib import AsyncExitStack

_mcp_client_stack = None
_mcp_session = None
_mcp_tools = []

async def startup_mcp():
    global _mcp_session, _mcp_client_stack, _mcp_tools
    
    command = "npx.cmd" if os.name == "nt" else "npx"
    args = [
        "-y",
        "mcp-remote",
        "https://gateway-maps-pub-int.delhivery.com/mcp",
        "--header",
        "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNvdXJjZSI6IldFQiIsInVjaWQiOiIyZmMwYTg1My1jYmRmLTFiODItYjE4Ny1lN2JlZWM2NGU2ZTUifSwiZXhwIjoxNzg0NTIzMjUzLCJpYXQiOjE3ODQ0MzY4NTMsImp0aSI6ImJiY2RmNjg1LTA3MDAtNDJlZi04NDM3LTY5ZTdmM2Y2OTQzNCJ9.isD1wIboWdh7bCGJtrGGS-WoUuw8IHOuuC1xZqzfOaU"
    ]
    
    server_params = StdioServerParameters(
        command=command,
        args=args
    )
    
    _mcp_client_stack = AsyncExitStack()
    
    try:
        stdio_transport = await _mcp_client_stack.enter_async_context(stdio_client(server_params))
        read, write = stdio_transport
        
        _mcp_session = await _mcp_client_stack.enter_async_context(ClientSession(read, write))
        await _mcp_session.initialize()
        
        result = await _mcp_session.list_tools()
        _mcp_tools = result.tools
    except Exception as e:
        print(f"Failed to start Maps MCP client: {e}")
        await shutdown_mcp()

async def shutdown_mcp():
    global _mcp_session, _mcp_client_stack, _mcp_tools
    if _mcp_client_stack:
        await _mcp_client_stack.aclose()
    _mcp_session = None
    _mcp_client_stack = None
    _mcp_tools = []

async def get_maps_mcp_client() -> ClientSession:
    if not _mcp_session:
        raise RuntimeError("MCP Session is not initialized. Ensure startup_mcp is called.")
    return _mcp_session

async def get_mcp_tools_schema() -> List[Dict[str, Any]]:
    # No longer dynamically fetches; returns the cached schemas from startup
    schemas = []
    for tool in _mcp_tools:
        schemas.append({
            "type": "function",
            "function": {
                "name": tool.name,
                "description": tool.description or "",
                "parameters": tool.inputSchema
            }
        })
    return schemas

async def call_mcp_tool(name: str, arguments: dict) -> Any:
    session = await get_maps_mcp_client()
    result = await session.call_tool(name, arguments=arguments)
    text_content = []
    for item in result.content:
        if item.type == "text":
            text_content.append(item.text)
    return "\n".join(text_content)
