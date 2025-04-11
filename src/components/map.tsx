/* eslint-disable import/no-unresolved */
import { Env } from '@env';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';

import VenueMarkers from '@/components/map/venue-markers';
import { useGameVenue } from '@/lib/games-venues-store';

import GameMarkers from './map/game-markers';

const publicAccessToken = Env.MAPBOX_PUBLIC_TOKEN;
Mapbox.setAccessToken(publicAccessToken);

export default function Map() {
  const { currentSelection } = useGameVenue();

  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/streets-v12">
      <Camera followZoomLevel={14} followUserLocation />
      <LocationPuck
        puckBearingEnabled
        puckBearing="heading"
        pulsing={{ isEnabled: true }}
      />
      {currentSelection === 'venues' ? <VenueMarkers /> : <GameMarkers />}
    </MapView>
  );
}
