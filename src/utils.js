// list of 100 largest cities/towns in Oregon, from Wikipedia
// TODO: finish this list to include ALL Oregon cities/towns
const cities = ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Bend', 'Beaverton', 'Medford', 'Springfield', 'Corvallis', 'Albany', 'Tigard', 'Lake Oswego', 'Keizer', 'Grants Pass', 'Oregon City', 'McMinnville', 'Redmond', 'Tualatin', 'West Linn', 'Wilsonville', 'Forest Grove', 'Woodburn', 'Newberg', 'Happy Valley', 'Roseburg', 'Klamath Falls', 'Ashland', 'Milwaukie', 'Sherwood', 'Hermiston', 'Central Point', 'Lebanon', 'Canby', 'Pendleton', 'Dallas', 'Troutdale', 'The Dalles', 'Coos Bay', 'St. Helens', 'La Grande', 'Cornelius', 'Sandy', 'Gladstone', 'Ontario', 'Monmouth', 'Prineville', 'Cottage Grove', 'Silverton', 'Fairview', 'North Bend', 'Newport', 'Mololla', 'Astoria', 'Baker City', 'Independence', 'Sweet Home', 'Lincoln City', 'Eagle Point', 'Florence', 'Sutherlin', 'Hood River', 'Stayton', 'Scappoose', 'Madras', 'Umatilla', 'Milton-Freewater', 'Seaside', 'Junction City', 'Brookings', 'Talent', 'Warrenton', 'Creswell', 'Winston', 'Philomath', 'Veneta', 'Tillamook', 'King City', 'Sheridan', 'Pheonix', 'Lafayette', 'Wood Village', 'Estacada', 'Reedsport', 'Aumsville', 'Coquille', 'Boardman', 'Harrisburg', 'Toledo', 'Myrtle Creek', 'North Plains', 'Hubbard', 'Mt. Angel', 'Jefferson', 'Bandon', 'Dundee', 'Oakridge', 'Nysssa', 'Shady Cove', 'Sisters', 'Jacksonville', 'Sublimity', 'Millersburg', 'Burns', 'Dayton', 'Gervais', 'La Pine', 'Myrtle Point']

export const getColor = index => [ "green", "teal", "blue", "violet", "purple", "pink", "red", "orange", "yellow", "olive", ][ index % 10 ]

export const getCityCount = listings => {
  let cityCount = {}
  cities.forEach((e) => cityCount[e] = 0)
    listings.forEach((listing) => {
    cities.forEach((city) => {
      if (listing.city?.toLowerCase() === city.toLowerCase()) {
        cityCount[city] ++
      }
    })
  })
  // Filter out cities with no entries
  return Object.fromEntries(Object.entries(cityCount).filter(([k, v]) => v !== 0))
}

export const getCategoryCount = (listings) => {
  let listingCategories = {}
  listings.forEach((listing) => {
    const [ parentCategory, subCategory ] = listing.category.split(`: `)
    if (!listingCategories[`${parentCategory}`]) listingCategories[`${parentCategory}`] = {}
    if (!listingCategories[`${parentCategory}`][`${subCategory}`]) listingCategories[`${parentCategory}`][`${subCategory}`] = 1
    else listingCategories[`${parentCategory}`][`${subCategory}`] ++
  })
  return listingCategories
}

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
