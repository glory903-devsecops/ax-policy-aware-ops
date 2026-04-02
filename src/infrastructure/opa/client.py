import requests

class OpaClient:
    def __init__(self, base_url: str):
        """
        OPA 클라이언트 초기화.
        :param base_url: OPA 서버의 기본 URL (예: http://localhost:8181)
        """
        self.base_url = base_url.rstrip("/")

    def evaluate(self, package_path: str, payload: dict) -> dict:
        """
        지정된 정책 패키지에 대해 입력을 평가합니다.
        :param package_path: 정책 패키지 경로 (예: axdecision/sla)
        :param payload: 평가에 사용할 입력 데이터 (input 객체)
        :return: 정책 평가 결과 (JSON)
        """
        url = f"{self.base_url}/v1/data/{package_path}"
        response = requests.post(url, json={"input": payload}, timeout=5)
        response.raise_for_status()
        return response.json()
