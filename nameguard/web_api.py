from enum import Enum
from fastapi import FastAPI
from pydantic import BaseModel, Field

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
    return nameguard.inspect_name(request.name)


@app.get('/{api_version}/inspect-name/{name}')
async def inspect_name_get(api_version: ApiVersion, name: str) -> NameGuardResult:
    return await inspect_name(api_version, InspectNameRequest(name=name))


@app.get('/{api_version}/inspect-name')
async def inspect_name_get_empty(api_version: ApiVersion) -> NameGuardResult:
    return await inspect_name(api_version, InspectNameRequest(name=''))


# -- bulk-inspect-name --


class BulkInspectNameRequest(BaseModel):
    # max elements: 250
    names: list[str] = Field(..., max_items=250)


@app.post('/{api_version}/bulk-inspect-names')
async def bulk_inspect_names(api_version: ApiVersion, request: BulkInspectNameRequest) -> NameGuardBulkResult:
    return nameguard.bulk_inspect_names(request.names)
