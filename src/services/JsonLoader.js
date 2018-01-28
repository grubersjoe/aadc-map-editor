export async function loadJson(url) {
  return fetch(url)
    .then(res => res.json());
}
