from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import AsyncIterator

from fastapi import FastAPI, Form, status, Query
from fastapi.responses import RedirectResponse, JSONResponse
from typing_extensions import TypedDict

from services.database import JSONDatabase


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle database management when running app."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []

    yield

    database.close()


app = FastAPI(lifespan=lifespan)


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now()
    quote = Quote(name=name, message=message, time=now.isoformat(timespec="seconds"))
    database["quotes"].append(quote)
    print(database, quote)

    # You may modify the return value as needed to support other functionality
    # return RedirectResponse("/#quotes", status.HTTP_303_SEE_OTHER)
    return JSONResponse(content=quote, status_code=status.HTTP_201_CREATED)


# TODO: add another API route with a query parameter to retrieve quotes based on max age
@app.get("/quotes")
def get_quotes(max_age: str = Query("all", enum=["week", "month", "year", "all"])) -> JSONResponse:
    """
    Retrieve quotes based on max age.
    """
    now = datetime.now()

    # dictionary to map max_age to timedelta
    age_deltas = {
        "week": timedelta(weeks=1),
        "month": timedelta(days=30),
        "year": timedelta(days=365),
        "all": None  # special case to include all quotes
    }

    # get the timedelta for the given max_age
    delta = age_deltas.get(max_age)

    # determine the cutoff date
    if delta is not None:
        cutoff_date = now - delta
    else:
        cutoff_date = datetime.min  # include all quotes if max_age is "all"

    # filter quotes based on the cutoff date
    filtered_quotes = [
        quote for quote in database["quotes"]
        if datetime.fromisoformat(quote["time"]) >= cutoff_date
    ]

    return JSONResponse(content=filtered_quotes)