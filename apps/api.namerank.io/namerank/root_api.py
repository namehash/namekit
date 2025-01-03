from namerank.namerank_api import app as namerank_app
from nameguard.web_api import app as nameguard_app
from mangum import Mangum

# root app
app = nameguard_app

# namerank as sub-app
app.mount('/namerank', namerank_app)

handler = Mangum(app)
