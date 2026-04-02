package axdecision.change_risk

default risky_change_detected = false

risky_change_detected if {
  some change in input.changes
  change.system_name == input.incident.system_name
  change.approved == false
  time.diff(time.parse_rfc3339_ns(input.incident.detected_at), time.parse_rfc3339_ns(change.changed_at), "minutes") <= 60
}

rationale := "Recent unapproved change detected within 60 minutes before incident" if {
  risky_change_detected
}
