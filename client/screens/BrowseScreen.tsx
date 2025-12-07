import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SwipeCard from "@/components/SwipeCard";
import ActionButton from "@/components/ActionButton";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { CARS, Car } from "@/data/cars";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { useFavorites } from "@/hooks/useFavorites";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BrowseScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { addFavorite } = useFavorites();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<Car[]>([...CARS]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const resetDeck = useCallback(() => {
    setCards([...CARS]);
    setCurrentIndex(0);
  }, []);

  const removeCard = useCallback((liked: boolean) => {
    const currentCar = cards[0];
    if (liked && currentCar) {
      addFavorite(currentCar);
    }
    setCards((prev) => prev.slice(1));
    setCurrentIndex((prev) => prev + 1);
    translateX.value = 0;
    translateY.value = 0;
  }, [cards, addFavorite, translateX, translateY]);

  const handleSwipeComplete = useCallback((direction: "left" | "right") => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    removeCard(direction === "right");
  }, [removeCard]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? "right" : "left";
        translateX.value = withTiming(
          direction === "right" ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5,
          { duration: 300 },
          () => {
            runOnJS(handleSwipeComplete)(direction);
          }
        );
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-15, 0, 15],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  const dislikeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const handleLike = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
      runOnJS(removeCard)(true);
    });
  }, [translateX, removeCard]);

  const handleDislike = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
      runOnJS(removeCard)(false);
    });
  }, [translateX, removeCard]);

  const handleCardPress = useCallback((car: Car) => {
    navigation.navigate("CarDetail", { car, fromFavorites: false });
  }, [navigation]);

  const currentCar = cards[0];
  const nextCar = cards[1];

  if (cards.length === 0) {
    return (
      <ThemedView style={[styles.container, { paddingTop: headerHeight + Spacing.xl }]}>
        <View style={styles.emptyContainer}>
          <Feather name="refresh-cw" size={64} color={theme.textSecondary} />
          <ThemedText type="h3" style={styles.emptyTitle}>
            No More Cars
          </ThemedText>
          <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
            You've seen all the cars! Tap below to start over.
          </ThemedText>
          <Pressable
            style={[styles.resetButton, { backgroundColor: theme.like }]}
            onPress={resetDeck}
          >
            <ThemedText style={styles.resetButtonText}>Start Over</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.cardContainer, { paddingTop: headerHeight + Spacing.xl }]}>
        {nextCar ? (
          <View style={[styles.cardWrapper, styles.nextCard]}>
            <SwipeCard car={nextCar} onPress={() => {}} />
          </View>
        ) : null}

        {currentCar ? (
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.cardWrapper, cardAnimatedStyle]}>
              <Animated.View style={[styles.overlay, styles.likeOverlay, { backgroundColor: theme.cardOverlayLike }, likeOverlayStyle]}>
                <View style={[styles.overlayBadge, { borderColor: theme.like }]}>
                  <ThemedText style={[styles.overlayText, { color: theme.like }]}>LIKE</ThemedText>
                </View>
              </Animated.View>
              <Animated.View style={[styles.overlay, styles.dislikeOverlay, { backgroundColor: theme.cardOverlayDislike }, dislikeOverlayStyle]}>
                <View style={[styles.overlayBadge, { borderColor: theme.dislike }]}>
                  <ThemedText style={[styles.overlayText, { color: theme.dislike }]}>NOPE</ThemedText>
                </View>
              </Animated.View>
              <SwipeCard car={currentCar} onPress={() => handleCardPress(currentCar)} />
            </Animated.View>
          </GestureDetector>
        ) : null}
      </View>

      <View style={[styles.actionButtons, { bottom: tabBarHeight + Spacing.xl }]}>
        <ActionButton
          icon="x"
          color={theme.dislike}
          onPress={handleDislike}
          size="medium"
        />
        <ActionButton
          icon="star"
          color={theme.superLike}
          onPress={handleLike}
          size="small"
        />
        <ActionButton
          icon="heart"
          color={theme.like}
          onPress={handleLike}
          size="medium"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  cardWrapper: {
    position: "absolute",
    width: "100%",
  },
  nextCard: {
    transform: [{ scale: 0.95 }],
    opacity: 0.7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    borderRadius: BorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  likeOverlay: {},
  dislikeOverlay: {},
  overlayBadge: {
    borderWidth: 4,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    transform: [{ rotate: "-20deg" }],
  },
  overlayText: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 2,
  },
  actionButtons: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
    paddingHorizontal: Spacing["3xl"],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["3xl"],
  },
  emptyTitle: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  resetButton: {
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
