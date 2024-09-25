from typing import Optional
from contextvars import ContextVar


endpoint_name: ContextVar[Optional[str]] = ContextVar('endpoint_name', default=None)
