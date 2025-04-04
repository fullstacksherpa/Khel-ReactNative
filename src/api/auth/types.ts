export type RegisterResponse = {
  data: {
    user: {
      id: number; // Assuming ID is numeric
      firstName: string;
      lastName: string;
      email: string;
      profilePictureUrl: string | null; // Profile URL can be a string or null
      skillLevel: string | null; // Skill level can be a string or null
      noOfGames: number; // Assuming no_of_games is a number
      isActive: boolean; // Assuming is_active is a boolean
      createdAt: string; // Assuming the date is in ISO string format
      updatedAt: string; // Assuming the date is in ISO string format
    };
    token: string; //TODO: remove later
  };
};

export type LoginResponse = {
  data: {
    access_token: string;
    refresh_token: string;
    first_name: string;
    profile_image: string;
  };
};
