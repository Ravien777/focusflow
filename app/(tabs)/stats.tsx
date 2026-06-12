import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../src/store/useStore";
import { useTheme } from "../../src/theme";
import { StatsCard } from "../../src/components/StatsCard";
import { Heatmap } from "../../src/components/Heatmap";
import { TrendChart } from "../../src/components/TrendChart";
import {
  getAggregatedStats,
  getWeeklyData,
  getHeatmapData,
  getCompletionRate,
  getTotalCheckIns,
  getLongestStreak,
  getTrendData,
  predictStreak,
  generateCSV,
} from "../../src/utils/stats";
import { calculateLevel, xpForNextLevel, BADGES } from "../../src/utils/gamification";
import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function StatsScreen() {
  const habits = useStore((s) => s.habits.filter((h) => !h.archived));
  const xp = useStore((s) => s.xp);
  const level = useStore((s) => s.level);
  const earnedBadges = useStore((s) => s.earnedBadges);
  const isPremium = useStore((s) => s.isPremium);
  const theme = useTheme(useStore((s) => s.theme));
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const selectedHabit = selectedHabitId
    ? habits.find((h) => h.id === selectedHabitId)
    : null;

  const aggStats = useMemo(() => getAggregatedStats(habits), [habits]);

  const weeklyData = useMemo(
    () => (selectedHabit ? getWeeklyData(selectedHabit) : []),
    [selectedHabit],
  );

  const heatmapData = useMemo(
    () => (selectedHabit ? getHeatmapData(selectedHabit) : []),
    [selectedHabit],
  );

  const trendData = useMemo(
    () => (selectedHabit && isPremium ? getTrendData(selectedHabit) : []),
    [selectedHabit, isPremium],
  );

  const predictedStreak = useMemo(
    () => (selectedHabit && isPremium ? predictStreak(selectedHabit) : 0),
    [selectedHabit, isPremium],
  );

  const habitStats = selectedHabit
    ? {
        completionRate: getCompletionRate(selectedHabit, 30),
        totalCheckIns: getTotalCheckIns(selectedHabit),
        longestStreak: getLongestStreak(selectedHabit),
      }
    : null;

  const handleExportCSV = async () => {
    if (!isPremium) return;
    const csv = generateCSV(habits);
    const file = new File(Paths.cache, "focusflow_export.csv");
    await file.write(csv);
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(file.uri, { mimeType: "text/csv" });
    } else {
      Alert.alert("Export Ready", "CSV file saved to cache.");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={[styles.title, { color: theme.text }]}>📊 Stats</Text>

      <View style={[styles.levelCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.levelInfo}>
          <View style={[styles.levelBadge, { backgroundColor: `${theme.accent}20` }]}>
            <Text style={[styles.levelNumber, { color: theme.accent }]}>{level}</Text>
          </View>
          <View style={styles.levelDetails}>
            <Text style={[styles.levelTitle, { color: theme.text }]}>Level {level}</Text>
            <Text style={[styles.levelXp, { color: theme.textMuted }]}>
              {xp} / {xpForNextLevel(level)} XP
            </Text>
            <View style={[styles.xpBarTrack, { backgroundColor: theme.progressTrack }]}>
              <View
                style={[
                  styles.xpBarFill,
                  {
                    width: `${Math.min((xp / xpForNextLevel(level)) * 100, 100)}%`,
                    backgroundColor: theme.accent,
                  },
                ]}
              />
            </View>
          </View>
        </View>
        {earnedBadges.length > 0 && (
          <View style={styles.badgesRow}>
            {earnedBadges.map((badgeId) => {
              const badge = BADGES.find((b) => b.id === badgeId);
              if (!badge) return null;
              return (
                <View key={badgeId} style={styles.badgeItem}>
                  <View style={[styles.badgeIcon, { backgroundColor: `${theme.accent}20` }]}>
                    <Ionicons name={badge.icon as any} size={16} color={theme.accent} />
                  </View>
                  <Text style={[styles.badgeName, { color: theme.textMuted }]}>
                    {badge.name}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.aggRow}>
        <StatsCard
          icon="checkmark-circle"
          label="Total Check-ins"
          value={aggStats.totalCheckIns}
          color={theme.accent}
        />
        <StatsCard
          icon="flame"
          label="Best Streak"
          value={aggStats.bestStreak}
          color="#F59E0B"
        />
        <StatsCard
          icon="timer"
          label="Focus Hours"
          value={(aggStats.totalFocusedMinutes / 60).toFixed(1)}
          color="#10B981"
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          This Week
        </Text>
        <View style={styles.weeklyBars}>
          {weeklyData.map((d) => {
            const maxVal = Math.max(...weeklyData.map((w) => w.completed), 1);
            const barHeight = (d.completed / maxVal) * 80;
            return (
              <View key={d.date} style={styles.barCol}>
                <Text
                  style={[styles.barValue, { color: theme.textMuted }]}
                >
                  {d.completed}
                </Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(barHeight, 4),
                      backgroundColor: d.completed > 0 ? theme.accent : theme.btnSecondaryBg,
                    },
                  ]}
                />
                <Text style={[styles.barLabel, { color: theme.textMuted }]}>
                  {d.day.slice(0, 1)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Habits
        </Text>
        <View style={styles.habitSelector}>
          <TouchableOpacity
            onPress={() => setSelectedHabitId(null)}
            style={[
              styles.habitChip,
              {
                backgroundColor: !selectedHabitId ? theme.accent : theme.btnSecondaryBg,
                borderColor: !selectedHabitId ? theme.accent : theme.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: !selectedHabitId ? "#fff" : theme.textMuted },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {habits.map((h) => (
            <TouchableOpacity
              key={h.id}
              onPress={() => setSelectedHabitId(h.id)}
              style={[
                styles.habitChip,
                {
                  backgroundColor:
                    selectedHabitId === h.id ? h.color : theme.btnSecondaryBg,
                  borderColor:
                    selectedHabitId === h.id ? h.color : theme.cardBorder,
                },
              ]}
            >
              <Ionicons
                name={h.icon as any}
                size={14}
                color={selectedHabitId === h.id ? "#fff" : h.color}
              />
              <Text
                style={[
                  styles.chipText,
                  {
                    color:
                      selectedHabitId === h.id ? "#fff" : theme.text,
                  },
                ]}
              >
                {h.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedHabit && habitStats ? (
          <>
            <View style={styles.habitStatsRow}>
              <View style={styles.habitStat}>
                <Text style={[styles.habitStatValue, { color: theme.text }]}>
                  {(habitStats.completionRate * 100).toFixed(0)}%
                </Text>
                <Text style={[styles.habitStatLabel, { color: theme.textMuted }]}>
                  30-day rate
                </Text>
              </View>
              <View style={styles.habitStat}>
                <Text style={[styles.habitStatValue, { color: theme.text }]}>
                  {habitStats.totalCheckIns}
                </Text>
                <Text style={[styles.habitStatLabel, { color: theme.textMuted }]}>
                  Total check-ins
                </Text>
              </View>
              <View style={styles.habitStat}>
                <Text style={[styles.habitStatValue, { color: theme.text }]}>
                  {habitStats.longestStreak}
                </Text>
                <Text style={[styles.habitStatLabel, { color: theme.textMuted }]}>
                  Best streak
                </Text>
              </View>
            </View>

            {isPremium && trendData.length > 0 && (
              <View style={styles.trendSection}>
                <Text style={[styles.trendLabel, { color: theme.textMuted }]}>
                  8-week trend
                </Text>
                <TrendChart data={trendData} />
              </View>
            )}

            {isPremium && predictedStreak > 0 && (
              <View style={[styles.predictionCard, { backgroundColor: `${theme.accent}10` }]}>
                <Ionicons name="trending-up" size={18} color={theme.accent} />
                <Text style={[styles.predictionText, { color: theme.accent }]}>
                  Predicted streak: {predictedStreak} days
                </Text>
              </View>
            )}

            <View style={styles.heatmapSection}>
              <Text style={[styles.heatmapLabel, { color: theme.textMuted }]}>
                12-week heatmap
              </Text>
              <Heatmap
                data={heatmapData}
                color={selectedHabit.color}
              />
            </View>
          </>
        ) : (
          <Text style={[styles.selectHint, { color: theme.textMuted }]}>
            Select a habit to see its heatmap and detailed stats
          </Text>
        )}
      </View>

      {!isPremium && (
        <TouchableOpacity
          style={[styles.premiumCard, { backgroundColor: theme.card, borderColor: theme.accent }]}
          onPress={() => Alert.alert("Premium Feature", "Upgrade to access trends, predictions & CSV export.")}
          activeOpacity={0.7}
        >
          <Ionicons name="diamond-outline" size={20} color={theme.accent} />
          <Text style={[styles.premiumText, { color: theme.accent }]}>
            Upgrade for advanced analytics
          </Text>
        </TouchableOpacity>
      )}

      {isPremium && (
        <TouchableOpacity
          style={[styles.exportBtn, { backgroundColor: theme.accent }]}
          onPress={handleExportCSV}
          activeOpacity={0.7}
        >
          <Ionicons name="download-outline" size={18} color="#fff" />
          <Text style={styles.exportText}>Export CSV</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  levelCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  levelInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  levelBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  levelNumber: { fontSize: 22, fontWeight: "900" },
  levelDetails: { flex: 1, gap: 2 },
  levelTitle: { fontSize: 18, fontWeight: "700" },
  levelXp: { fontSize: 13 },
  xpBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 4,
  },
  xpBarFill: { height: "100%", borderRadius: 3 },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  badgeItem: {
    alignItems: "center",
    gap: 4,
    width: 64,
  },
  badgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeName: { fontSize: 9, fontWeight: "500", textAlign: "center" },
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 20 },
  aggRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  weeklyBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 110,
  },
  barCol: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  barValue: { fontSize: 11, fontWeight: "600" },
  bar: {
    width: 20,
    borderRadius: 6,
  },
  barLabel: { fontSize: 11, fontWeight: "600" },
  habitSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  habitChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: "600" },
  habitStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  habitStat: { alignItems: "center", gap: 2 },
  habitStatValue: { fontSize: 20, fontWeight: "800" },
  habitStatLabel: { fontSize: 11, fontWeight: "500" },
  trendSection: { gap: 8, marginBottom: 16 },
  trendLabel: { fontSize: 13, fontWeight: "600" },
  predictionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  predictionText: { fontSize: 14, fontWeight: "700" },
  heatmapSection: {
    gap: 8,
  },
  heatmapLabel: { fontSize: 13, fontWeight: "600" },
  selectHint: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
  premiumCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  premiumText: { fontSize: 15, fontWeight: "700" },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  exportText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
