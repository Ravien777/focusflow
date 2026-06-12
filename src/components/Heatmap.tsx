import { View, Text, StyleSheet } from "react-native";
import { useStore } from "../store/useStore";
import { useTheme } from "../theme";
import { HeatmapCell } from "../utils/stats";

interface HeatmapProps {
  data: HeatmapCell[];
  color: string;
}

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const Heatmap = ({ data }: HeatmapProps) => {
  const theme = useTheme(useStore((s) => s.theme));

  if (data.length === 0) return null;

  const rows: HeatmapCell[][] = [[], [], [], [], [], [], []];
  for (const cell of data) {
    rows[cell.dayOfWeek].push(cell);
  }

  const maxCount = Math.max(...data.map((c) => c.count), 1);

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        {DAY_ABBR.map((day, i) => (
          <Text key={i} style={[styles.dayLabel, { color: theme.textMuted }]}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {rows.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((cell, ci) => {
              const intensity = cell.count / maxCount;
              return (
                <View
                  key={ci}
                  style={[
                    styles.cell,
                    {
                      backgroundColor:
                        cell.count > 0
                          ? `rgba(59, 130, 246, ${0.2 + 0.6 * intensity})`
                          : theme.btnSecondaryBg,
                    },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
  },
  labels: {
    width: 28,
    justifyContent: "space-between",
    paddingVertical: 1,
  },
  dayLabel: {
    fontSize: 9,
    fontWeight: "500",
    height: 12,
    lineHeight: 12,
  },
  grid: {
    gap: 2,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 2,
  },
  cell: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});
