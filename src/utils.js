// list of 100 largest cities/towns in Oregon, from Wikipedia
// TODO: finish this list to include ALL Oregon cities/towns
const cities = ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Bend', 'Beaverton', 'Medford', 'Springfield', 'Corvallis', 'Albany', 'Tigard', 'Lake Oswego', 'Keizer', 'Grants Pass', 'Oregon City', 'McMinnville', 'Redmond', 'Tualatin', 'West Linn', 'Wilsonville', 'Forest Grove', 'Woodburn', 'Newberg', 'Happy Valley', 'Roseburg', 'Klamath Falls', 'Ashland', 'Milwaukie', 'Sherwood', 'Hermiston', 'Central Point', 'Lebanon', 'Canby', 'Pendleton', 'Dallas', 'Troutdale', 'The Dalles', 'Coos Bay', 'St. Helens', 'La Grande', 'Cornelius', 'Sandy', 'Gladstone', 'Ontario', 'Monmouth', 'Prineville', 'Cottage Grove', 'Silverton', 'Fairview', 'North Bend', 'Newport', 'Mololla', 'Astoria', 'Baker City', 'Independence', 'Sweet Home', 'Lincoln City', 'Eagle Point', 'Florence', 'Sutherlin', 'Hood River', 'Stayton', 'Scappoose', 'Madras', 'Umatilla', 'Milton-Freewater', 'Seaside', 'Junction City', 'Brookings', 'Talent', 'Warrenton', 'Creswell', 'Winston', 'Philomath', 'Veneta', 'Tillamook', 'King City', 'Sheridan', 'Pheonix', 'Lafayette', 'Wood Village', 'Estacada', 'Reedsport', 'Aumsville', 'Coquille', 'Boardman', 'Harrisburg', 'Toledo', 'Myrtle Creek', 'North Plains', 'Hubbard', 'Mt. Angel', 'Jefferson', 'Bandon', 'Dundee', 'Oakridge', 'Nysssa', 'Shady Cove', 'Sisters', 'Jacksonville', 'Sublimity', 'Millersburg', 'Burns', 'Dayton', 'Gervais', 'La Pine', 'Myrtle Point']

export const getColor = index => [ "green", "teal", "blue", "violet", "purple", "pink", "red", "orange", "yellow", "olive", ][ index % 10 ]

// This is here, instead of the server, since it's supposed to recalculate with each search.
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

// Can be fetched from API, or recalculated on search
export const getKeywordCount = listings => {
  let keywordCount = {}
  listings.forEach((listing) => {
    if (listing.keywords) {
      listing.keywords.forEach((keyword) => {
        if (!keywordCount[`${keyword}`]) keywordCount[`${keyword}`] = 1
        else keywordCount[`${keyword}`] ++
      })
    }
  })
  return keywordCount
}

export const getCostCount = listings => {
  let costCount = {}
  listings.forEach((listing) => {
    if (listing.cost_keywords) {
      listing.cost_keywords.forEach((keyword) => {
        if (!costCount[`${keyword}`]) costCount[`${keyword}`] = 1
        else costCount[`${keyword}`] ++
      })
    }
  })
  return costCount
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

export const formatSocialMediaUrl = url => url.includes('https://www.') ? url.split('https://www.')[1] : url.includes('https://') ? url.split('https://')[1] : url.includes('http://') ? url.split('http://')[1] : url

export const titleCaseKey = key => key.charAt(0).toUpperCase() + key.slice(1)

const cost = ["Low Cost", "Free", "OHP", "Accepts Uninsured", "Sliding Scale", "Financial Aid Available"]

const addCostToListing = listing => {
  // Staging already does this server-side. If it's already in place, skip.
  if (listing.cost_keywords && listing.cost_keywords?.length > 0) return listing

  else if (listing.keywords) {
    let keywords = listing.keywords
    // Grab cost-related keywords out of the general keywords array
    const costKeywords = keywords.filter(keyword => cost.includes(keyword))
    if (costKeywords && costKeywords?.length > 0) listing.cost = [...costKeywords]
    // Remove cost keywords from main keywords array. This will happen server-side; this is a temporary patch.
    keywords = keywords.filter(keyword => !cost.includes(keyword)) 
    listing.keywords = keywords
    return listing;
  }
  return listing;
}

// this function accepts json listings and returns them, formatted for leaflet use
export function formatListings(listings) {
  // patch. TODO: fix on the BE and remove
  listings = listings.map(listing => {
    if (listing.cost_keywords && listing.cost_keywords?.length > 0) {
      listing.cost = listing.cost_keywords
    }
    return listing
  })
  console.log(listings)
  return listings.map(({latitude, longitude, ...listing}) => ({coords: [latitude, longitude], ...listing}))
}

// This is more verbose than before, but also more performant, and ideally easier to read for future OS devs.
export function filterListings(listings = {}, searchParams, search = "", hidden=[]) {
  // if URL includes the "saved" param, display saved listings ONLY
  if (searchParams.get('saved')) {
    let savedGuids = searchParams.getAll('saved')
    return listings.filter(listing => savedGuids.includes(listing.guid.toString()))
  }

  const { age, tag, ...filters } = Object.fromEntries(searchParams) 
  const searchFunction = (listing) => {
    const isHidden = (hidden.includes(listing.guid)) 
    if (isHidden) return false

    if (tag) {
      // the Object.entries bit just means we're joining all the text fields before searching on them
      let hasTag = tag && Object.entries(listing).join(" ").toLowerCase().match(tag.toLowerCase())
      if (!hasTag) return false
    }

    if (search) {
      let hasSearchTerm = Object.entries(listing).join(" ").toLowerCase().match(search.toLowerCase())
      if (!hasSearchTerm) return false
    }

    if (filters) {
      let hasFilters = Object.entries(filters).every(([ key, value ]) => Array.isArray(listing[key]) ? listing[key].includes(value) : listing[key] === value)
      if (!hasFilters) return false
    }

    if (age) {
      let isCorrectAge = !age || ((!listing.max_age || age <= listing.max_age) && (!listing.min_age || age >= listing.min_age))
      if (!isCorrectAge) return false
    }
    return true
  }
  
  return listings.filter(searchFunction)
}