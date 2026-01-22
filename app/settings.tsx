import { useState } from 'react';
import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button, Input } from '@/components/ui';
import { BackgroundImage } from '@/components/background-image.component';
import { StyledSafeAreaView } from '@/components/styled';
import { BackgroundPicker } from '@/features/settings/components/background-picker.component';
import { useUserStore, useAudioStore } from '@/stores';
import { colors } from '@/lib/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const { username, setUsername, clearUsername } = useUserStore();
  const { volume, toggleVolume } = useAudioStore();
  const [newUsername, setNewUsername] = useState(username || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveUsername = () => {
    if (newUsername.trim().length >= 3) {
      setUsername(newUsername.trim());
      setIsEditing(false);
    } else {
      Alert.alert('Invalid Username', 'Username must be at least 3 characters long');
    }
  };

  const handleClearUsername = () => {
    Alert.alert(
      'Clear Username',
      'Are you sure you want to clear your username?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearUsername();
            setNewUsername('');
          },
        },
      ]
    );
  };

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-3">
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Text className="ml-2 text-xl font-semibold text-foreground">
            Settings
          </Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Username Section */}
          <View className="mt-4 gap-4">
            <Text className="text-lg font-semibold text-foreground">Username</Text>

            {isEditing ? (
              <View className="gap-3">
                <Input
                  value={newUsername}
                  onChangeText={setNewUsername}
                  placeholder="Enter username (min 3 chars)"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View className="flex-row gap-3">
                  <Button
                    variant="ghost"
                    onPress={() => {
                      setIsEditing(false);
                      setNewUsername(username || '');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button variant="outline" onPress={handleSaveUsername} className="flex-1">
                    Save
                  </Button>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => setIsEditing(true)}
                className="flex-row items-center justify-between rounded-lg border border-border bg-card/50 p-4"
              >
                <Text className="text-foreground">
                  {username || 'Not set'}
                </Text>
                <View className="flex-row gap-2">
                  <Ionicons name="pencil" size={20} color={colors.foreground} />
                  {username && (
                    <Pressable onPress={handleClearUsername}>
                      <Ionicons name="trash" size={20} color={colors.destructive} />
                    </Pressable>
                  )}
                </View>
              </Pressable>
            )}
          </View>

          {/* Volume Section */}
          <View className="mt-8 gap-4">
            <Text className="text-lg font-semibold text-foreground">Audio</Text>

            <Pressable
              onPress={toggleVolume}
              className="flex-row items-center justify-between rounded-lg border border-border bg-card/50 p-4"
            >
              <View className="flex-row items-center gap-3">
                <Ionicons
                  name={volume === 'on' ? 'volume-high' : 'volume-mute'}
                  size={24}
                  color={colors.foreground}
                />
                <Text className="text-foreground">Flash Sound</Text>
              </View>
              <View
                className={`h-6 w-12 rounded-full p-1 ${volume === 'on' ? 'bg-success' : 'bg-input'}`}
              >
                <View
                  className={`h-4 w-4 rounded-full bg-white ${volume === 'on' ? 'ml-auto' : ''}`}
                />
              </View>
            </Pressable>
          </View>

          {/* Background Section */}
          <View className="mt-8 gap-4">
            <Text className="text-lg font-semibold text-foreground">Background</Text>
            <BackgroundPicker />
          </View>

          {/* App Info */}
          <View className="mt-12 pb-8">
            <Text className="text-center text-sm text-muted-foreground">
              LolTimeFlash Mobile v1.0.0
            </Text>
            <Text className="mt-2 text-center text-xs text-muted-foreground">
              Not endorsed by Riot Games
            </Text>
          </View>
        </ScrollView>
      </StyledSafeAreaView>
    </BackgroundImage>
  );
}
