from typing import TypeVar, Callable
from functools import wraps, cached_property
import os
import pickle
import shutil
from nameai.data import get_resource_path
from nameai.config import initialize_namerank_config


R = TypeVar('R')

DATA_DIR = get_resource_path('static')
REGISTERED_FUNCTIONS = set()


def static_property(func: Callable[..., R]) -> cached_property[R]:
    """
    Works like functools.cached_property, but uses pickle to store the value.
    Data is generated manually with `python -m nameai.generate_static_data`.
    The pickle path is `nameai/data/static/{module}.{class}.{func}.pickle`.
    """
    pickle_name = f'{func.__module__}.{func.__qualname__}'

    @cached_property
    @wraps(func)
    def wrapper(self):
        data_file = os.path.join(DATA_DIR, f'{pickle_name}.pickle')
        try:
            with open(data_file, 'rb') as f:
                val: R = pickle.load(f)
                return val
        except FileNotFoundError:
            raise FileNotFoundError(
                f'Static data file for {pickle_name} not found. '
                'Run `python -m nameai.generate_static_data` to generate it.'
            )

    # register function for static data generation
    module = func.__module__
    class_name, func_name = func.__qualname__.split('.')
    REGISTERED_FUNCTIONS.add((module, class_name, func_name, func))

    return wrapper


def generate_static_data():
    """
    Generates static data for all registered static_property functions.
    Writes the data to `{DATA_DIR}/{module}.{class}.{func}.pickle`
    """
    with initialize_namerank_config('prod_config') as config:
        print('Removing old static data')
        shutil.rmtree(DATA_DIR, ignore_errors=True)
        os.makedirs(DATA_DIR, exist_ok=False)
        import nameai.namerank  # noqa: F401

        for module, class_name, func_name, func in REGISTERED_FUNCTIONS:
            print(f'Generating {module}.{class_name}.{func_name}')
            module = __import__(module, fromlist=[class_name])
            cls = getattr(module, class_name)
            try:
                obj = cls()
            except TypeError:
                obj = cls(config)
            result = func(obj)
            data_file = os.path.join(DATA_DIR, f'{module.__name__}.{class_name}.{func_name}.pickle')
            with open(data_file, 'wb') as f:
                pickle.dump(result, f)
