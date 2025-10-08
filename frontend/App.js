import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider } from "./src/context/AuthContext"
import { ListsProvider } from "./src/context/ListsContext"
import RootNavigator from "./src/navigation/RootNavigator"

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ListsProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ListsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
