from mangum import Mangum
from nameguard.web_api import app


handler = Mangum(app, lifespan='off')
