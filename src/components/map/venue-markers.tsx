/* eslint-disable import/no-unresolved */
import pin from '@assets/pin.png';
import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { type OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';

import { futsalData } from '@/mock';

export default function VenueMarkers() {
  const points = futsalData.map((s) =>
    point([s.long, s.lat], { futsalData: s })
  );

  const onPointPress = async (event: OnPressEvent) => {
    if (event.features[0].properties?.futsalData) {
      // setSelectedVenues(event.features[0].properties.futsalData);
      console.log(event);
    }
  };

  return (
    <ShapeSource
      id="venues"
      cluster
      shape={featureCollection(points)}
      onPress={onPointPress}
    >
      <SymbolLayer
        id="clusters-count"
        style={{
          textField: ['get', 'point_count'],
          textSize: 18,
          textColor: '#ffffff',
          textPitchAlignment: 'map',
        }}
      />

      <CircleLayer
        id="clusters"
        belowLayerID="clusters-count"
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'map',
          circleColor: '#42E100',
          circleRadius: 20,
          circleOpacity: 1,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />

      <SymbolLayer
        id="scooter-icons"
        filter={['!', ['has', 'point_count']]}
        style={{
          iconImage: 'pin',
          iconSize: 0.5,
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }}
      />
      <Images images={{ pin }} />
    </ShapeSource>
  );
}
