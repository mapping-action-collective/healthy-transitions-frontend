import { useState, useEffect } from 'react'

// Can be used in future to get use location and then show results most relevant to them, and/or order the results by closest to them.
const usePosition = () => {
  const [coords, setCoords] = useState({})
  const [error, setError] = useState(null)
  // The navigator.geolocation browser method takes three arguments: an onSuccess function, an onError function, and settings
  const onSuccess = ({coords: {latitude, longitude}}) => setCoords({latitude, longitude})
  // If user denies permission we'll get an error with code "1"
  const onError = error => setError(error.message)

  // We timeout after 5 seconds because otherwise the browser will stop here and get stuck if the user doesn't respond. We don't use high accuracy because it takes longer to retrieve. The maximum age tells the browser to send a cached value, or a fresh one. A value of 0 (which is the default)  means we want a fresh value only.
  const settings = {enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }

  // Todo: Do I need a cleanup function here? 
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess, onError, settings)
  }, [])

  return { coords, error }
}

export default usePosition;