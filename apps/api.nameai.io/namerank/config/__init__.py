from pathlib import Path
from typing import Literal
from contextlib import contextmanager
from hydra import initialize_config_module, compose
import omegaconf


@contextmanager
def initialize_namerank_config(config_name: Literal['prod_config']):
    with initialize_config_module(version_base=None, config_module='namerank.config'):
        config = compose(config_name=config_name)
        yield config


def load_namerank_config(config_name: Literal['prod_config']):
    config_path = Path(__file__).parent / (config_name + '.yaml')
    with config_path.open('r') as f:
        config = omegaconf.OmegaConf.load(f)
    return config
