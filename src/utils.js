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

export const formatSocialMediaUrl = url => url.includes('https://www.') ? url.split('https://www.')[1] : url.includes('https://') ? url.split('https://')[1] : url.includes('http://') ? url.split('http://')[1] : url

export const titleCaseKey = key => key.charAt(0).toUpperCase() + key.slice(1)

// TODO: Move lines 37-44 to the server side
// Filter out outliers that will skew the map view. Running the function below filters out any listing east of Burns, Oregon. We only have 2, and it skews the entire map display, so this is the shortest solution.
const westOregon = { "min_long": -124.566244,	"min_lat": 41.991794,	"max_long": -119.0541,	"max_lat": 46.292035 }
const isInWestOregon = (lat, long) => ((lat >= westOregon.min_lat && lat <= westOregon.max_lat) && (long >= westOregon.min_long && long <= westOregon.max_long))
// this function accepts json listings and returns them, formatted for leaflet use
export function formatListings(listings) {
  listings = listings.filter(listing => isInWestOregon(listing.latitude, listing.longitude) || (!listing.latitude && !listing.longitude))
  return listings.map(({latitude, longitude, ...listing}) => ({coords: [latitude, longitude], ...listing}))
}

// this function accepts listings, and filters according to a search string
// the Object.entries bit just means we're joining all the text fields before searching on them
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