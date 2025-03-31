import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export const createWatchlist = async (
  token: string,
  name: string,
  notes?: string
) => {
  console.log(`${API_URL}/watchlists`);
  console.log(JSON.stringify({ name, notes }));
  try {
    const res = await fetch(`${API_URL}/watchlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, notes }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to create watchlist");

    console.log("Created watchlsit", data);
    return data;
  } catch (err) {
    console.log("Error:", err);
  }
};

export const fetchWatchlists = async (token: string) => {
  const res = await fetch(`${API_URL}/watchlists/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to fetch watchlist");

  return data;
};

export const deleteWatchlists = async (token: string, id: number) => {
  const res = await fetch(`${API_URL}/watchlists/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete watchlist");
  }
};

export const updateWatchlists = async (
  token: string,
  id: number,
  name: string,
  notes?: string
) => {
  const res = await fetch(`${API_URL}/watchlists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, notes }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to update watchlist");

  return data;
};
