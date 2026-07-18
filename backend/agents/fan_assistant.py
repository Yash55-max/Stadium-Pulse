import json
import uuid
from agents.llm import chat_completion
import utils

SYSTEM_PROMPT = """You are the StadiumPulse Fan Assistant for a FIFA World Cup 2026 venue. You help fans
with navigation, accessibility, transportation, amenities, policies, and general venue questions.

RULES (do not violate):
1. Always respond in the same language the user wrote in. If you cannot confidently detect the language, default to English and ask which language they prefer.
2. NEVER invent directions, distances, gate numbers, amenity locations, or policies. Use the tools provided.
3. If the user indicates an accessibility need, use the get_route tool with accessibility=true.
4. For transport questions, use get_transport_status and reason over current load.
5. If the message describes an emergency, call file_incident immediately.
6. Keep responses concise and scannable.
7. Never fabricate a tool result."""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_route",
            "description": "Get walking directions between two named points in the stadium.",
            "parameters": {
                "type": "object",
                "properties": {
                    "from_location": {"type": "string"},
                    "to_location": {"type": "string"},
                    "accessibility": {"type": "boolean", "description": "Set to true if step-free routing is needed."}
                },
                "required": ["from_location", "to_location"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_knowledge",
            "description": "Search the venue knowledge base for policies, FAQs, and amenities.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_transport_status",
            "description": "Get current transportation load and delay information.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "file_incident",
            "description": "File a report for a medical, safety, or facility emergency.",
            "parameters": {
                "type": "object",
                "properties": {
                    "raw_text": {"type": "string", "description": "The description of the incident"},
                    "reported_by": {"type": "string", "description": "Who is reporting it (e.g., 'fan')"}
                },
                "required": ["raw_text", "reported_by"]
            }
        }
    }
]

def handle_chat(messages: list) -> dict:
    # Ensure system prompt is first
    if not messages or messages[0].get("role") != "system":
        messages.insert(0, {"role": "system", "content": SYSTEM_PROMPT})
        
    trace_id = str(uuid.uuid4())
    tool_calls_trace = []
    
    # 1. First call to LLM
    response = chat_completion(messages, tools=TOOLS)
    msg = response.choices[0].message
    
    # 2. Check for tool calls
    if msg.tool_calls:
        messages.append(msg)
        for tool_call in msg.tool_calls:
            func_name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)
            
            tool_calls_trace.append({"name": func_name, "arguments": args})
            
            result = None
            if func_name == "get_route":
                result = utils.get_route(args.get("from_location"), args.get("to_location"), args.get("accessibility", False))
            elif func_name == "search_knowledge":
                result = utils.search_knowledge(args.get("query"))
            elif func_name == "get_transport_status":
                result = utils.get_transport_status()
            elif func_name == "file_incident":
                result = utils.file_incident(args.get("raw_text"), args.get("reported_by", "fan"))
                
            tool_calls_trace[-1]["result"] = result
                
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "name": func_name,
                "content": json.dumps(result)
            })
            
        # 3. Second call to LLM to summarize tool results
        response = chat_completion(messages, tools=TOOLS)
        final_msg = response.choices[0].message
        return {
            "text": final_msg.content,
            "trace_id": trace_id,
            "trace_details": tool_calls_trace,
            "messages": messages + [final_msg]
        }
    else:
        return {
            "text": msg.content,
            "trace_id": trace_id,
            "trace_details": tool_calls_trace,
            "messages": messages + [msg]
        }
