FROM --platform=linux/arm64 public.ecr.aws/lambda/python:3.11
WORKDIR /app
RUN yum install gcc -y
COPY pyproject.toml poetry.lock LICENSE README.md ./
COPY nameai ./nameai/
RUN pip install --no-cache-dir .[lambda]
CMD [ "nameai.root_api.handler" ]