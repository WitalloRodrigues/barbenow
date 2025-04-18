"use client"

import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const { signIn, signUp } = useAuth()

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password")
      return
    }

    setLoading(true)
    try {
      const success = await signIn(email, password)
      if (!success) {
        Alert.alert("Error", "Invalid email or password")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password")
      return
    }

    setLoading(true)
    try {
      const success = await signUp(email, password)
      if (success) {
        Alert.alert("Success", "Account created successfully! You can now log in.")
        setIsLogin(true)
      } else {
        Alert.alert("Error", "Email already in use")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: "https://placeholder.svg?height=100&width=100" }} style={styles.logo} />
          <Text style={styles.appName}>Login Witallo gostoso</Text>
        </View>

        <Text style={styles.headerText}>{isLogin ? "Entre na sua conta" : "Crie uma nova conta"}</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              value={email}
              placeholderTextColor="gray"
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="gray"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {isLogin && <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={() => (isLogin ? handleSignIn() : handleSignUp())}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
                <Text style={styles.buttonText}>{isLogin ? "Entrar" : "Cadastrar"}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchModeContainer} onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchModeText}>
                {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
              <Text style={styles.switchModeAction}>{isLogin ?  "Cadastrardis" : "Entrar"}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  forgotPassword: {
    textAlign: "right",
    color: "#3b82f6",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchModeContainer: {
    alignItems: "center",
  },
  switchModeText: {
    fontSize: 14,
    color: "#666",
  },
  switchModeAction: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
})
