import os
from typing import List, Dict, Any
from groq import Groq

# Use the Llama 3 model that supports tool calling
MODEL = "llama-3.1-8b-instant"

def get_client():
    # Requires GROQ_API_KEY environment variable
    return Groq(api_key=os.getenv("GROQ_API_KEY"))

def chat_completion(messages: List[Dict[str, str]], tools=None) -> Any:
    client = get_client()
    kwargs = {
        "model": MODEL,
        "messages": messages,
        "temperature": 0.0,
    }
    if tools:
        kwargs["tools"] = tools
        kwargs["tool_choice"] = "auto"
    
    return client.chat.completions.create(**kwargs)
