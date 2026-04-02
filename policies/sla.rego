package axdecision.sla

default escalation_required = false

escalation_required if {
  input.system.criticality == "critical"
  input.incident.severity == "high"
}

escalation_required if {
  input.system.criticality == "critical"
  input.incident.severity == "medium"
  input.incident.open_minutes >= 30
}

rationale := "Critical system with elevated incident severity requires immediate escalation" if {
  escalation_required
}
