import {useState, useEffect} from 'react';

const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0,
};

export const usePosition = (watch = false, userSettings = {}) => {
  const settings = {
    ...defaultSettings,
    ...userSettings,
  };

  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  const onChange = ({coords, timestamp}) => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      speed: coords.speed,
      heading: coords.heading,
      timestamp,
    });
  };

  const onError = (error) => {
    setError(error.message);
  };

  useEffect(() => {
    if (!navigator || !navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    if (watch) {
      const watcher =
        navigator.geolocation.watchPosition(onChange, onError, settings);
      return () => navigator.geolocation.clearWatch(watcher);
    }

    navigator.geolocation.getCurrentPosition(onChange, onError, settings);
  }, [
    settings.enableHighAccuracy,
    settings.timeout,
    settings.maximumAge,
  ]);

  return {...position, error};
};

/* 
broswer returns on success: 
GeolocationPosition {coords: GeolocationCoordinates, timestamp: 1645304354841}
coords: GeolocationCoordinates
accuracy: 19.48
altitude: null
altitudeAccuracy: null
heading: null
latitude: 45.4453211
longitude: -122.5802649
speed: null
[[Prototype]]: GeolocationCoordinates
timestamp: 1645304354841
[[Prototype]]: GeolocationPosition

// const { latitude, longitude } = GeolocationPosition?.coords


*/