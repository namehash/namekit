FROM --platform=linux/arm64 public.ecr.aws/lambda/python:3.11

WORKDIR /app

COPY pyproject.toml poetry.lock LICENSE README.md ./
COPY nameguard ./nameguard/
RUN pip install --no-cache-dir .[lambda]

# warmup
RUN python -m nameguard.web_api
RUN python -m nameguard.lambda

CMD [ "nameguard.lambda.handler" ]
