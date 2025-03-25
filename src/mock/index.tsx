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
