from dataclasses import dataclass
from datetime import datetime

@dataclass
class ChangeEvent:
    id: str
    system_name: str
    changed_by: str
    changed_at: datetime
    description: str