from mcp.server.fastmcp import FastMCP

mcp = FastMCP("ax-decision-fabric")

# -------------------------
# Resource: recent changes
# -------------------------
@mcp.resource("change://recent/{system_name}")
def get_recent_changes(system_name: str) -> str:
    sample_data = {
        "billing-api": [
            {"id": "chg-101", "changed_by": "ops_admin", "approved": False, "changed_at": "2026-04-02T09:20:00Z", "description": "Timeout config changed"},
            {"id": "chg-100", "changed_by": "dev_lead", "approved": True, "changed_at": "2026-04-01T17:10:00Z", "description": "Release 2.1.4 deployed"}
        ]
    }
    return str(sample_data.get(system_name, []))

# -------------------------
# Tool: search similar incidents
# -------------------------
@mcp.tool()
def search_similar_incidents(system_name: str, keyword: str) -> str:
    mock_results = [
        {
            "incident_id": "inc-9001",
            "system_name": system_name,
            "title": "5xx spike after config change",
            "resolution": "Rollback timeout setting and restart pods"
        },
        {
            "incident_id": "inc-8120",
            "system_name": system_name,
            "title": "DB pool saturation",
            "resolution": "Increase pool size and tune retry policy"
        }
    ]
    return str([x for x in mock_results if keyword.lower() in x["title"].lower()])

# -------------------------
# Prompt: incident analysis prompt
# -------------------------
@mcp.prompt()
def incident_analysis_prompt(system_name: str, severity: str, title: str) -> str:
    return f"""
You are an operations decision assistant.
Analyze the incident below and provide:
1. probable causes
2. policy risks
3. recommended next actions
4. whether escalation is needed

System: {system_name}
Severity: {severity}
Title: {title}
"""

if __name__ == "__main__":
    mcp.run()
