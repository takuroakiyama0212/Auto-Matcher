import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { Car, formatPrice, formatMileage } from "@/data/cars";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { useFavorites } from "@/hooks/useFavorites";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type CarDetailRouteProp = RouteProp<RootStackParamList, "CarDetail">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SpecItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.specItem, { backgroundColor: theme.backgroundSecondary }]}>
      <Feather name={icon as any} size={20} color={theme.textSecondary} />
      <ThemedText style={[styles.specLabel, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <ThemedText style={styles.specValue}>{value}</ThemedText>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[styles.actionButton, { backgroundColor: color }, animatedStyle]}
    >
      <Feather name={icon as any} size={20} color="#FFFFFF" />
      <ThemedText style={styles.actionButtonText}>{label}</ThemedText>
    </AnimatedPressable>
  );
}

export default function CarDetailModal() {
  const { theme } = useTheme();
  const route = useRoute<CarDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const { car, fromFavorites } = route.params;
  const isLiked = favorites.some((f) => f.id === car.id);

  const handleLike = () => {
    addFavorite(car);
    navigation.goBack();
  };

  const handleRemove = () => {
    removeFavorite(car.id);
    navigation.goBack();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.sm,
            paddingBottom: insets.bottom + Spacing["5xl"] + 60,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: car.imageUrl }}
          style={styles.heroImage}
          contentFit="cover"
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <ThemedText type="h2">
                {car.year} {car.make} {car.model}
              </ThemedText>
              <View style={styles.conditionBadge}>
                <View style={[styles.conditionDot, { backgroundColor: theme.like }]} />
                <ThemedText style={[styles.conditionText, { color: theme.textSecondary }]}>
                  {car.condition}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={[styles.price, { color: theme.like }]}>
              {formatPrice(car.price)}
            </ThemedText>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Feather name="activity" size={16} color={theme.textSecondary} />
              <ThemedText style={[styles.quickStatText, { color: theme.textSecondary }]}>
                {formatMileage(car.mileage)}
              </ThemedText>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Feather name="settings" size={16} color={theme.textSecondary} />
              <ThemedText style={[styles.quickStatText, { color: theme.textSecondary }]}>
                {car.transmission}
              </ThemedText>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Feather name="zap" size={16} color={theme.textSecondary} />
              <ThemedText style={[styles.quickStatText, { color: theme.textSecondary }]}>
                {car.fuelType}
              </ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Description
            </ThemedText>
            <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
              {car.description}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Specifications
            </ThemedText>
            <View style={styles.specsGrid}>
              <SpecItem icon="cpu" label="Engine" value={car.specs.engine} />
              <SpecItem icon="zap" label="Horsepower" value={`${car.specs.horsepower} HP`} />
              <SpecItem icon="navigation" label="Top Speed" value={car.specs.topSpeed} />
              <SpecItem icon="clock" label="0-60 mph" value={car.specs.acceleration} />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + Spacing.lg, backgroundColor: theme.backgroundRoot }]}>
        {fromFavorites ? (
          <>
            <ActionButton
              icon="trash-2"
              label="Remove"
              color={theme.dislike}
              onPress={handleRemove}
            />
            <ActionButton
              icon="share"
              label="Share"
              color={theme.superLike}
              onPress={() => {}}
            />
          </>
        ) : (
          <>
            {isLiked ? (
              <View style={[styles.likedBadge, { backgroundColor: theme.like + "20" }]}>
                <Feather name="check-circle" size={20} color={theme.like} />
                <ThemedText style={[styles.likedText, { color: theme.like }]}>
                  Added to Favorites
                </ThemedText>
              </View>
            ) : (
              <ActionButton
                icon="heart"
                label="Like This Car"
                color={theme.like}
                onPress={handleLike}
              />
            )}
          </>
        )}
      </View>
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
  heroImage: {
    width: SCREEN_WIDTH - Spacing.lg * 2,
    height: SCREEN_WIDTH * 0.6,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  headerText: {
    flex: 1,
    marginRight: Spacing.md,
  },
  conditionBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  conditionText: {
    fontSize: 14,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
  },
  quickStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  quickStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  quickStatText: {
    fontSize: 14,
  },
  quickStatDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  description: {
    lineHeight: 24,
  },
  specsGrid: {
    gap: Spacing.sm,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  specLabel: {
    flex: 1,
    fontSize: 14,
  },
  specValue: {
    fontWeight: "600",
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  likedBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  likedText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
