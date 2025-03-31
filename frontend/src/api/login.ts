import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export const loginUser = async (
  username: string,
  password: string
): Promise<string> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data.token;
};
