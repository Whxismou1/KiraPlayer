import { API_URL } from "./config";

async function fetchJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(" Error HTTP:", response.status, response.statusText);
      return null;
    }
    return await response.json();
  } catch (err) {
    console.error("Error de red o parseo:", err);
    return null;
  }
}

export async function getLatestAnimes() {
  return await fetchJson(`${API_URL}/anime/latest`);
}

export async function searchAnime(query) {
  return await fetchJson(`${API_URL}/anime/search?q=${encodeURIComponent(query)}`);
}

export async function getAnimeInfo(animeId) {
  return await fetchJson(`${API_URL}/anime/${encodeURIComponent(animeId)}`);
}

export async function getLinks(animeId, episode) {

  return await fetchJson(`${API_URL}/anime/links/${encodeURIComponent(animeId)}/${episode}`);
}

export async function getAllAnimes(page = 1) {
  const url = `${API_URL}/anime/all?page=${page}`;
  const data = await fetchJson(url);
  return data;
}


export async function healthCheck() {
  return await fetchJson(`${API_URL}/health`);
}

export async function filterAnimes(filters = {}) {
  try {
    const response = await fetch(`${API_URL}/anime/filter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      console.error("Error HTTP:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error de red o parseo en filterAnimes:", err);
    return [];
  }
}
