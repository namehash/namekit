from nameai.nameai_api import app as nameai_app
from nameguard.web_api import app as nameguard_app
from mangum import Mangum

# root app
app = nameai_app

# nameguard as sub-app
app.mount('/nameguard', nameguard_app)

handler = Mangum(app)
