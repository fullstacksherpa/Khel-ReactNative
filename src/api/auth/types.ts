export type RegisterResponse = {
  statusCode: number;
  data: {
    token: string; // This will be the plain token as returned from your registration handler.
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      // Add any additional fields as needed.
    };
  };
  message: string;
  success: boolean;
};

export type LoginResponse = {
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
};
