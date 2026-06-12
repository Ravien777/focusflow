import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../src/store/useStore";
import { useTheme } from "../../src/theme";
import { signInWithEmail } from "../../src/services/auth";
import { isFirebaseAvailable } from "../../src/services/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useStore((s) => s.setUser);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme(useStore((s) => s.theme));
  const fbAvailable = isFirebaseAvailable();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const user = await signInWithEmail(email.trim(), password);
      setUser(user);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Login Failed", e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.back}
        hitSlop={12}
      >
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        {fbAvailable ? (
          <>
            <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              Sign in to sync your habits
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.cardBorder }]}
              placeholder="Email"
              placeholderTextColor={theme.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.cardBorder }]}
              placeholder="Password"
              placeholderTextColor={theme.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: theme.accent }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.btnText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              style={styles.link}
            >
              <Text style={[styles.linkText, { color: theme.accent }]}>
                Don't have an account? Sign up
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={[styles.unavailableCard, { backgroundColor: theme.card, borderColor: theme.warning }]}>
            <Ionicons name="warning-outline" size={28} color={theme.warning} />
            <Text style={[styles.unavailableTitle, { color: theme.text }]}>
              Firebase Not Configured
            </Text>
            <Text style={[styles.unavailableDesc, { color: theme.textMuted }]}>
              Sign-in requires Firebase API keys. Add them to src/services/firebase.ts to enable authentication.
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { padding: 16 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: "center", gap: 16 },
  title: { fontSize: 32, fontWeight: "800" },
  subtitle: { fontSize: 16, marginBottom: 8 },
  unavailableCard: {
    alignItems: "center",
    gap: 12,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  unavailableTitle: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  unavailableDesc: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  btn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  link: { alignItems: "center", paddingVertical: 8 },
  linkText: { fontSize: 15, fontWeight: "600" },
});
