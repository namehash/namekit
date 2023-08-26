from enum import Enum
from fastapi import FastAPI
from pydantic import BaseModel

from nameguard.nameguard import NameGuard
from nameguard.models import NameGuardResult, NameGuardBulkResult


class ApiVersion(str, Enum):
    V1 = 'v1'


app = FastAPI()
nameguard = NameGuard()


# -- inspect-name --


class InspectNameRequest(BaseModel):
    name: str


@app.post('/{api_version}/inspect-name')
async def inspect_name(api_version: ApiVersion, request: InspectNameRequest) -> NameGuardResult:
    if api_version != ApiVersion.V1:
        raise Exception(f'API version {api_version} not supported')
    return nameguard.inspect_name(request.name)


@app.get('/{api_version}/inspect-name/{name}')
async def inspect_name_get(api_version: ApiVersion, name: str) -> NameGuardResult:
    return await inspect_name(api_version, InspectNameRequest(name=name))


@app.get('/{api_version}/inspect-name')
async def inspect_name_get(api_version: ApiVersion) -> NameGuardResult:
    return await inspect_name(api_version, InspectNameRequest(name=''))


# -- bulk-inspect-name --


class BulkInspectNameRequest(BaseModel):
    names: list[str]


@app.post('/{api_version}/bulk-inspect-name')
async def bulk_inspect_name(api_version: ApiVersion, request: BulkInspectNameRequest) -> NameGuardBulkResult:
    if api_version != ApiVersion.V1:
        raise Exception(f'API version {api_version} not supported')
    return nameguard.bulk_inspect_name(request.names)
