import {icon} from 'leaflet';

import redMarkerUrl from './red-marker.png';
import blueMarkerUrl from './blue-marker.png';
import greenMarkerUrl from './green-marker.png';
import shadowUrl from './shadow-marker.png';

const iconAnchor = [22, 10];
const shadowAnchor = [18, 15];
const popupAnchor = [-6, -1];

export const greenLMarker = icon({
  iconUrl: greenMarkerUrl,
  iconAnchor,
  shadowUrl,
  shadowAnchor,
  popupAnchor
});

export const redLMarker = icon({
  iconUrl: redMarkerUrl,
  iconAnchor,
  shadowUrl,
  shadowAnchor,
  popupAnchor
});

export const blueLMarker = icon({
  iconUrl: blueMarkerUrl,
  iconAnchor,
  shadowUrl,
  shadowAnchor,
  popupAnchor
});
