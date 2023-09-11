FROM public.ecr.aws/lambda/python:3.11

WORKDIR /app

# TODO: remove after release
RUN yum install -y git

COPY pyproject.toml poetry.lock README.md LICENSE ./
COPY nameguard ./nameguard/
RUN pip install --no-cache-dir .[lambda]

CMD [ "nameguard.lambda.handler" ]
