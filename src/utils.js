// this function accepts json listings and returns them, formatted for leaflet use
export function formatListings(listings) {
  return listings.map(({latitude, longitude, ...listing}) => ({coords: [latitude, longitude], ...listing}))
}

// this function accepts listings, and filters according to a search string
// the Object.entries bit just means we're joining all the text fields before searching on them
// update 12.28.21 - added optional tag argument. it runs a text search, using the same logic as "search" 
export function filterListings(listings = {}, searchParams, search = "") {
  const { age, tag, ...filters } = Object.fromEntries(searchParams)
  let filteredListings = listings
  filteredListings = filteredListings.filter(listing => Object.entries(filters).every(([ key, value ]) => Array.isArray(listing[key]) ? listing[key].includes(value) : listing[key] === value))
  filteredListings = filteredListings.filter(({ min_age, max_age }) => !age || ((!max_age || age <= max_age) && (!min_age || age >= min_age)))
  // tag is optional. it should perform a text search
  if (tag) filteredListings = filteredListings.filter(listing => Object.entries(listing).join(" ").toLowerCase().match(tag.toLowerCase()))
  filteredListings = filteredListings.filter(listing => Object.entries(listing).join(" ").toLowerCase().match(search.toLowerCase()))
  return filteredListings
}
