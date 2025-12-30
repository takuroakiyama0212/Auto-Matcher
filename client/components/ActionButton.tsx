import React from "react";
import { StyleSheet, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { BorderRadius, Shadows } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionButtonProps {
  icon: "x" | "star" | "heart";
  color: string;
  onPress: () => void;
  size?: "small" | "medium" | "large";
}

export default function ActionButton({
  icon,
  color,
  onPress,
  size = "medium",
}: ActionButtonProps) {
  const scale = useSharedValue(1);

  const buttonSize = size === "small" ? 48 : size === "large" ? 72 : 60;
  const iconSize = size === "small" ? 20 : size === "large" ? 32 : 26;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.9); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor: color,
        },
        Platform.OS !== "web" && Shadows.button,
        animatedStyle,
      ]}
    >
      <Feather name={icon} size={iconSize} color="#FFFFFF" />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
});
