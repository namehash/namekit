from namerank.namerank_api import app as namerank_app
from nameguard.web_api import app as nameguard_app
from mangum import Mangum

# root app
app = namerank_app

# nameguard as sub-app
app.mount('/nameguard', nameguard_app)

handler = Mangum(app)
