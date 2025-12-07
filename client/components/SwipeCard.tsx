import React from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { Car, formatPrice, formatMileage } from "@/data/cars";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_WIDTH * 1.3;

interface SwipeCardProps {
  car: Car;
  onPress: () => void;
}

export default function SwipeCard({ car, onPress }: SwipeCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.backgroundDefault }, Shadows.card]}
    >
      <Image
        source={{ uri: car.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <ThemedText type="h2" style={styles.title}>
              {car.make} {car.model}
            </ThemedText>
            <View style={[styles.yearBadge, { backgroundColor: theme.backgroundSecondary }]}>
              <ThemedText style={styles.yearText}>{car.year}</ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.price, { color: theme.like }]}>
            {formatPrice(car.price)}
          </ThemedText>
        </View>

        <View style={styles.specs}>
          <View style={styles.specItem}>
            <Feather name="activity" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.specText, { color: theme.textSecondary }]}>
              {formatMileage(car.mileage)}
            </ThemedText>
          </View>
          <View style={styles.specItem}>
            <Feather name="settings" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.specText, { color: theme.textSecondary }]}>
              {car.transmission}
            </ThemedText>
          </View>
          <View style={styles.specItem}>
            <Feather name="zap" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.specText, { color: theme.textSecondary }]}>
              {car.fuelType}
            </ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={[styles.conditionBadge, { backgroundColor: theme.like + "20" }]}>
            <ThemedText style={[styles.conditionText, { color: theme.like }]}>
              {car.condition}
            </ThemedText>
          </View>
          <ThemedText style={[styles.tapHint, { color: theme.textSecondary }]}>
            Tap for details
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    height: CARD_HEIGHT,
  },
  image: {
    width: "100%",
    height: "60%",
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: "space-between",
  },
  header: {
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  title: {
    flex: 1,
  },
  yearBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  yearText: {
    fontWeight: "600",
    fontSize: 14,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
  },
  specs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.lg,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  specText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  conditionBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  conditionText: {
    fontWeight: "600",
    fontSize: 12,
  },
  tapHint: {
    fontSize: 12,
  },
});
