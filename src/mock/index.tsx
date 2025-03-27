const mockCarouselItems: CarouselItem[] = [
  {
    poster: {
      uri: 'https://media.istockphoto.com/id/865457032/vector/abstract-futuristic-cyberspace-with-binary-code-matrix-background-with-digits-well-organized.jpg?s=612x612&w=0&k=20&c=IQcdedY8fn_DMq6nwc5MaHUBe0H0d5DPyibHR8J2usk=',
    },
    icon: {
      uri: 'https://media.istockphoto.com/id/1406250470/vector/panda-head-mascot-esport-logo-design.jpg?s=612x612&w=0&k=20&c=NCaEJrCBbt8xBCX0CMF2Pm7fwowvsuNAQo_z1JS1-tQ=',
    },
    title: 'Beautiful Sunset',
    description: 'Enjoy the serene view of the sunset over the mountains.',
  },
  {
    poster: {
      uri: 'https://media.istockphoto.com/id/1307188897/video/abstract-background.jpg?s=640x640&k=20&c=HWuCUKzzrfR77rQBUudirMjWBHwm_4XzSuWR9elhBJ4=',
    },
    icon: {
      uri: 'https://media.istockphoto.com/id/1406250470/vector/panda-head-mascot-esport-logo-design.jpg?s=612x612&w=0&k=20&c=NCaEJrCBbt8xBCX0CMF2Pm7fwowvsuNAQo_z1JS1-tQ=',
    },
    title: 'Majestic Waterfall',
    description: 'Feel the power and beauty of nature’s waterfalls.',
  },
  {
    poster: {
      uri: 'https://img.freepik.com/free-vector/stream-binary-code-design_53876-97406.jpg?semt=ais_hybrid',
    },
    icon: {
      uri: 'https://media.istockphoto.com/id/1406250470/vector/panda-head-mascot-esport-logo-design.jpg?s=612x612&w=0&k=20&c=NCaEJrCBbt8xBCX0CMF2Pm7fwowvsuNAQo_z1JS1-tQ=',
    },
    title: 'Starry Night Sky',
    description: 'Gaze at the endless stars in the peaceful night sky.',
  },
  {
    poster: {
      uri: 'https://wallpaperswide.com/download/code_2-wallpaper-1152x864.jpg',
    },
    icon: {
      uri: 'https://media.istockphoto.com/id/1406250470/vector/panda-head-mascot-esport-logo-design.jpg?s=612x612&w=0&k=20&c=NCaEJrCBbt8xBCX0CMF2Pm7fwowvsuNAQo_z1JS1-tQ=',
    },
    title: 'Misty Forest',
    description: 'Walk through the mystical fog-covered forest.',
  },
];

export default mockCarouselItems;

export interface CarouselItem {
  poster: {
    uri: string;
  };
  icon: {
    uri: string;
  };
  title: string;
  description: string;
}

export const futsalData = [
  { id: 1, long: 85.3621, lat: 27.7214 },
  { id: 2, long: 85.3598, lat: 27.7189 },
  { id: 3, long: 85.3645, lat: 27.7231 },
  { id: 4, long: 85.3576, lat: 27.7203 },
  { id: 5, long: 85.3612, lat: 27.7195 },
  { id: 6, long: 85.3634, lat: 27.7222 },
  { id: 7, long: 85.3589, lat: 27.7178 },
  { id: 8, long: 85.3656, lat: 27.7209 },
  { id: 9, long: 85.3603, lat: 27.7236 },
  { id: 10, long: 85.3567, lat: 27.7185 },
  { id: 11, long: 85.3629, lat: 27.7201 },
  { id: 12, long: 85.3591, lat: 27.7227 },
  { id: 13, long: 85.3649, lat: 27.7193 },
  { id: 14, long: 85.3578, lat: 27.7218 },
  { id: 15, long: 85.3615, lat: 27.7241 },
  { id: 16, long: 85.3587, lat: 27.7206 },
  { id: 17, long: 85.3638, lat: 27.7183 },
  { id: 18, long: 85.3601, lat: 27.7229 },
  { id: 19, long: 85.3653, lat: 27.7197 },
  { id: 20, long: 85.3572, lat: 27.7211 },
  { id: 21, long: 85.3623, lat: 27.7188 },
  { id: 22, long: 85.3595, lat: 27.7234 },
  { id: 23, long: 85.3641, lat: 27.7205 },
  { id: 24, long: 85.3583, lat: 27.7223 },
  { id: 25, long: 85.3618, lat: 27.7181 },
  { id: 26, long: 85.3607, lat: 27.7238 },
  { id: 27, long: 85.3659, lat: 27.7199 },
  { id: 28, long: 85.3581, lat: 27.7216 },
  { id: 29, long: 85.3632, lat: 27.7191 },
  { id: 30, long: 85.3593, lat: 27.7225 },
];
