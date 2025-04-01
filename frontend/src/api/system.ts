import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export const testBackendConnection = async (): Promise<string> => {
  const response = await fetch(`${API_URL}/hello`);
  if (!response.ok) throw new Error("Server responded with an error");
  return await response.text();
};
