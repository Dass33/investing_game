let cachedData: Array<JSON> | null = null;

export async function getJsObjects() {
  if (cachedData) {
    return cachedData;
  }

  // Otherwise, fetch the data
  const url = 'https://docs.google.com/spreadsheets/d/1oijYgt0-3uAmo_RKh5ReR9Z4P7oyS6dYBIytKxvEL_Y/pub?gid=1305846011&single=true&output=tsv';

  const response = await fetch(url);

  if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

  const data = await response.text();

  const lines = data.trim().split('\n');

  const config = JSON.parse(lines[0]);
  const events = JSON.parse(lines[1]);
  const products = JSON.parse(lines[2]);

  // Cache the data
  cachedData = [config, events, products];

  // Return the fetched data
  return cachedData;
}

