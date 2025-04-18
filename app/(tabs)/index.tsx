import Auth from "@/components/Auth"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import Form from "@/src/Form"
import tw from "@/tailwind"
import { Feather } from "@expo/vector-icons"
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity } from "react-native"
import 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function MainApp() {
  const { user, signOut } = useAuth()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {!user ? (
        <Auth />
      ) : (
        <View>
          <Text onPress={signOut} style={tw`ml-4 absolute top-0 mb-10 z-10 `}>
              <Feather onPress={signOut} name="log-out" size={24}  />
          </Text>
          <View >
            
            {/* <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.userText}>You are logged in as:</Text>
            <Text style={styles.emailText}>{user.email}</Text>
            <Text style={styles.userText}>User: {user.name}</Text>
            */}
            
            <Text style={tw`flex justify-center items-center  p-10 text-red-600 text-xl font-bold`}>Bem vindo, {user.name}!</Text>
            <Form />
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e5e5",
    paddingTop: 40,
  },
})
