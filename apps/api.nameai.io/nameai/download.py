import boto3
import botocore
from omegaconf import DictConfig
import hydra
import os

from nameai.data import get_resource_path


class S3Downloader:
    def __init__(self, bucket: str):
        self.s3_client = None
        self.bucket = bucket
        self.region_name = 'us-east-1'

    def get_client(self):
        if self.s3_client is None:
            self.s3_client = boto3.client(
                's3', region_name=self.region_name, config=botocore.config.Config(signature_version=botocore.UNSIGNED)
            )
        return self.s3_client

    def download_file(self, key: str, local_path: str, overwrite: bool = False):
        if os.path.exists(local_path) and not overwrite:
            return
        self.get_client().download_file(self.bucket, key, local_path)


def download_files(config: DictConfig):
    """Download files using provided config"""
    downloader = S3Downloader(config.s3_resources.bucket)
    files_to_download = [
        (config.s3_resources.person_names.first_names_key, config.tokenization.person_names.first_names),
        (config.s3_resources.person_names.last_names_key, config.tokenization.person_names.last_names),
        (config.s3_resources.person_names.other_key, config.tokenization.person_names.other),
        (config.s3_resources.person_names.country_stats_key, config.tokenization.person_names.country_stats),
    ]

    for s3_key, local_path in files_to_download:
        downloader.download_file(
            key=s3_key,
            local_path=get_resource_path(local_path),
            overwrite=True,
        )


@hydra.main(config_path='./config', config_name='prod_config', version_base=None)
def download_files_main(config: DictConfig):
    download_files(config)


if __name__ == '__main__':
    download_files_main()
