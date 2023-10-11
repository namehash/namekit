FROM public.ecr.aws/lambda/python:3.11

WORKDIR /app

# TODO: remove after release
RUN yum install -y git

COPY pyproject.toml poetry.lock README.md ./
COPY nameguard ./nameguard/
RUN pip install --no-cache-dir .[lambda]

# warmup
RUN python -m nameguard.web_api
RUN python -m nameguard.lambda

CMD [ "nameguard.lambda.handler" ]