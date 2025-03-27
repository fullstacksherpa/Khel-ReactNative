import { Env } from '@env';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';

const publicAccessToken = Env.MAPBOX_PUBLIC_TOKEN;
Mapbox.setAccessToken(publicAccessToken);

export default function Map() {
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/streets-v12">
      <Camera followZoomLevel={14} followUserLocation />
      <LocationPuck
        puckBearingEnabled
        puckBearing="heading"
        pulsing={{ isEnabled: true }}
      />
    </MapView>
  );
}
