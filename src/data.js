export default async function getData(API_URL) {
  return new Promise(async (resolve) => resolve((await fetch(`${API_URL}/listings`)).json()))
}