setItem('USERNAME', response.data.first_name);
setItem('USERIMAGE', response.data.profile_image);
setItem('USERID', response.data.userID);

{data.map(qa => (
<View key={qa.id} style={styles.questionContainer}>
<Text style={styles.question}>[Q]: {qa.question}</Text>
{qa.replies.map(reply => (
<View key={reply.id} style={styles.replyContainer}>
<Text style={styles.reply}>[A] Admin: {reply.reply}</Text>
</View>
))}
</View>
))}

import React, { useCallback } from 'react';
import { View } from 'react-native';
import GameActions from './GameActions';

/\*\*

- Parent screen/component that shows game details
- and integrates the Join-Game & Ask-Question bottom sheets.
  \*/
  const GameDetailScreen = ({ route }) => {
  const { gameID } = route.params;

/\*\*

- Callback when user submits a join request.
- Implement your API call here.
  \*/
  const handleJoin = useCallback(async (gameID, message) => {
  try {
  // Example API call:
  // await api.post(`/games/${gameID}/request`, { message });
  console.log(`Join request for game ${gameID}: ${message}`);
  // Show feedback (toast/alert)
  } catch (error) {
  console.error(error);
  // Show error
  }
  }, []);

/\*\*

- Callback when user sends a question.
- Implement your API call here.
  \*/
  const handleQuery = useCallback(async (gameID, question) => {
  try {
  // Example API call:
  // await api.post(`/games/${gameID}/questions`, { question });
  console.log(`Question for game ${gameID}: ${question}`);
  // Show feedback (toast/alert)
  } catch (error) {
  console.error(error);
  // Show error
  }
  }, []);

return (
<View style={{ flex: 1 }}>
{/_ Your game detail UI here _/}
{/_ ... _/}

      {/* Bottom sheets for join and query */}
      <GameActions
        gameID={gameID}
        onSubmitJoin={handleJoin}
        onSubmitQuery={handleQuery}
      />
    </View>

);
};

export default GameDetailScreen;
