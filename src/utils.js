// this function accepts json listings and returns them, formatted for leaflet use
export function formatListings(listings) {
  return listings.map(({latitude, longitude, ...listing}) => ({coords: [latitude, longitude], ...listing}))
}

// this function accepts listings, and filters according to a search string
// the Object.entries bit just means we're joining all the text fields before searching on them
export function filterListings(listings = {}, search = "") {
  return listings.filter(listing => Object.entries(listing).join(" ").toLowerCase().match(search.toLowerCase()))
}
