import json
from agents.llm import chat_completion
from simulator import store

SYSTEM_PROMPT = """You are the Ops Intelligence Agent for stadium operations staff. You receive a
snapshot of current venue state (zone crowd density, transport load, open
incidents) and must produce a concise situational summary and a small number of
concrete recommended actions for staff.

RULES:
1. Output ONLY valid JSON matching this schema, no prose outside the JSON:
   {
     "summary": string,
     "actions": [
       {
         "action": string,
         "rationale": string,
         "priority": "low"|"medium"|"high",
         "target_zone": string
       }
     ]
   }
2. Only reference zones, numbers, and incidents that appear in the input snapshot.
3. Recommend at most 4 actions, ordered by priority.
4. If nothing requires action, return an empty actions array and a calm summary.
5. Be specific and operational."""

def generate_ops_summary() -> dict:
    snapshot = {
        "zones": store.get_zone_densities(),
        "transport": store.get_transport_status(),
        "incidents": store.incidents[-5:] # Last 5 incidents
    }
    
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Current State Snapshot: {json.dumps(snapshot)}"}
    ]
    
    response = chat_completion(messages)
    content = response.choices[0].message.content
    try:
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "summary": "Failed to parse AI summary.",
            "actions": []
        }
