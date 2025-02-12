import boto3
from dotenv import load_dotenv
from omegaconf import DictConfig
import hydra
import os

from nameai.data import get_resource_path


class S3Downloader:
    def __init__(self):
        self.s3_client = None
        self.bucket = None
        self.region_name = 'us-east-1'

    def get_client(self):
        if self.s3_client is None:
            load_dotenv()
            self.bucket = os.getenv('S3_BUCKET')
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=os.getenv('S3_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('S3_SECRET_ACCESS_KEY'),
                region_name=self.region_name,
            )

        return self.s3_client

    def download_file(self, key: str, local_path: str, overwrite: bool = False):
        if os.path.exists(local_path) and not overwrite:
            return
        self.get_client().download_file(self.bucket, key, local_path)


def download_files(config: DictConfig):
    """Download files using provided config"""
    downloader = S3Downloader()
    downloader.download_file(
        key=config.tokenization.person_names.first_names_s3_key,
        local_path=get_resource_path(config.tokenization.person_names.first_names_path),
        overwrite=True,
    )
    downloader.download_file(
        key=config.tokenization.person_names.last_names_s3_key,
        local_path=get_resource_path(config.tokenization.person_names.last_names_path),
        overwrite=True,
    )
    downloader.download_file(
        key=config.tokenization.person_names.other_s3_key,
        local_path=get_resource_path(config.tokenization.person_names.other_path),
        overwrite=True,
    )
    downloader.download_file(
        key=config.tokenization.person_names.country_stats_s3_key,
        local_path=get_resource_path(config.tokenization.person_names.country_stats_path),
        overwrite=True,
    )


@hydra.main(config_path='./config', config_name='prod_config', version_base=None)
def download_files_main(config: DictConfig):
    download_files(config)


if __name__ == '__main__':
    download_files_main()
