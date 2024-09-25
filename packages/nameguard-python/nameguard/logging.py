import logging


logger = logging.getLogger('nameguard')
logger.setLevel(logging.DEBUG)
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
stream_handler.setLevel(logging.DEBUG)
logger.addHandler(stream_handler)
