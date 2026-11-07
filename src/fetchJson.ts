let cachedData: Array<JSON> | null = null;

export async function getJsObjects() {
  if (cachedData) {
    return cachedData;
  }

  // Otherwise, fetch the data
  const url = "test-data.json";

  const response = await fetch(url);

  if (!response.ok)
    throw new Error("Network response was not ok " + response.statusText);

  // Cache the data
  cachedData = await response.json();

  // Return the fetched data
  return cachedData;
}
