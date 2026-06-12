import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme";
import { useStore } from "../store/useStore";

interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export const GoogleSignInButton = ({ onPress, loading }: GoogleSignInButtonProps) => {
  const theme = useTheme(useStore((s) => s.theme));

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      <Ionicons name="logo-google" size={20} color={theme.text} />
      <Text style={[styles.text, { color: theme.text }]}>
        {loading ? "Signing in..." : "Continue with Google"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  text: { fontSize: 16, fontWeight: "600" },
});
