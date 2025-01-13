import os


def get_resource_path(path):
    return os.path.join(os.path.dirname(__file__), path)
