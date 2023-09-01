FROM public.ecr.aws/lambda/python:3.11

WORKDIR /app

# TODO: remove after release
RUN yum install -y git
RUN mkdir -p ~/.ssh
RUN ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

COPY pyproject.toml poetry.lock README.md LICENSE ./
COPY nameguard ./nameguard/
RUN --mount=type=ssh pip install --no-cache-dir .[lambda]

CMD [ "nameguard.lambda.handler" ]
