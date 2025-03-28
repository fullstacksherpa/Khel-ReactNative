import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { futsalData } from '@/mock';
interface VenueContextType {
  nearbyVenues: any[];
  setNearbyVenues: React.Dispatch<React.SetStateAction<any[]>>;
  selectedVenue?: any;
  setSelectedVenue: React.Dispatch<React.SetStateAction<any | undefined>>;
}

const VenueContext = createContext<VenueContextType | undefined>(undefined);

// eslint-disable-next-line max-lines-per-function
export default function VenueProvider({ children }: PropsWithChildren) {
  const [nearbyVenues, setNearbyVenues] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any | undefined>(
    undefined
  );

  useEffect(() => {
    setSelectedVenue(futsalData);
  }, []);

  // useEffect(() => {
  //   const fetchVenues = async () => {
  //     const location = await Location.getCurrentPositionAsync();
  //     const { data } = await axios.get('nearby_scooters', {
  //       lat: location.coords.latitude,
  //       long: location.coords.longitude,
  //       max_dist_meters: 2000,
  //     });
  //     if (error) {
  //       Alert.alert('Failed to fetch scooters');
  //     } else {
  //       setNearbyVenues(data);
  //     }
  //   };

  //   fetchVenues();
  // }, []);

  return (
    <VenueContext.Provider
      value={{
        nearbyVenues,
        setNearbyVenues,
        selectedVenue,
        setSelectedVenue,
      }}
    >
      {children}
    </VenueContext.Provider>
  );
}

export const useVenue = () => {
  const context = useContext(VenueContext);
  if (!context) {
    throw new Error('useVenue must be used within a VenueProvider');
  }
  return context;
};
