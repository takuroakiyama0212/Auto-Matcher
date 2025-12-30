import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import CarDetailModal from "@/screens/CarDetailModal";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { Car } from "@/data/cars";

export type RootStackParamList = {
  Main: undefined;
  CarDetail: { car: Car; fromFavorites?: boolean };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CarDetail"
        component={CarDetailModal}
        options={{
          presentation: "modal",
          headerTitle: "Car Details",
        }}
      />
    </Stack.Navigator>
  );
}
