# Load Tests for NameAI API

This directory contains load testing scripts for the NameAI API using [Locust](https://locust.io/).

## Start NameAI API

In one terminal, start the NameAI API:

```bash
poetry run uvicorn nameai.nameai_api:app
```

## Install locust

In another terminal, activate the poetry environment and install locust:

```bash
poetry run pip install locust
```

## Run tests

Navigate to the `load_tests` directory and use one of the following options:

### Tests in Web UI

Start the load test with:
```bash
poetry run locust -f performance.py
```
Then open http://localhost:8089 in your browser to:
- Configure number of users
- Set spawn rate
- Start/stop tests
- View real-time metrics and charts

### Headless tests

You can run headless tests with these parameters:
```bash
poetry run locust -f performance.py --headless -u 100 -r 10 --run-time 1m -H "http://localhost:8000" --only-summary
```

This will:
- Run with 100 users
- Spawn 10 users per second
- Run for 1 minute
- Generate HTML reports


### Test latency for different number of users

```bash
poetry run bash run_load_tests.sh
```

This will run the test with different number of users and save the results in `latency_results.csv`.
