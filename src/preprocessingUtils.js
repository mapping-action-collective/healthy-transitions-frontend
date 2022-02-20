// Pre-process listings for the map

// export const getuserCoords = () => {
//   navigator.geolocation.getCurrentPosition({enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0}), (results, error) => {

//     })
// }

function getuserCoords(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      ({ code, message }) =>
        reject(
          Object.assign(new Error(message), { name: 'PositionError', code })
        ),
      options
    );
  });
}