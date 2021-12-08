const getListings = async API_URL => (await fetch(`${API_URL}/listings`)).json()

export { getListings}