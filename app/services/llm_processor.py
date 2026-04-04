import re
from typing import Dict, Any

class LLMProcessor:
    """
    Simulated LLM Service for AX Prototype.
    Parses natural language (Korean) to extract business context.
    """
    
    @staticmethod
    def process_inquiry(text: str) -> Dict[str, Any]:
        # Pre-cleaning
        clean_text = text.replace(" ", "")
        
        # 1. Extract Client (Construction/Engineering focus)
        # Search for words ending with '건설', '엔지니어링', '건축' or known names 'AECOM', '현대', '삼성' etc.
        client = None
        client_match = re.search(r"([가-힣a-zA-Z0-9]+건설|[가-힣a-zA-Z0-9]+엔지니어링|AECOM|삼성물산|현대건설|미국공병단)", text)
        if client_match:
            client = client_match.group(1)
        
        # 2. Extract VIP status
        is_vip = "VIP" in text.upper() or "브이아이피" in text or "중요고급" in text
        
        # 3. Extract PoC status
        is_poc = "PoC" in text.upper() or "피오씨" in text or "테스트중" in text or "검증중" in text
        
        # 4. Extract Contract Value (e.g. 500억, 10억)
        contract_value = 0.0
        value_match = re.search(r"(\d+)(억|억원)", text)
        if value_match:
            contract_value = float(value_match.group(1)) * 100000000
            
        # 5. Extract Severity
        severity = "medium"
        if any(word in text for word in ["긴급", "심각", "멈춤", "중단", "마비", "P1", "critical"]):
            severity = "critical"
        elif any(word in text for word in ["오류", "버그", "수정", "P2", "high"]):
            severity = "high"
            
        return {
            "client": client,
            "is_vip": is_vip,
            "is_poc": is_poc,
            "contract_value": contract_value,
            "severity": severity
        }
