import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { client } from '@/api';
import { useCurrentUser } from '@/api/auth/use-current-user';
import CustomHeader from '@/components/custom-header';
import { UserAvatar } from '@/components/profile/user-avatar';
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

  const { data: user, isLoading } = useCurrentUser();

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
    <>
      <CustomHeader>
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.push('/view-profile')}
          className="flex-row items-center gap-4  p-4"
        >
          <UserAvatar />
          <View>
            <Text className="text-2xl font-bold tracking-widest text-white">
              {isLoading
                ? 'Loading...'
                : user?.first_name || user?.last_name
                  ? `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()
                  : 'Guest'}
            </Text>
            <Text className="text-md tracking-wider text-white">
              View your full profile
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color="#fff"
            className="ml-auto"
          />
        </TouchableOpacity>
      </CustomHeader>
      <View className="flex-1 bg-gray-50">
        {/* Content */}
        <ScrollView className="mt-4 px-1">
          {/* Section 1 */}
          <View className="mb-6 rounded-xl bg-white px-1 py-2">
            <ListItem
              icon={
                <MaterialIcons name="book-online" size={24} color="#00A86B" />
              }
              title="My Bookings"
              subtitle="View All Bookings Done"
              onPress={() => router.push('/user-bookings-screen')}
            />
            <View className="my-2 h-px bg-gray-200" />
            <ListItem
              icon={<MaterialIcons name="group" size={24} color="#00A86B" />}
              title="Playpals"
              subtitle="View & Manage Players"
              onPress={() => router.push('/coming-soon-screen')}
            />
            <View className="my-2 h-px bg-gray-200" />
            <ListItem
              icon={<MaterialIcons name="feedback" size={24} color="#00A86B" />}
              title="Feedback"
              subtitle="Help us improve with your thoughts"
              onPress={() => router.push('/feedback')}
            />
            <View className="my-2 h-px bg-gray-200" />
          </View>

          {/* Section 2 */}
          <View className="rounded-xl bg-white px-1 py-2">
            <ListItem
              icon={<MaterialIcons name="local-offer" size={24} color="#888" />}
              title="Offers"
              onPress={() => router.push('/link')}
            />
            <View className="my-2 h-px bg-gray-200" />
            <ListItem
              icon={
                <MaterialIcons name="support-agent" size={24} color="#888" />
              }
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
    </>
  );
};

export default ProfileScreen;
