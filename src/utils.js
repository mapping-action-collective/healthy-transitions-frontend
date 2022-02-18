// TODO: see if there's a clearer/shorter way to rewrite this. possibly don't hard code it
// Sorts listings and puts all listings containing a "Youth Services" keyword first. Returns mutated copy of same object.
function sortListings(listings, keyword1, keyword2) {
  let sortedListings = listings.sort((listing1, listing2) => {
    // ------- privilege listings with an address (3rd priority)
    if (listing1.full_address && !listing2.full_address) {
      return -1
    }
    if (!listing1.full_address && listing2.full_address) {
      return 1
    }
    return 0
  })
  
  // Sort is stable, so each sort function will preserve the previous sort order, and sort within that
  // ----- Sort by keyword2 (2nd priority)
  if (keyword2) {
    sortedListings = sortedListings.sort((listing1, listing2) => {
      if (listing1.keywords?.includes(keyword2) && !listing2.keywords?.includes(keyword2)) {
        return -1
      }
      if (!listing1.keywords?.includes(keyword2) && listing2.keywords?.includes(keyword2)) {
        return 1
      }
      return 0
    })
  }

  // Privilege listings in Eugene for now
  // TODO: set this to the user's location if possible
  sortedListings = sortedListings.sort((listing1, listing2) => {
    if (listing1.full_address?.includes('Eugene') && !listing2.full_address?.includes('Eugene')) {
      return -1
    }
    if (!listing1.full_address?.includes('Eugene') && listing2.full_address?.includes('Eugene')) {
      return 1
    }
    return 0
  })

  // ---- sort by keyword1 (1st priority)
  if (keyword1) {
    sortedListings = sortedListings.sort((listing1, listing2) => {
      if (listing1.keywords?.includes(keyword1) && !listing2.keywords?.includes(keyword1)) {
        return -1
      }
      if (!listing1.keywords?.includes(keyword1) && listing2.keywords?.includes(keyword2)) {
        return 1
      }
      return 0
    })
  }
  
  return sortedListings
}

// Unused, but may be helpful in the future
// function prioritizeListings(listings) {
//   listings.sortPriority = 0
//   listings.hasYouthServices = 0
//   if (listings.full_address) listings.sortPriority ++
//   if (listings.keywords.length > 2) listings.sortPriority ++
//   if (listings.keywords.includes('Youth Services')) listings.hasYouthServices ++
// }

// this function accepts json listings and returns them, formatted for leaflet use
export function formatListings(listings) {
  return listings.map(({latitude, longitude, ...listing}) => ({coords: [latitude, longitude], ...listing}))
}


// this function accepts listings, and filters according to a search string
// the Object.entries bit just means we're joining all the text fields before searching on them
// update 12.28.21 - added optional tag argument. it runs a text search, using the same logic as "search" 
export function filterListings(listings = {}, searchParams, search = "", hidden=[]) {
  const { age, tag, ...filters } = Object.fromEntries(searchParams)
  sortListings(listings, 'Youth Services', 'BIPOC Services')
  let filteredListings = listings.filter(listing => !hidden.includes(listing.guid))

  // tag is optional. it should perform a text search
  if (tag) filteredListings = filteredListings.filter(listing => Object.entries(listing).join(" ").toLowerCase().match(tag.toLowerCase()))
  // Search term
  filteredListings = filteredListings.filter(listing => Object.entries(listing).join(" ").toLowerCase().match(search.toLowerCase()))

  filteredListings = filteredListings.filter(listing => Object.entries(filters).every(([ key, value ]) => Array.isArray(listing[key]) ? listing[key].includes(value) : listing[key] === value))

  filteredListings = filteredListings.filter(({ min_age, max_age }) => !age || ((!max_age || age <= max_age) && (!min_age || age >= min_age)))
  
  return filteredListings
}
