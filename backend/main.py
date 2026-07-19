import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

from routers.api import router
from simulator import simulate_live_data
from mcp_client import startup_mcp, shutdown_mcp

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the background simulator
    sim_task = asyncio.create_task(simulate_live_data())
    # Start MCP client
    await startup_mcp()
    yield
    # Cleanup MCP client
    await shutdown_mcp()
    sim_task.cancel()

app = FastAPI(title="StadiumPulse API", lifespan=lifespan)

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://studio-1560217422-e282c.web.app",
        "https://studio-1560217422-e282c.firebaseapp.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {"status": "StadiumPulse API is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
