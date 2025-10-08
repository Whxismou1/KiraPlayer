"use client"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "../context/AuthContext"
import TabNavigator from "./TabNavigator"
import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"
import InfoScreen from "../screens/InfoScreen"

const Stack = createNativeStackNavigator()

export default function RootNavigator() {
  const { isAuthenticated } = useAuth()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0f0f10" },
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ presentation: "modal" }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ presentation: "modal" }} />
      <Stack.Screen name="Info" component={InfoScreen} options={{ presentation: "card" }} />
    </Stack.Navigator>
  )
}
