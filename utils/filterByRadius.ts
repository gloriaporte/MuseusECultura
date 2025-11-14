import { getDistanceFromLatLonInKm } from './distance';

export function filterByRadius(
  userLat: number,
  userLon: number,
  events: any[],
  radiusKm: number
) {
  return events.filter(e => {
    const lat = parseFloat(e.location?.latitude);
    const lon = parseFloat(e.location?.longitude);

    if (!lat || !lon) return false;

    const distance = getDistanceFromLatLonInKm(userLat, userLon, lat, lon);
    return distance <= radiusKm;
  });
}