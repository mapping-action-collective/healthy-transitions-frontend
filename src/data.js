const getListings = async API_URL => (await fetch(`${API_URL}/listings`)).json()
const getMeta = async API_URL => (await fetch(`${API_URL}/meta`)).json()


export { getListings, getMeta }
