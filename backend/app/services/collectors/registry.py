from typing import Dict, Optional, List
from .base import BaseWebinarCollector
from .nist_nice import NistNiceCollector
from .roc_ph import RocPhCollector

class CollectorRegistry:
    """
    Registry for modular external webinar source collectors.
    """
    _collectors: Dict[str, BaseWebinarCollector] = {}

    @classmethod
    def register_all(cls):
        cls.register(NistNiceCollector())
        cls.register(RocPhCollector())

    @classmethod
    def register(cls, collector: BaseWebinarCollector):
        cls._collectors[collector.source_code] = collector

    @classmethod
    def get(cls, source_code: str) -> Optional[BaseWebinarCollector]:
        if not cls._collectors:
            cls.register_all()
        return cls._collectors.get(source_code)

    @classmethod
    def list_sources(cls) -> List[str]:
        if not cls._collectors:
            cls.register_all()
        return list(cls._collectors.keys())

# Auto initialize
CollectorRegistry.register_all()
