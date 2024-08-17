async function fetchCSV() {
  const url = 'https://docs.google.com/spreadsheets/d/1oijYgt0-3uAmo_RKh5ReR9Z4P7oyS6dYBIytKxvEL_Y/pub?gid=1305846011&single=true&output=csv';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('There has been a problem with fetch operation:', error);
  }
}

function extractAndParseJSON(csv: string) {
  const lines = csv.split(/\r\n|\n/);
  if (lines.length > 1) {

    const returnValues = ['', '', ''];
    returnValues.forEach((item, index) => {
      try {
        let jsonString = lines[index];
        if (jsonString.startsWith('"')) jsonString = jsonString.substring(1);
        if (jsonString.endsWith('"')) jsonString = jsonString.slice(0, -1);
        jsonString = jsonString.replace(/""/g, '"');
        item = JSON.parse(jsonString);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
      }
    });
    return returnValues;
  } else {
    console.error('CSV data does not contain expected JSON string.');
    return null;
  }
}



export async function getJsObjects() {
  const csvData = await fetchCSV();
  if (csvData) return extractAndParseJSON(csvData);
}

export const jsObjects = getJsObjects();
