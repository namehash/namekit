import pytest
import os
from pathlib import Path
from dotenv import load_dotenv
from hydra import initialize_config_module, compose

from nameai.data import get_resource_path


@pytest.fixture(scope='session', autouse=True)
def ensure_files_downloaded():
    """Ensure required files are downloaded before running tests."""
    load_dotenv()

    required_vars = ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        pytest.skip(f"Missing required environment variables: {', '.join(missing_vars)}")

    with initialize_config_module(version_base=None, config_module='nameai.config'):
        config = compose(config_name='prod_config')
        required_files = [
            config.tokenization.person_names.first_names_path,
            config.tokenization.person_names.last_names_path,
            config.tokenization.person_names.other_path,
            config.tokenization.person_names.country_stats_path,
        ]
        all_files_exist = all(Path(get_resource_path(file_path)).is_file() for file_path in required_files)
        if not all_files_exist:
            from nameai.download import download_files

            download_files(config)
