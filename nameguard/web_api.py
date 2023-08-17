from fastapi import FastAPI
from pydantic import BaseModel

from nameguard.nameguard import NameGuard


app = FastAPI()
nameguard = NameGuard()


class CheckNameRequest(BaseModel):
    name: str


class CheckNameResponse(BaseModel):
    verdict: str
    check_results: list[str]


@app.post("/")
async def check_name(request: CheckNameRequest) -> CheckNameResponse:
    verdict, check_results = nameguard.check_name(request.name)
    return CheckNameResponse(
        verdict=verdict.name,
        check_results=[str(result) for result in check_results],
    )
