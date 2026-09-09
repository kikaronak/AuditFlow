from abc import ABC, abstractmethod
from ai.contracts.model_contract import StandardModelResult


class ModelAdapter(ABC):
    @abstractmethod
    def run(self, payload: dict) -> StandardModelResult:
        raise NotImplementedError
