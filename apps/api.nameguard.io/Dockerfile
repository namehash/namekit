FROM --platform=linux/arm64 public.ecr.aws/lambda/python:3.11

WORKDIR /app

COPY ../../packages/nameguard-python/pyproject.toml ../../packages/nameguard-python/poetry.lock ../../packages/nameguard-python/LICENSE ../../packages/nameguard-python/README.md ./
COPY ../../packages/nameguard-python/nameguard ./nameguard/
RUN pip install --no-cache-dir .[lambda]

# warmup
RUN python -m nameguard.web_api
RUN python -m nameguard.lambda

CMD [ "nameguard.lambda.handler" ]
