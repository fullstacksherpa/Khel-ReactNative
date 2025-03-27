import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from 'react';

const VenueContext = createContext({});

// eslint-disable-next-line max-lines-per-function
export default function VenueProvider({ children }: PropsWithChildren) {
  const [nearbyVenues, setNearbyVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState();

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

export const useVenue = () => useContext(VenueContext);
