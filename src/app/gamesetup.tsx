import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useRef, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

// eslint-disable-next-line max-lines-per-function
const GameSetUpScreen = () => {
  const userRequested = false;
  const isUserAdmin = true;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const router = useRouter();

  const [comment, setComment] = useState('');

  const [matchFull] = useState(false);

  // callbacks for BottomSheet
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // const sendJoinRequest = async (gameId: string) => {
  //   try {
  //     // Make API request to send join request
  //     const response = await axios.post(
  //       `http://localhost:8000/game/${gameId}/request`,
  //       {
  //         userId,
  //         comment,
  //       }
  //     );

  //     if (response.status === 200) {
  //       // Show success alert
  //       Alert.alert(
  //         'Request Sent',
  //         'Please wait for the host to accept!',
  //         [
  //           {
  //             text: 'OK',
  //             onPress: () => {
  //               bottomSheetModalRef.current?.dismiss();
  //             },
  //           },
  //         ],
  //         { cancelable: false }
  //       );
  //       console.log('Request sent successfully:', response.data);
  //     }
  //   } catch (error: any) {
  //     // Extract server error message if available
  //     const errorMessage =
  //       error.response?.data?.message ||
  //       'Failed to send request. Please try again.';

  //     // Show error alert
  //     Alert.alert('Error', errorMessage, [
  //       {
  //         text: 'OK',
  //         onPress: () => {
  //           console.error('Failed to send request:', errorMessage);
  //         },
  //       },
  //     ]);
  //   }
  // };

  const [requests] = useState([]);

  // useEffect(() => {
  //   fetchRequests();
  // }, []);

  // const gameId = (parsedItem as IGame)._id;

  // const fetchRequests = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/game/${gameId}/requests`
  //     );
  //     setRequests(response.data);
  //   } catch (error) {
  //     console.error('Failed to fetch requests:', error);
  //   }
  // };

  // const [players, setPlayers] = useState([]);

  // useEffect(() => {
  //   fetchPlayers();
  // }, []);

  // const fetchPlayers = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/game/${gameId}/players`
  //     );
  //     setPlayers(response.data);
  //   } catch (error) {
  //     console.error('Failed to fetch players:', error);
  //   }
  // };

  // console.log('players', players);

  // useEffect(() => {
  //   const fetchVenues = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8000/venue/venues');
  //       setVenues(response.data);
  //     } catch (error) {
  //       console.error('Failed to fetch venues:', error);
  //     }
  //   };

  //   fetchVenues();
  // }, []);

  // const toggleMatchFullStatus = async (gameId: string) => {
  //   try {
  //     // Call the backend endpoint to toggle the matchFull status
  //     const response = await axios.post(
  //       'http://localhost:8000/game/toggle-match-full',
  //       { gameId }
  //     );

  //     if (response.status === 200) {
  //       // Display a success message
  //       Alert.alert('Success', `Match full status updated`);

  //       setMatchFull(!matchFull);
  //       // Optionally, refresh game data or update UI accordingly
  //     }
  //   } catch (error) {
  //     console.error('Failed to update match full status:', error);
  //     Alert.alert('Error', 'Failed to update match full status');
  //   }
  // };

  // const adminUrl = (parsedItem as IGame).adminUrl;
  // console.log(adminUrl);
  const adminUrl =
    'http://res.cloudinary.com/sherpacloudinary/image/upload/v1731275394/fiveemdprcdxp8r3j6mp.png';

  return (
    <>
      <StatusBar style={'dark'} backgroundColor="#294461" translucent={true} />
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView>
        <ScrollView>
          <View
            style={{
              padding: 10,
              backgroundColor: '#294461',
              paddingBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </Pressable>

              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              >
                <Entypo name="share" size={24} color="white" />
                <Entypo name="dots-three-vertical" size={24} color="white" />
              </View>
            </View>

            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <Text
                style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}
              >
                {`futsal`}
              </Text>

              <View
                style={{
                  padding: 7,

                  backgroundColor: 'white',
                  borderRadius: 7,
                  alignSelf: 'flex-start',
                }}
              >
                <Text>Mixed Doubles</Text>
              </View>

              <View
                style={{
                  marginLeft: 'auto',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Text
                  style={{ fontSize: 15, fontWeight: '500', color: 'white' }}
                >
                  Match Full
                </Text>
                <FontAwesome
                  onPress={() => console.log(`match toggle`)}
                  name={matchFull ? 'toggle-on' : 'toggle-off'}
                  size={24}
                  color="white"
                />
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 15, color: 'white', fontWeight: '600' }}>
                {`6:00am`} • {`7:00am`}
              </Text>
            </View>

            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: '#28c752',
                paddingHorizontal: 10,
                paddingVertical: 6,
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                width: '90%',
                justifyContent: 'center',
                borderRadius: 8,
              }}
            >
              <Entypo name="location" size={24} color="white" />

              <View>
                <Text style={{ color: 'white' }}>{`Tinchuli`}</Text>
              </View>
            </Pressable>
          </View>

          <View
            style={{
              marginVertical: 20,
              marginHorizontal: 15,
              backgroundColor: 'white',
              padding: 10,
              flexDirection: 'row',

              gap: 10,
            }}
          >
            <MaterialCommunityIcons
              name="directions-fork"
              size={24}
              color="#adcf17"
            />

            <View>
              <Text style={{ fontSize: 15 }}>Add Expense</Text>

              <View
                style={{
                  marginTop: 6,
                  flexDirection: 'row',

                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ width: '80%', color: 'gray' }}>
                  Start adding your expenses to split cost among players
                </Text>

                <Entypo name="chevron-small-right" size={24} color="gray" />
              </View>
            </View>
          </View>

          <View style={{ marginHorizontal: 15 }}>
            <Image
              style={{
                width: '100%',
                height: 220,
                borderRadius: 10,
                resizeMode: 'cover',
              }}
              source={{
                uri: 'https://playo.gumlet.io/OFFERS/PlayplusSpecialBadmintonOfferlzw64ucover1614258751575.png',
              }}
            />
          </View>

          <View
            style={{
              marginVertical: 20,
              marginHorizontal: 15,
              backgroundColor: 'white',
              padding: 12,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                Players (2)
              </Text>

              <Ionicons name="earth" size={24} color="gray" />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '500' }}>
                ❤️ You are not covered 🙂
              </Text>

              <Text style={{ fontWeight: '500' }}>Learn More</Text>
            </View>

            <View style={{ marginVertical: 12, flexDirection: 'row', gap: 10 }}>
              <View>
                <Image
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                  source={{
                    uri: adminUrl,
                  }}
                />
              </View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Text>{`Onghcne`}</Text>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      backgroundColor: '#E0E0E0',
                      borderRadius: 8,
                    }}
                  >
                    <Text>HOST</Text>
                  </View>
                </View>

                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginTop: 10,
                    borderRadius: 20,
                    borderColor: 'orange',
                    borderWidth: 1,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text>INTERMEDIATE</Text>
                </View>
              </View>
            </View>

            {isUserAdmin === true ? (
              <View>
                <View
                  style={{
                    height: 1,
                    borderWidth: 0.5,
                    borderColor: '#E0E0E0',
                    marginVertical: 12,
                  }}
                />
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      style={{ width: 30, height: 30, resizeMode: 'contain' }}
                      source={{
                        uri: 'https://cdn-icons-png.flaticon.com/128/343/343303.png',
                      }}
                    />
                  </View>

                  <Text style={{ fontSize: 15, fontWeight: '500', flex: 1 }}>
                    Add Co-Host
                  </Text>

                  <MaterialCommunityIcons
                    style={{ textAlign: 'center' }}
                    name="chevron-right"
                    size={24}
                    color="black"
                  />
                </Pressable>

                <View
                  style={{
                    height: 1,
                    borderWidth: 0.5,
                    borderColor: '#E0E0E0',
                    marginVertical: 12,
                  }}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Pressable>
                    <Pressable
                      style={{
                        width: 60,
                        height: 60,
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        style={{ width: 30, height: 30, resizeMode: 'contain' }}
                        source={{
                          uri: 'https://cdn-icons-png.flaticon.com/128/1474/1474545.png',
                        }}
                      />
                    </Pressable>
                    <Text
                      style={{
                        marginTop: 8,
                        fontWeight: '500',
                        textAlign: 'center',
                      }}
                    >
                      Add
                    </Text>
                  </Pressable>

                  <Pressable>
                    <Pressable
                      onPress={() => {}}
                      style={{
                        width: 60,
                        height: 60,
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                          resizeMode: 'contain',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        source={{
                          uri: 'https://cdn-icons-png.flaticon.com/128/7928/7928637.png',
                        }}
                      />
                    </Pressable>
                    <Text
                      style={{
                        marginTop: 8,
                        fontWeight: '500',
                        textAlign: 'center',
                      }}
                    >
                      Manage ({requests?.length})
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={
                      () => {}
                      // navigation.navigate('Players', {
                      //   players: players,
                      // })
                    }
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        padding: 10,
                        borderColor: '#E0E0E0',
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 12,
                      }}
                    >
                      <MaterialCommunityIcons
                        style={{ textAlign: 'center' }}
                        name="chevron-right"
                        size={24}
                        color="black"
                      />
                    </View>

                    <Text
                      style={{
                        marginBottom: 12,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      All Players
                    </Text>
                  </Pressable>
                </View>

                <View
                  style={{
                    height: 1,
                    borderWidth: 0.5,
                    borderColor: '#E0E0E0',
                    marginVertical: 12,
                  }}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 15,
                  }}
                >
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      style={{ width: 30, height: 30, resizeMode: 'contain' }}
                      source={{
                        uri: 'https://cdn-icons-png.flaticon.com/128/1511/1511847.png',
                      }}
                    />
                  </View>

                  <View>
                    <Text>Not on Playo? Invite</Text>
                    <Text style={{ marginTop: 6, color: 'gray', width: '80%' }}>
                      Earn 100 Karma points by referring your friend
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => {}}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTopColor: '#E0E0E0',
                  borderTopWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  borderBottomWidth: 1,
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    padding: 10,
                    borderColor: '#E0E0E0',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 12,
                  }}
                >
                  <MaterialCommunityIcons
                    style={{ textAlign: 'center' }}
                    name="chevron-right"
                    size={24}
                    color="black"
                  />
                </View>

                <Text style={{ marginBottom: 12, fontWeight: '600' }}>
                  All Players
                </Text>
              </Pressable>
            )}
          </View>

          <View
            style={{
              marginHorizontal: 15,
              backgroundColor: 'white',
              padding: 12,
              borderRadius: 6,
            }}
          >
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>
                Queries (0)
              </Text>

              <View style={{ marginVertical: 12 }}>
                <Text
                  style={{ color: 'gray', fontSize: 15, textAlign: 'center' }}
                >
                  There are no queries yet! Queries sent by players will be
                  shown here
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* route?.params?.item?.isUserAdmin == true */}
      </SafeAreaView>

      {isUserAdmin === true ? (
        <Pressable
          style={{
            backgroundColor: '#07bc0c',
            marginTop: 'auto',
            marginBottom: 30,
            padding: 15,
            marginHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 15,
              fontWeight: '500',
            }}
          >
            GAME CHAT
          </Text>
        </Pressable>
      ) : userRequested ? (
        <Pressable
          style={{
            backgroundColor: 'red',
            marginTop: 'auto',
            marginBottom: 30,
            padding: 15,
            marginHorizontal: 10,
            borderRadius: 4,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 15,
              fontWeight: '500',
            }}
          >
            CANCEL REQUEST
          </Text>
        </Pressable>
      ) : (
        <View
          style={{
            marginTop: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            backgroundColor: '#E8E8E8',
          }}
        >
          <Pressable
            style={{
              backgroundColor: 'white',
              marginTop: 'auto',
              marginBottom: 30,
              padding: 15,
              marginHorizontal: 10,
              borderRadius: 4,
              flex: 1,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 15,
                fontWeight: '500',
              }}
            >
              SEND QUERY
            </Text>
          </Pressable>
          <Pressable
            onPress={handlePresentModalPress}
            style={{
              backgroundColor: '#07bc0c',
              marginTop: 'auto',
              marginBottom: 30,
              padding: 15,
              marginHorizontal: 10,
              borderRadius: 4,
              flex: 1,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 15,
                fontWeight: '500',
              }}
            >
              JOIN GAME
            </Text>
            <BottomSheetModal ref={bottomSheetModalRef} snapPoints={['50%']}>
              <BottomSheetView
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingHorizontal: 16,
                }}
              >
                <View>
                  <Text
                    style={{ fontSize: 23, fontWeight: '500', color: 'black' }}
                  >
                    Join Game
                  </Text>

                  <Text
                    style={{
                      marginTop: 25,
                      color: 'gray',
                      fontSize: 19,
                      letterSpacing: 1,
                    }}
                  >
                    {`onghcen`} has been putting efforts to organize this game.
                    Please send the request if you are quite sure to attend.
                  </Text>

                  <View
                    style={{
                      borderColor: '#E0E0E0',
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                      height: 200,
                      marginTop: 20,
                    }}
                  >
                    <TextInput
                      value={comment}
                      // multiline
                      onChangeText={(text) => setComment(text)}
                      style={{
                        fontSize: comment ? 17 : 17,
                      }}
                      placeholder="Send a message to the host along with your request!"
                      //   placeholderTextColor={"black"}
                    />
                    <Pressable
                      onPress={() => {}}
                      style={{
                        marginTop: 'auto',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 15,
                        backgroundColor: 'green',
                        borderRadius: 5,
                        justifyContent: 'center',
                        padding: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          fontSize: 15,
                          fontWeight: '500',
                        }}
                      >
                        Send Request
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </Pressable>
        </View>
      )}

      {/* <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent
          style={{ width: '100%', height: 400, backgroundColor: 'white' }}
        >
          <View>
            <Text style={{ fontSize: 15, fontWeight: '500', color: 'gray' }}>
              Join Game
            </Text>

            <Text style={{ marginTop: 25, color: 'gray' }}>
              {parsedItem.adminName} has been putting efforts to organize this
              game. Please send the request if you are quite sure to attend
            </Text>

            <View
              style={{
                borderColor: '#E0E0E0',
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                height: 200,
                marginTop: 20,
              }}
            >
              <TextInput
                value={comment}
                // multiline
                onChangeText={(text) => setComment(text)}
                style={{
                  fontFamily: 'Helvetica',
                  fontSize: comment ? 17 : 17,
                }}
                placeholder="Send a message to the host along with your request!"
                //   placeholderTextColor={"black"}
              />
              <Pressable
                onPress={() => sendJoinRequest(parsedItem._id)}
                style={{
                  marginTop: 'auto',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  backgroundColor: 'green',
                  borderRadius: 5,
                  justifyContent: 'center',
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 15,
                    fontWeight: '500',
                  }}
                >
                  Send Request
                </Text>
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </BottomModal> */}
    </>
  );
};

export default GameSetUpScreen;
