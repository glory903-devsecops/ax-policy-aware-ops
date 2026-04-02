from src.infrastructure.opa.client import OpaClient

class EvaluatePolicyUseCase:
    def __init__(self, opa_client: OpaClient):
        """
        정책 평가 유스케이스 초기화.
        :param opa_client: OPA 서버와 통신하는 클라이언트
        """
        self.opa_client = opa_client

    def execute_sla(self, payload: dict) -> dict:
        """
        SLA 에스컬레이션 정책을 평가합니다.
        :param payload: 정책 평가용 입력 데이터
        :return: 평가 결과 (JSON)
        """
        return self.opa_client.evaluate("axdecision/sla", payload)

    def execute_change_risk(self, payload: dict) -> dict:
        """
        미승인 변경 리스크 정책을 평가합니다.
        :param payload: 정책 평가용 입력 데이터
        :return: 평가 결과 (JSON)
        """
        return self.opa_client.evaluate("axdecision/change_risk", payload)
