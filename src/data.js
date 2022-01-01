const getListings = async API_URL => (await fetch(`${API_URL}/listings`)).json()
const getListingCategories = async API_URL => (await fetch(`${API_URL}/listing-categories`)).json()

export { getListings, getListingCategories }