export interface IGame {
  _id: string; // Unique identifier for the game
  sport: string; // Name of the sport (e.g., Basketball, Football)
  date: string; // Date of the game
  time: string; // Time slot for the game
  area: string; // Location where the game will be held
  players: {
    _id: string; // Player's unique identifier
    imageUrl: string; // URL to the player's profile image
    name: string; // Player's full name
  }[]; // Array of players participating in the game
  totalPlayers: number; // Maximum number of players allowed
  queries: {
    question: string | null; // Question asked about the game
    answer: string | null; // Answer to the question
  }[]; // Array of questions and answers related to the game
  requests: {
    userId: string; // User's unique identifier
    comment: string | null; // Comment by the user
  }[]; // Array of join requests or comments
  isBooked: boolean; // Whether the game is fully booked
  adminName: string; // Admin's full name
  adminUrl: string; // Admin's profile image URL
  matchFull: boolean; // Whether the match is full
  isUserAdmin: boolean;
  courtNumber?: string | null; // Optional court number if specified
}

export type IRequest = {
  userId: string; // The user's ID
  email: string; // The user's email
  firstName: string; // The user's first name
  lastName: string; // The user's last name
  image: string; // The user's profile image URL
  skill: string; // The user's skill description
  noOfGames: number; // Number of games the user has played
  playpals: string[]; // Array of user IDs of playpals
  sports: string[]; // Array of sports the user plays
  comment: string; // The comment associated with the request
};

export type IRequestArray = IRequest[];

export type IPlayer = {
  _id: string; // Player's unique ID
  email: string; // Player's email address
  firstName: string; // Player's first name
  lastName: string; // Player's last name
  image: string; // URL for the player's profile image
  noOfGames: number; // Number of games played by the player
  sports: string[]; // List of sports the player participates in
};

export type IPlayerArray = {
  players: IPlayer[]; // Array of players
};
