from fastapi import APIRouter, Query, Body
from app.services.anime_service import AnimeService
from typing import Any

router = APIRouter(prefix="/anime", tags=["Anime"])
anime_service = AnimeService()

@router.get("/search")
def search_anime(q: str):
    return anime_service.search_anime(q)

@router.get("/latest")
def search_anime():
    return anime_service.get_latest_animes()

@router.get("/all")
def search_anime(page: int):
    return anime_service.getAll(page)

@router.get("/{anime_id}", response_model=None)
def get_anime_info(anime_id: str) -> Any:
    return anime_service.getAnimeInfo(anime_id)

@router.get("/links/{anime_id}/{episode}")
def get_links(anime_id: str, episode: int):
    return anime_service.get_video_servers_simplified(anime_id, episode)

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "Anime service is healthy!"}

@router.post("/filter")
def filter_animes(filters: dict = Body(...)):
    return anime_service.filter_animes(filters)