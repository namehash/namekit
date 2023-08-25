from enum import Enum
from fastapi import FastAPI
from pydantic import BaseModel

from nameguard.nameguard import NameGuard
from nameguard.models.result import NameGuardResult


class ApiVersion(int, Enum):
    V1 = 1


app = FastAPI()
nameguard = NameGuard()


class InspectNameRequest(BaseModel):
    name: str


@app.post('/{api_version}/inspect-name')
async def inspect_name(api_version: ApiVersion, request: InspectNameRequest) -> NameGuardResult:
    if api_version != ApiVersion.V1:
        raise Exception(f'API version {api_version} not supported')
    return nameguard.inspect_name(request.name)
