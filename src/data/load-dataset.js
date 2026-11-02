import { validateDataset } from './validate-dataset.js';

export async function loadDataset(baseUrl, fetchResource = fetch) {
  async function loadJson(filename) {
    let response;
    try {
      response = await fetchResource(`${baseUrl}data/${filename}`);
    } catch (cause) {
      throw new Error(`Could not download ${filename}. Check your connection and reload.`, {
        cause,
      });
    }
    if (!response.ok) {
      throw new Error(`Could not load ${filename} (HTTP ${response.status}).`);
    }
    try {
      return await response.json();
    } catch (cause) {
      throw new Error(`${filename} contains invalid JSON.`, { cause });
    }
  }

  const [associations, puzzles, metadata] = await Promise.all([
    loadJson('associations.json'),
    loadJson('puzzles.json'),
    loadJson('metadata.json'),
  ]);

  return validateDataset({ associations, puzzles, metadata });
}
