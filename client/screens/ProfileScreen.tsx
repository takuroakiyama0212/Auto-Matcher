import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useFavorites } from "@/hooks/useFavorites";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { CARS } from "@/data/cars";

const CAR_TYPES = ["Sedan", "SUV", "Sports", "Electric", "Classic"];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function GoogleSignInButton({ onPress, isLoading }: { onPress: () => void; isLoading: boolean }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      disabled={isLoading}
      style={[
        styles.googleButton,
        { backgroundColor: "#4285F4" },
        isLoading && { opacity: 0.6 },
        animatedStyle,
      ]}
    >
      <Feather name="log-in" size={18} color="#FFFFFF" />
      <ThemedText style={styles.googleButtonText}>
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </ThemedText>
    </AnimatedPressable>
  );
}

function GoogleSignOutButton({ onPress, color }: { onPress: () => void; color: string }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[styles.googleButton, { backgroundColor: color }, animatedStyle]}
    >
      <Feather name="log-out" size={18} color="#FFFFFF" />
      <ThemedText style={styles.googleButtonText}>Sign Out</ThemedText>
    </AnimatedPressable>
  );
}

function AvatarOption({
  icon,
  color,
  selected,
  onPress,
}: {
  icon: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.9); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[
        styles.avatarOption,
        { backgroundColor: color },
        selected && { borderWidth: 3, borderColor: theme.text },
        animatedStyle,
      ]}
    >
      <Feather name={icon as any} size={32} color="#FFFFFF" />
    </AnimatedPressable>
  );
}

function TypeChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[
        styles.typeChip,
        {
          backgroundColor: selected ? theme.like : theme.backgroundSecondary,
        },
        animatedStyle,
      ]}
    >
      <ThemedText
        style={[
          styles.typeChipText,
          { color: selected ? "#FFFFFF" : theme.text },
        ]}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.statCard, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + "20" }]}>
        <Feather name={icon as any} size={20} color={color} />
      </View>
      <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
      <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
    </View>
  );
}

export default function ProfileScreen() {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { favorites, clearFavorites } = useFavorites();
  const { user, isAuthenticated, isLoading, signIn, signOut } = useGoogleAuth();

  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Sports", "Electric"]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const avatars = [
    { icon: "zap", color: "#FF6B6B" },
    { icon: "award", color: "#FFB347" },
    { icon: "truck", color: "#339AF0" },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarRow}>
            {avatars.map((avatar, index) => (
              <AvatarOption
                key={index}
                icon={avatar.icon}
                color={avatar.color}
                selected={selectedAvatar === index}
                onPress={() => setSelectedAvatar(index)}
              />
            ))}
          </View>
          <ThemedText type="h3" style={styles.userName}>
            {isAuthenticated && user ? user.name : "Car Enthusiast"}
          </ThemedText>
          <ThemedText style={[styles.userTagline, { color: theme.textSecondary }]}>
            {isAuthenticated && user ? user.email : "Looking for my next ride"}
          </ThemedText>
          
          {!isAuthenticated ? (
            <GoogleSignInButton
              onPress={signIn}
              isLoading={isLoading}
            />
          ) : (
            <GoogleSignOutButton
              onPress={signOut}
              color={theme.dislike}
            />
          )}
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="eye"
            label="Viewed"
            value={CARS.length}
            color={theme.superLike}
          />
          <StatCard
            icon="heart"
            label="Liked"
            value={favorites.length}
            color={theme.dislike}
          />
          <StatCard
            icon="percent"
            label="Match Rate"
            value={CARS.length > 0 ? Math.round((favorites.length / CARS.length) * 100) + "%" : "0%"}
            color={theme.like}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Preferred Car Types
          </ThemedText>
          <View style={styles.typeChipsContainer}>
            {CAR_TYPES.map((type) => (
              <TypeChip
                key={type}
                label={type}
                selected={selectedTypes.includes(type)}
                onPress={() => toggleType(type)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            About CarSwipe
          </ThemedText>
          <View style={[styles.aboutCard, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText style={[styles.aboutText, { color: theme.textSecondary }]}>
              Swipe right on cars you love, left on ones you don't. Your matches appear in the Favorites tab. It's that simple!
            </ThemedText>
            <View style={[styles.versionRow, { borderTopColor: theme.border }]}>
              <ThemedText style={[styles.versionText, { color: theme.textSecondary }]}>
                Version 1.0.0
              </ThemedText>
            </View>
          </View>
        </View>

        {favorites.length > 0 ? (
          <Pressable
            style={[styles.clearButton, { backgroundColor: theme.dislike + "20" }]}
            onPress={clearFavorites}
          >
            <Feather name="trash-2" size={18} color={theme.dislike} />
            <ThemedText style={[styles.clearButtonText, { color: theme.dislike }]}>
              Clear All Favorites
            </ThemedText>
          </Pressable>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  avatarRow: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  avatarOption: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    marginBottom: Spacing.xs,
  },
  userTagline: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing["2xl"],
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.lg,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  typeChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  typeChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  typeChipText: {
    fontWeight: "500",
  },
  aboutCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  aboutText: {
    lineHeight: 22,
  },
  versionRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  versionText: {
    fontSize: 12,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  clearButtonText: {
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.lg,
  },
  googleButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
