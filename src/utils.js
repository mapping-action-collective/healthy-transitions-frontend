export function formatMapData(csvData) {
  return csvData.map(({ X, Y, Category, Name, Description, Social_Media }, index) => ({
    coords: [Y, X],
    popup: {
      listing: Name,
      street: '',
      street2: '',
      hours: '',
      id: index,
    }
  })).filter(({coords: [Y, X]}) => Y && X)
}