import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme";
import { useStore } from "../store/useStore";
import { TrendData } from "../utils/stats";

interface TrendChartProps {
  data: TrendData[];
}

export const TrendChart = ({ data }: TrendChartProps) => {
  const theme = useTheme(useStore((s) => s.theme));
  const maxRate = Math.max(...data.map((d) => d.rate), 0.01);

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {data.map((d, i) => {
          const height = (d.rate / maxRate) * 80;
          return (
            <View key={i} style={styles.barCol}>
              <Text style={[styles.barValue, { color: theme.textMuted }]}>
                {d.count}
              </Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(height, 4),
                    backgroundColor: d.rate > 0 ? theme.accent : theme.btnSecondaryBg,
                  },
                ]}
              />
              <Text style={[styles.barLabel, { color: theme.textMuted }]}>
                {d.weekLabel}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 110,
  },
  barCol: { alignItems: "center", gap: 4, flex: 1 },
  barValue: { fontSize: 11, fontWeight: "600" },
  bar: { width: 16, borderRadius: 4 },
  barLabel: { fontSize: 10, fontWeight: "600" },
});
