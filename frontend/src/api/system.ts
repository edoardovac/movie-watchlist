import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export const testBackendConnection = async (): Promise<string> => {
  const res = await fetch(`${API_URL}/hello`);
  if (!res.ok) throw new Error("Server responded with an error");
  return await res.text();
};
