const getListings = async API_URL => (await fetch(`${API_URL}/listings`)).json()
const getListingMetadata = async API_URL => (await fetch(`${API_URL}/listing-meta`)).json()


export { getListings, getListingMetadata }
