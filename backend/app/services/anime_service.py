import cloudscraper
from bs4 import BeautifulSoup
from animeflvV2 import AnimeFLV
import re
from functools import lru_cache
import time

class AnimeService(AnimeFLV):
    BASE_URL = "https://animeflv.net"

    def __init__(self):
        super().__init__()
        self.scraper = cloudscraper.create_scraper()
        self.scraper.headers.update({
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/128.0.0.0 Safari/537.36"
            )
        })
        self.cache = {}
        self.cache_ttl = 60 * 60
    
    def _cache_get(self, key):
        if key in self.cache:
            data, timestamp = self.cache[key]
            if time.time() - timestamp < self.cache_ttl:
                return data
            del self.cache[key]
        return None

    def _cache_set(self, key, value):
        self.cache[key] = (value, time.time())
    def resolve_streamtape(self, url: str) -> str | None:
        try:
            html = self.scraper.get(url).text
            match = re.search(r"document\.getElementById\('videolink'\)\.innerHTML\s*=\s*'(.+?)';", html)
            if match:
                partial = match.group(1).replace(" ", "")
                return f"https://streamtape.com/get_video{partial}"
        except Exception as e:
            print("Error resolviendo Streamtape:", e)
        return None
    def resolve_filemoon(self, url: str) -> str | None:
        try:
            html = self.scraper.get(url).text
            match = re.search(r'sources:\s*\[\{\s*file:\s*"(https://[^"]+\.mp4)"', html)
            if match:
                return match.group(1)
        except Exception as e:
            print("Error resolviendo Filemoon:", e)
        return None

    def get_video_servers_simplified(self, anime_id: str, episode: int):
        """
        Devuelve los servidores de vídeo para un anime y episodio.
        Ejemplo de anime_id: 'ansatsusha-de-aru-ore-no-status-ga-yuusha-yori-mo-akiraka-ni-tsuyoi-no-da-ga'
        """
        if not anime_id.startswith("anime/"):
            anime_id = f"anime/{anime_id}"

        anime_info = self.getAnimeInfo(anime_id)

        if not anime_info or len(anime_info) < 2:
            raise ValueError(f"No se pudo obtener información válida de {anime_id}")

        episodes_list = anime_info[1].get("episodes", [])
        if not episodes_list:
            raise ValueError(f"No hay episodios disponibles para {anime_id}")

        episode_data = next((e for e in episodes_list if e["episode"] == episode), episodes_list[0])
        episode_id = episode_data["id"]


        servers_data = self.get_video_servers(episode_id)

        servers = servers_data[0] if isinstance(servers_data, list) and len(servers_data) > 0 else []

        return [
            {
                "server": s.get("server"),
                "title": s.get("title"),
                "url": s.get("url"),
                "embed": s.get("code"),
                "allow_mobile": s.get("allow_mobile"),
                "ads": s.get("ads"),
            }
            for s in servers
            if s.get("allow_mobile") 
        ]


    def getAll(self, page: int):
        data = super().allAnime(page)

        for item in data:
            if item.get("id", "").startswith("anime/"):
                item["id"] = item["id"].replace("anime/", "")
        return data


    def search_anime(self, query: str):
        data = super().search(query)
        for item in data:
            if item.get("id", "").startswith("anime/"):
                item["id"] = item["id"].replace("anime/", "")
        return data


    def get_latest_animes(self):
        data = super().get_latest_animes()

        cleaned = []
        for item in data:
            # Convertimos a dict si no lo es
            if not isinstance(item, dict):
                item = item.__dict__

            if item.get("id", "").startswith("anime/"):
                item["id"] = item["id"].replace("anime/", "")

            cleaned.append(item)

        return cleaned
    
    def getAnimeInfo(self, anime_id: str):
        if not anime_id.startswith("anime/"):
            anime_id = f"anime/{anime_id}"
        return super().getAnimeInfo(anime_id)
    
    def get_detailed_info(self, anime_id: str):
        """Devuelve la info extendida de un anime con caché"""
        cache_key = f"anime_info:{anime_id}"
        cached = self._cache_get(cache_key)
        if cached:
            return cached

        try:
            data = self.getAnimeInfo(anime_id)
            main = data[0] if len(data) > 0 else {}
            extra = data[1] if len(data) > 1 else {}

            full_info = {
                "id": extra.get("id", anime_id),
                "title": main.get("title"),
                "poster": main.get("poster"),
                "cover": main.get("poster"),
                "description": main.get("synopsis", ""),
                "rating": main.get("rating", "0"),
                "status": "emision" if "emision" in (main.get("debut", "") or "").lower() else "finalizado",
                "genres": extra.get("genres", []),
                "episodes": extra.get("episodes", []),
            }

            self._cache_set(cache_key, full_info)
            return full_info
        except Exception as e:
            print(f"Error al obtener info detallada de {anime_id}: {e}")
            return None
    
    def filter_animes(self, filters: dict):
        """
        Filtros posibles: rating, status, genres (lista), year
        """
        print("[INFO] Aplicando filtros:", filters)

        # 🔁 usa la caché para no recargar
        cache_key = f"filter:{str(filters)}"
        cached = self._cache_get(cache_key)
        if cached:
            return cached

        # 🔹 base: lista de animes
        all_animes = self.get_latest_animes()

        filtered = []
        for anime in all_animes:
            anime_id = anime.get("id", "")
            detailed = self.get_detailed_info(anime_id)
            if not detailed:
                continue

            # Filtros
            if "rating" in filters:
                try:
                    if float(detailed.get("rating", 0)) < float(filters["rating"]):
                        continue
                except:
                    pass

            if "status" in filters and filters["status"]:
                if detailed.get("status") != filters["status"]:
                    continue

            if "genres" in filters and filters["genres"]:
                if not any(g in detailed.get("genres", []) for g in filters["genres"]):
                    continue

            if "year" in filters and filters["year"]:
                debut = detailed.get("debut") or ""
                if str(filters["year"]) not in debut:
                    continue

            filtered.append(detailed)

        self._cache_set(cache_key, filtered)
        print(f" {len(filtered)} resultados tras filtrar.")
        return filtered
