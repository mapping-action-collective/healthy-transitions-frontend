const getListings = async API_URL => (await fetch(`${API_URL}/listings`)).json()
const getListingMetadata = async API_URL => (await fetch(`${API_URL}/listing-meta`)).json()
const getStaticText = async API_URL => (await fetch(`${API_URL}/content`)).json()

export { getListings, getListingMetadata, getStaticText }