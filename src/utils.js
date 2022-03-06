
export const getColor = index => [ "green", "teal", "blue", "violet", "purple", "pink", "red", "orange", "yellow", "olive", ][ index % 10 ]

// for loops are faster, and speed matters here as this calculation runs on every onChange handler in the UI 
// TODO: memoize this. It's running way too often.
export const getCityCount = listings => {
  let cityCount = {}
  for (let i = 0; i < listings.length; i++) {
    if (listings[i].city) {
      let city = listings[i].city
      if (cityCount[city]) cityCount[city] ++
      else cityCount[city] = 1
    }
  }
  console.log('city count')
  return cityCount
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
  console.log('keyword count')
  return keywordCount
}

export const costKeywords = ['OHP', 'Private Insurance', 'Financial Aid Available', 'Free', 'Accepts Uninsured', 'Sliding Scale', 'Low Cost', 'Medicare / Medicaid']

// TODO: refactor to use for loop (faster)
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
  console.log('cost count')
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

    const listingEntries = Object.entries(listing).join(" ").toLowerCase()

    if (tag) {
      // the Object.entries bit just means we're joining all the text fields before searching on them
      let hasTag = listingEntries.includes(tag.toLowerCase())
      if (!hasTag) return false
    }

    if (search) {
      let hasSearchTerm = listingEntries.includes(search.toLowerCase())
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