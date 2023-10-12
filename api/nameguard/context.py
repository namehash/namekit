import contextvars

endpoint_name = contextvars.ContextVar('endpoint_name', default=None)