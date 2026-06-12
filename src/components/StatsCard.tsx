import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../store/useStore";
import { useTheme } from "../theme";

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

export const StatsCard = ({ icon, label, value, color }: StatsCardProps) => {
  const theme = useTheme(useStore((s) => s.theme));
  const accent = color ?? theme.accent;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${accent}20` }]}>
        <Ionicons name={icon as any} size={22} color={accent} />
      </View>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  value: { fontSize: 22, fontWeight: "800" },
  label: { fontSize: 12, fontWeight: "500", textAlign: "center" },
});
