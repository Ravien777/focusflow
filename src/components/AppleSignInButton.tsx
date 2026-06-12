import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme";
import { useStore } from "../store/useStore";

interface AppleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export const AppleSignInButton = ({ onPress, loading }: AppleSignInButtonProps) => {
  const theme = useTheme(useStore((s) => s.theme));

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: theme.text, borderColor: theme.text }]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      <Ionicons name="logo-apple" size={20} color={theme.bg} />
      <Text style={[styles.text, { color: theme.bg }]}>
        {loading ? "Signing in..." : "Continue with Apple"}
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
