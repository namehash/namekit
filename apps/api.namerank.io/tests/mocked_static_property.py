from contextlib import contextmanager
from functools import wraps, cached_property
from unittest.mock import patch


def mocked_static_property(func):
    @cached_property
    @wraps(func)
    def wrapper(self):
        return func(self)

    return wrapper


@contextmanager
def mock_static_property():
    with patch('namerank.static_property.static_property', mocked_static_property):
        yield
