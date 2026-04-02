from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Incident:
    id: str
    system_name: str
    severity: str
    title: str
    detected_at: datetime
    resolved_at: Optional[datetime] = None
    root_cause: Optional[str] = None