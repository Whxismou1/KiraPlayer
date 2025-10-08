from fastapi import APIRouter, Depends
from app.core.db import supabase

router = APIRouter(prefix="/user", tags=["User"])

# @router.post("/add_favorite")
# def add_favorite(user_id: str, anime_id: str):
#     res = supabase.table("favorites").insert({"user_id": user_id, "anime_id": anime_id}).execute()
#     return {"message": "Added to favorites", "data": res.data}
