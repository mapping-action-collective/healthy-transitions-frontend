// Can be used along with usePosition to return results within a certain # of miles from the user.
// Not in use, as of 2/26/2022

// Get the distance in miles between two points. Sourced from: https://www.geodatasource.com/developers/javascript
export function getDistance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return dist;
	}
}

// Sort listings by how far they are from the user
function sortByDistance(listings) {
	return listings.sort((a, b) => a.userDistance - b.userDistance)
}

export function addDistanceToListings(listings, userCoords) {
  listings = listings.map(listing => {
    if (listing.coords[0] !== null && listing.coords?.[1] !== null) {
      const userDistance = getDistance(listing.coords[0], listing.coords[1], userCoords.latitude, userCoords.longitude)
      listing.userDistance = userDistance
    } else {
			// Sort of a wonky work-around, but this forces the sort function to put listings with no addresses at the end of the result list
      listing.userDistance = 1000
    }
    return listing
  })
	return sortByDistance(listings)
}