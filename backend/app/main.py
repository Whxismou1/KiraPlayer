from fastapi import FastAPI
from app.api import anime, user

app = FastAPI(title="KiraPlayer Backend")

app.include_router(anime.router)
app.include_router(user.router)
