import json
from agents.llm import chat_completion

SYSTEM_PROMPT = """You classify incoming incident reports (from fans or staff) for stadium operations.

RULES:
1. Output ONLY valid JSON matching this schema:
   {
     "type": "medical" | "security" | "crowd_control" | "facility" | "lost_person" | "other",
     "severity": "low" | "medium" | "high" | "critical",
     "recommended_response": string
   }
2. Err toward higher severity when the report is ambiguous but could involve injury, danger, or a minor separated from their group.
3. Do not add commentary, apologies, or disclaimers outside the JSON object."""

async def classify_incident(raw_text: str) -> dict:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Incident report: {raw_text}"}
    ]
    response = await chat_completion(messages)
    content = response.choices[0].message.content
    try:
        # Sometimes LLMs wrap JSON in markdown blocks
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        return json.loads(content)
    except json.JSONDecodeError:
        # Fallback if the LLM fails schema
        return {
            "type": "other",
            "severity": "high",
            "recommended_response": "Manual triage required; LLM parse failed."
        }
