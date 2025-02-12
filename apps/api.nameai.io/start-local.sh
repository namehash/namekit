source .env
pip install --upgrade pip
pip install poetry
pip install uvicorn
pip install .[lambda]
python -m nameai.download
uvicorn nameai.root_api:app