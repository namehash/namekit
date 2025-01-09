source .env
pip install --upgrade pip
pip install poetry
pip install uvicorn
pip install .[lambda]
uvicorn namerank.root_api:app