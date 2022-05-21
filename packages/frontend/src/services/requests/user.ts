const API_URL = "http://localhost:4000";

/**
 * Creates a new user profile.
 * @param userId - user's API key
 * @returns
 */
export async function createUser(userId: string): Promise<Response> {
  const ENDPOINT = "api/user";
  const HTTP_METHOD = "GET";

  const response = await fetch(`${API_URL}/${ENDPOINT}`, {
    method: HTTP_METHOD,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      API_KEY: `${userId}`
    },
  });

  return response;
}

/**
 * Retrieves most recent stock prices from user's portfolio.
 * @param userId - user's API key
 * @returns
 */
export async function getStocksFromUser(
  userId: string,
  currDate: string
): Promise<Response> {
  const ENDPOINT = "api/user/stock";
  const HTTP_METHOD = "POST";

  const response = await fetch(`${API_URL}/${ENDPOINT}`, {
    method: HTTP_METHOD,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      API_KEY: `${userId}`,
    },
    body: JSON.stringify({ date: currDate }),
  });

  return response;
}
