import React, { useCallback, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent, Share, Platform, Alert } from "react-native";
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
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

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
  const { favorites, addFavorite, removeFavorite, isAuthenticated } = useFavorites();
  const { isAuthenticated: isGoogleAuthenticated } = useGoogleAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const viewShotRef = useRef<any>(null);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 });
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index?: number }> }) => {
    const nextIndex = viewableItems?.[0]?.index;
    if (typeof nextIndex === "number") {
      setActiveImageIndex(nextIndex);
    }
  });
  const updateIndexFromOffset = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const width = event.nativeEvent.layoutMeasurement.width || SCREEN_WIDTH - Spacing.lg * 2;
    if (width === 0) return;
    const nextIndex = Math.round(offsetX / width);
    setActiveImageIndex(nextIndex);
  }, []);
  const handleMomentumEnd = useCallback(updateIndexFromOffset, [updateIndexFromOffset]);
  const handleScroll = useCallback(updateIndexFromOffset, [updateIndexFromOffset]);

  const { car, fromFavorites } = route.params;
  const isLiked = favorites.some((f) => f.id === car.id);

  const handleLike = async () => {
    if (!isAuthenticated || !isGoogleAuthenticated) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to add cars to your favorites.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign In",
            onPress: () => {
              navigation.goBack();
              // Profile画面に遷移する処理は親コンポーネントで行う
            },
          },
        ]
      );
      return;
    }
    try {
      await addFavorite(car);
    navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add favorite");
    }
  };

  const handleRemove = () => {
    removeFavorite(car.id);
    navigation.goBack();
  };

  const handleShare = async () => {
    try {
      const carInfo = `${car.year} ${car.make} ${car.model}`;
      const priceInfo = formatPrice(car.price);
      const shareText = `${carInfo}\n${priceInfo}`;

      if (Platform.OS === "web") {
        // Web環境: 車の画像を取得してシェア
        try {
          // 画像要素から画像を取得
          const imgElement = document.querySelector(`[data-car-image="${car.id}-${activeImageIndex}"]`) as HTMLImageElement | HTMLCanvasElement;
          let imageBlob: Blob | null = null;

          if (imgElement) {
            // img要素またはcanvas要素から画像を取得
            if (imgElement instanceof HTMLImageElement && imgElement.src) {
              try {
                // CORSエラーを避けるため、canvasに描画してからBlobに変換
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  canvas.width = imgElement.naturalWidth || imgElement.width;
                  canvas.height = imgElement.naturalHeight || imgElement.height;
                  ctx.drawImage(imgElement, 0, 0);
                  canvas.toBlob((blob) => {
                    if (blob) {
                      imageBlob = blob;
                      shareWithImage(blob);
                    } else {
                      shareTextOnly();
                    }
                  }, "image/png");
                  return;
                }
              } catch (error) {
                console.error("Canvas error:", error);
                // フォールバック: 直接fetch
                try {
                  const response = await fetch(imgElement.src);
                  imageBlob = await response.blob();
                } catch (fetchError) {
                  console.error("Fetch error:", fetchError);
                }
              }
            } else if (imgElement instanceof HTMLCanvasElement) {
              imgElement.toBlob((blob) => {
                if (blob) {
                  shareWithImage(blob);
                } else {
                  shareTextOnly();
                }
              }, "image/png");
              return;
            }
          }

          // 画像要素が見つからない場合、画像URLから直接取得を試みる
          if (!imageBlob) {
            const currentImage = car.imageUrls[activeImageIndex];
            let imageUrl: string | null = null;

            if (typeof currentImage === "string") {
              imageUrl = currentImage;
            } else if (currentImage && typeof currentImage === "object") {
              // require()で読み込んだ画像の場合、expo-imageが生成したURLを探す
              const imgEl = document.querySelector(`img[src*="${car.id}"]`) as HTMLImageElement;
              if (imgEl && imgEl.src) {
                imageUrl = imgEl.src;
              }
            }

            if (imageUrl) {
              try {
                const response = await fetch(imageUrl);
                imageBlob = await response.blob();
              } catch (error) {
                console.error("Image fetch error:", error);
              }
            }
          }

          if (imageBlob) {
            shareWithImage(imageBlob);
            return;
          }
        } catch (error) {
          console.error("Image share error:", error);
        }

        // テキストのみシェア
        shareTextOnly();

        function shareWithImage(blob: Blob) {
          const file = new File([blob], `${car.make}-${car.model}.png`, { type: "image/png" });
          const shareData = {
            title: carInfo,
            text: shareText,
            files: [file],
          };
          
          if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            navigator.share(shareData).catch((error) => {
              console.error("Share error:", error);
              shareTextOnly();
            });
          } else {
            // フォールバック: 画像をダウンロード
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${car.make}-${car.model}.png`;
            a.click();
            URL.revokeObjectURL(url);
            shareTextOnly();
          }
        }

        function shareTextOnly() {
          const shareContent = {
            title: carInfo,
            text: shareText,
          };
          
          if (navigator.share) {
            navigator.share(shareContent).catch(() => {
              navigator.clipboard.writeText(`${shareText}\n\nCheck out this amazing car!`).then(() => {
                Alert.alert("Copied!", "Car information copied to clipboard");
              });
            });
          } else {
            navigator.clipboard.writeText(`${shareText}\n\nCheck out this amazing car!`).then(() => {
              Alert.alert("Copied!", "Car information copied to clipboard");
            });
          }
        }
      } else {
        // モバイル環境: 車の画像と情報をシェア
        try {
          const currentImage = car.imageUrls[activeImageIndex];
          let imageUri: string | null = null;

          // 画像URIを取得
          if (typeof currentImage === "string") {
            imageUri = currentImage;
          } else if (currentImage && typeof currentImage === "object" && "uri" in currentImage) {
            imageUri = (currentImage as any).uri;
          }

          const shareOptions: any = {
            message: shareText,
            title: carInfo,
          };

          if (imageUri) {
            shareOptions.url = imageUri;
          }

          const result = await Share.share(shareOptions);
          if (result.action === Share.sharedAction) {
            console.log("Shared successfully");
          }
        } catch (error) {
          console.error("Share error:", error);
          // フォールバック: テキストのみシェア
          const shareContent = {
            message: shareText,
            title: carInfo,
          };
          await Share.share(shareContent);
        }
      }
    } catch (error: any) {
      if (error.message !== "User did not share") {
        Alert.alert("Error", "Failed to share car details");
        console.error("Share error:", error);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View 
        {...(Platform.OS === "web" ? { "data-share-container": "true" } as any : {})}
        ref={Platform.OS !== "web" ? viewShotRef : undefined}
        collapsable={false}
        style={styles.shareContainer}
      >
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
        <View style={styles.galleryContainer}>
          <FlatList
            data={car.imageUrls}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `${car.id}-image-${index}`}
            renderItem={({ item, index }) => (
        <Image
                source={item}
          style={styles.heroImage}
          contentFit="cover"
                {...(Platform.OS === "web" ? { "data-car-image": `${car.id}-${index}` } as any : {})}
              />
            )}
            style={styles.heroList}
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={viewabilityConfig.current}
            decelerationRate="fast"
            onMomentumScrollEnd={handleMomentumEnd}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={SCREEN_WIDTH - Spacing.lg * 2}
            snapToAlignment="start"
            disableIntervalMomentum
            nestedScrollEnabled
          />
          <View style={styles.dots}>
            {car.imageUrls.map((_, index) => (
              <View
                key={`${car.id}-dot-${index}`}
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === activeImageIndex ? theme.like : theme.backgroundSecondary,
                  },
                ]}
              />
            ))}
          </View>
        </View>

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
      </View>

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
              onPress={handleShare}
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
  shareContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  galleryContainer: {
    marginBottom: Spacing.xl,
  },
  heroList: {
    width: SCREEN_WIDTH - Spacing.lg * 2,
    alignSelf: "center",
  },
  heroImage: {
    width: SCREEN_WIDTH - Spacing.lg * 2,
    height: SCREEN_WIDTH * 0.6,
    borderRadius: BorderRadius.xl,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
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
