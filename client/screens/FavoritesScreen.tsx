import React from "react";
import { View, StyleSheet, FlatList, Pressable, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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
import { Car, formatPrice } from "@/data/cars";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { useFavorites } from "@/hooks/useFavorites";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.lg * 3) / 2;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function FavoriteCard({ car, onPress }: { car: Car; onPress: () => void }) {
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
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <Image
        source={{ uri: car.imageUrl }}
        style={styles.cardImage}
        contentFit="cover"
      />
      <View style={styles.cardContent}>
        <ThemedText type="small" style={styles.cardTitle} numberOfLines={1}>
          {car.year} {car.make}
        </ThemedText>
        <ThemedText style={[styles.cardModel, { color: theme.textSecondary }]} numberOfLines={1}>
          {car.model}
        </ThemedText>
        <View style={styles.cardFooter}>
          <ThemedText style={[styles.cardPrice, { color: theme.like }]}>
            {formatPrice(car.price)}
          </ThemedText>
          <Feather name="heart" size={14} color={theme.dislike} />
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { favorites } = useFavorites();

  const handleCardPress = (car: Car) => {
    navigation.navigate("CarDetail", { car, fromFavorites: true });
  };

  if (favorites.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.emptyContainer, { paddingTop: headerHeight + Spacing.xl }]}>
          <View style={[styles.emptyIconContainer, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="heart" size={48} color={theme.textSecondary} />
          </View>
          <ThemedText type="h3" style={styles.emptyTitle}>
            No Matches Yet
          </ThemedText>
          <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
            Start swiping to find your dream car! Cars you like will appear here.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <FavoriteCard car={item} onPress={() => handleCardPress(item)} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    ...Shadows.card,
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH * 0.75,
  },
  cardContent: {
    padding: Spacing.md,
  },
  cardTitle: {
    fontWeight: "600",
  },
  cardModel: {
    fontSize: 13,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  cardPrice: {
    fontWeight: "700",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["3xl"],
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
  },
});
