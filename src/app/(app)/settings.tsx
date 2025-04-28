import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { client } from '@/api';
import { useAuth } from '@/lib/auth/index';

// Reusable list item component
interface ListItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  onPress?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  icon,
  title,
  subtitle,
  badge,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-2 flex-row items-center rounded-lg bg-white p-4"
    >
      <View className="mr-4 size-10 items-center justify-center rounded-full bg-gray-100">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-500">{subtitle}</Text>}
      </View>
      {badge && (
        <View className="mr-2 rounded-md bg-yellow-200 px-2 py-1">
          <Text className="text-xs font-semibold text-yellow-800">{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
};

// Main profile screen
// eslint-disable-next-line max-lines-per-function
const ProfileScreen: React.FC = () => {
  const router = useRouter();

  const signOut = useAuth.use.signOut();
  const signOutHandler = async () => {
    try {
      const { access } = useAuth.getState().token || {};
      if (!access) throw new Error('No access token found');

      await client('/users/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
      });

      signOut(); // ✅ Call signOut from Zustand
      router.push('/login'); // Redirect after sign-out
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <View
      className="flex-1 bg-gray-50"
      style={{
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0,
      }}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={() => router.push('/view-profile')}
        className="flex-row items-center bg-white p-4"
      >
        {/* TODO: make image dynamic */}
        <Image
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJqcSD_2qz834cW2RuNWmvAbOMwcZdWSf81Q&s',
          }}
          className="mr-4 size-12 rounded-full"
        />
        <View>
          <Text className="text-xl font-bold text-gray-800">
            Ongchen Sherpa
          </Text>
          <Text className="text-sm text-gray-500">View your full profile</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#999"
          className="ml-auto"
        />
      </TouchableOpacity>

      {/* Content */}
      <ScrollView className="mt-4 px-4">
        {/* Section 1 */}
        <View className="mb-6 rounded-xl bg-white p-4">
          <ListItem
            icon={
              <MaterialIcons name="book-online" size={24} color="#00A86B" />
            }
            title="My Bookings"
            subtitle="View Transactions & Receipts"
            onPress={() => router.push('/bookings')}
          />
          <View className="my-2 h-px bg-gray-200" />
          <ListItem
            icon={<MaterialIcons name="group" size={24} color="#00A86B" />}
            title="Playpals"
            subtitle="View & Manage Players"
            onPress={() => router.push('/playpals')}
          />
          <View className="my-2 h-px bg-gray-200" />
          <ListItem
            icon={<MaterialIcons name="feedback" size={24} color="#00A86B" />}
            title="Feedback"
            subtitle="Help us improve with your thoughts"
            onPress={() => router.push('/feedback')}
          />
          <View className="my-2 h-px bg-gray-200" />
          <ListItem
            icon={
              <Ionicons name="shield-checkmark" size={24} color="#00A86B" />
            }
            title="Preference & Privacy"
            subtitle="Sports, Locations, Notifications, etc"
            onPress={() => router.push('/preferences')}
          />
        </View>

        {/* Section 2 */}
        <View className="rounded-xl bg-white p-4">
          <ListItem
            icon={<MaterialIcons name="local-offer" size={24} color="#888" />}
            title="Offers"
            onPress={() => router.push('/offers')}
          />
          <View className="my-2 h-px bg-gray-200" />
          <ListItem
            icon={<MaterialIcons name="support-agent" size={24} color="#888" />}
            title="Help & Support"
            onPress={() => router.push('/help-support')}
          />
          <View className="my-2 h-px bg-gray-200" />
          <ListItem
            icon={<MaterialIcons name="logout" size={24} color="#888" />}
            title="Logout"
            onPress={signOutHandler}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
