// this function accepts json mapData as parsed by papa parse
// it returns the same data, formatted for leaflet use
export function formatMapData(mapData) {
  return mapData
    .filter(({Y, X}) => X && Y)
    .map(({ X, Y, Category, Name, Description, Social_Media }, index) => ({
      coords: [Y, X],
      popup: {
        listing: Name,
        street: '',
        street2: '',
        hours: '',
        id: index,
      }
    }))
}

// this function accepts leaflet-formatted mapData, and filters according to a search string
// the Object.entries bit just means we're joining all the text fields before searching on them
export function filterMapData(mapData = {}, search = "") {
  return mapData.filter(({popup}) => Object.entries(popup).join(" ").toLowerCase().match(search.toLowerCase()))
}
