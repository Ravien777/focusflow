import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStore } from "../../src/store/useStore";
import { useTheme, ThemeKey } from "../../src/theme";
import {
  scheduleDailyReminder,
  cancelAllReminders,
} from "../../src/utils/notifications";
import { signOut } from "../../src/services/auth";
import { ACCENT_OPTIONS, FONT_SCALES, FONT_SCALE_LABELS } from "../../src/constants/accents";
import { isFeatureUnlocked } from "../../src/utils/subscription";

const THEME_OPTIONS: { key: ThemeKey; label: string; icon: string }[] = [
  { key: "system", label: "System", icon: "phone-portrait-outline" },
  { key: "dark", label: "Dark", icon: "moon-outline" },
  { key: "light", label: "Light", icon: "sunny-outline" },
];

export default function SettingsScreen() {
  const {
    habits,
    reminderSettings,
    updateReminderTime,
    toggleReminder,
    setTheme,
    theme: themeKey,
    focusMinutes,
    breakMinutes,
    setFocusMinutes,
    setBreakMinutes,
    unarchiveHabit,
    deleteHabitPermanently,
    user,
    isPremium,
    setUser,
    setPremium,
    accentColor,
    fontScale,
    setAccentColor,
    setFontScale,
  } = useStore();
  const theme = useTheme(themeKey);
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const archivedHabits = habits.filter((h) => h.archived);

  const handleTimeChange = (
    type: "hour" | "minute",
    direction: "up" | "down",
  ) => {
    let newHour = reminderSettings.hour;
    let newMinute = reminderSettings.minute;

    if (type === "hour") {
      newHour =
        direction === "up" ? (newHour + 1) % 24 : (newHour - 1 + 24) % 24;
    } else {
      newMinute =
        direction === "up"
          ? (newMinute + 15) % 60
          : (newMinute - 15 + 60) % 60;
    }
    updateReminderTime(newHour, newMinute);
  };

  const handleScheduleReminder = async () => {
    setIsUpdating(true);
    if (reminderSettings.enabled) {
      await scheduleDailyReminder(
        reminderSettings.hour,
        reminderSettings.minute,
      );
    } else {
      await cancelAllReminders();
    }
    setIsUpdating(false);
  };

  const handleUnarchive = (id: string, name: string) => {
    unarchiveHabit(id);
    Alert.alert("Restored", `"${name}" is back on your dashboard.`);
  };

  const handlePermanentDelete = (id: string, name: string) => {
    Alert.alert(
      "Delete Forever?",
      `"${name}" and all its data will be permanently deleted. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Are you sure?",
              `This will erase all check-in history for "${name}".`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Yes, Delete",
                  style: "destructive",
                  onPress: () => deleteHabitPermanently(id),
                },
              ],
            );
          },
        },
      ],
    );
  };

  const handleIntervalChange = (
    type: "focus" | "break",
    direction: "up" | "down",
  ) => {
    const step = 5;
    const current = type === "focus" ? focusMinutes : breakMinutes;
    const next =
      direction === "up"
        ? Math.min(current + step, 120)
        : Math.max(current - step, 1);
    if (type === "focus") setFocusMinutes(next);
    else setBreakMinutes(next);
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          setUser(null);
          setPremium(false);
        },
      },
    ]);
  };

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    const displayM = String(m).padStart(2, "0");
    return `${displayH}:${displayM} ${period}`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        ⚙️ Settings
      </Text>

      {user ? (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.accountRow}>
            <View style={[styles.avatar, { backgroundColor: `${theme.accent}20` }]}>
              <Ionicons name="person" size={22} color={theme.accent} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: theme.text }]}>
                {user.displayName}
              </Text>
              <Text style={[styles.accountEmail, { color: theme.textMuted }]}>
                {user.email}
              </Text>
            </View>
            {isPremium && (
              <View style={[styles.premiumBadge, { backgroundColor: `${theme.accent}20` }]}>
                <Ionicons name="diamond" size={14} color={theme.accent} />
                <Text style={[styles.premiumBadgeText, { color: theme.accent }]}>
                  Premium
                </Text>
              </View>
            )}
          </View>
          {!isPremium && (
            <TouchableOpacity
              style={[styles.upgradeBtn, { backgroundColor: theme.accent }]}
              onPress={() => router.push("/(paywall)")}
              activeOpacity={0.7}
            >
              <Ionicons name="diamond-outline" size={16} color="#fff" />
              <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.signOutBtn, { backgroundColor: theme.btnSecondaryBg }]}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text style={[styles.signOutText, { color: theme.danger }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          <Text style={[styles.accountPrompt, { color: theme.textMuted }]}>
            Sign in to sync your habits across devices
          </Text>
          <TouchableOpacity
            style={[styles.signInBtn, { backgroundColor: theme.accent }]}
            onPress={() => router.push("/(auth)")}
            activeOpacity={0.7}
          >
            <Ionicons name="log-in-outline" size={18} color="#fff" />
            <Text style={styles.signInBtnText}>Sign In / Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Theme</Text>
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map((opt) => {
            const active = themeKey === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setTheme(opt.key)}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: active ? theme.accent : theme.btnSecondaryBg,
                    borderColor: active ? theme.accent : theme.cardBorder,
                  },
                ]}
                accessibilityLabel={`${opt.label} theme`}
                accessibilityRole="button"
              >
                <Ionicons
                  name={opt.icon as any}
                  size={20}
                  color={active ? "#fff" : theme.textMuted}
                />
                <Text
                  style={[
                    styles.themeLabel,
                    { color: active ? "#fff" : theme.textMuted },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isPremium ? (
          <>
            <Text style={[styles.subSectionTitle, { color: theme.text }]}>
              Accent Color
            </Text>
            <View style={styles.accentRow}>
              {ACCENT_OPTIONS.map((opt) => {
                const active = accentColor === opt.color;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setAccentColor(opt.color)}
                    style={[
                      styles.accentOption,
                      {
                        backgroundColor: opt.color,
                        borderColor: active ? theme.text : "transparent",
                        borderWidth: active ? 2 : 0,
                      },
                    ]}
                    accessibilityLabel={opt.name}
                    accessibilityRole="button"
                  >
                    {active && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.subSectionTitle, { color: theme.text }]}>
              Font Scale
            </Text>
            <View style={styles.fontRow}>
              {FONT_SCALES.map((scale) => {
                const active = fontScale === scale;
                return (
                  <TouchableOpacity
                    key={scale}
                    onPress={() => setFontScale(scale)}
                    style={[
                      styles.fontOption,
                      {
                        backgroundColor: active ? theme.accent : theme.btnSecondaryBg,
                        borderColor: active ? theme.accent : theme.cardBorder,
                      },
                    ]}
                    accessibilityLabel={FONT_SCALE_LABELS[scale]}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.fontLabel,
                        { color: active ? "#fff" : theme.text },
                      ]}
                    >
                      {FONT_SCALE_LABELS[scale]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.premiumGate, { backgroundColor: `${theme.accent}10` }]}
            onPress={() => router.push("/(paywall)")}
            activeOpacity={0.7}
          >
            <Ionicons name="diamond-outline" size={16} color={theme.accent} />
            <Text style={[styles.premiumGateText, { color: theme.accent }]}>
              Premium — Custom themes & accents
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Timer Intervals
        </Text>
        {isPremium ? (
          <>
            <View style={styles.timeControl}>
              <Text style={[styles.timeLabel, { color: theme.textMuted }]}>
                Focus
              </Text>
              <View style={styles.timeButtons}>
                <TouchableOpacity
                  onPress={() => handleIntervalChange("focus", "down")}
                  style={[styles.timeBtn, { backgroundColor: theme.btnSecondaryBg }]}
                >
                  <Text style={[styles.timeBtnText, { color: theme.text }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.timeValue, { color: theme.text }]}>
                  {focusMinutes}m
                </Text>
                <TouchableOpacity
                  onPress={() => handleIntervalChange("focus", "up")}
                  style={[styles.timeBtn, { backgroundColor: theme.btnSecondaryBg }]}
                >
                  <Text style={[styles.timeBtnText, { color: theme.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.timeControl}>
              <Text style={[styles.timeLabel, { color: theme.textMuted }]}>
                Break
              </Text>
              <View style={styles.timeButtons}>
                <TouchableOpacity
                  onPress={() => handleIntervalChange("break", "down")}
                  style={[styles.timeBtn, { backgroundColor: theme.btnSecondaryBg }]}
                >
                  <Text style={[styles.timeBtnText, { color: theme.text }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.timeValue, { color: theme.text }]}>
                  {breakMinutes}m
                </Text>
                <TouchableOpacity
                  onPress={() => handleIntervalChange("break", "up")}
                  style={[styles.timeBtn, { backgroundColor: theme.btnSecondaryBg }]}
                >
                  <Text style={[styles.timeBtnText, { color: theme.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.premiumGate, { backgroundColor: `${theme.accent}10` }]}
            onPress={() => router.push("/(paywall)")}
            activeOpacity={0.7}
          >
            <Ionicons name="diamond-outline" size={16} color={theme.accent} />
            <Text style={[styles.premiumGateText, { color: theme.accent }]}>
              Premium — Custom intervals (currently 25/5)
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>
            Daily Check-In Reminder
          </Text>
          <Switch
            value={reminderSettings.enabled}
            onValueChange={toggleReminder}
            trackColor={{ false: theme.progressTrack, true: theme.accent }}
            thumbColor={reminderSettings.enabled ? "#fff" : theme.textMuted}
            hitSlop={12}
          />
        </View>

        {reminderSettings.enabled && (
          <>
            <Text style={[styles.subLabel, { color: theme.accent }]}>
              Time: {formatTime(reminderSettings.hour, reminderSettings.minute)}
            </Text>
            <View style={styles.timeControl}>
              <Text style={[styles.timeLabel, { color: theme.textMuted }]}>
                Hour
              </Text>
              <View style={styles.timeButtons}>
                <TouchableOpacity
                  onPress={() => handleTimeChange("hour", "down")}
                  style={[
                    styles.timeBtn,
                    { backgroundColor: theme.btnSecondaryBg },
                  ]}
                >
                  <Text style={[styles.timeBtnText, { color: theme.text }]}>
                    −
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.timeValue, { color: theme.text }]}>
                  {reminderSettings.hour}
                </Text>
                <TouchableOpacity
                  onPress={() => handleTimeChange("hour", "up")}
                  style={[
                    styles.timeBtn,
                    { backgroundColor: theme.btnSecondaryBg },
                  ]}
                >
                  <Text style={[styles.timeBtnText, { color: theme.text }]}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.timeControl}>
              <Text style={[styles.timeLabel, { color: theme.textMuted }]}>
                Minute
              </Text>
              <View style={styles.timeButtons}>
                <TouchableOpacity
                  onPress={() => handleTimeChange("minute", "down")}
                  style={[
                    styles.timeBtn,
                    { backgroundColor: theme.btnSecondaryBg },
                  ]}
                >
                  <Text style={[styles.timeBtnText, { color: theme.text }]}>
                    −
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.timeValue, { color: theme.text }]}>
                  {String(reminderSettings.minute).padStart(2, "0")}
                </Text>
                <TouchableOpacity
                  onPress={() => handleTimeChange("minute", "up")}
                  style={[
                    styles.timeBtn,
                    { backgroundColor: theme.btnSecondaryBg },
                  ]}
                >
                  <Text style={[styles.timeBtnText, { color: theme.text }]}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: theme.accent }]}
              onPress={handleScheduleReminder}
              disabled={isUpdating}
              activeOpacity={0.7}
            >
              <Text style={styles.applyBtnText}>
                {isUpdating ? "Updating..." : "Save Reminder Time"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {archivedHabits.length > 0 && (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Archived Habits ({archivedHabits.length})
          </Text>
          {archivedHabits.map((h) => (
            <View
              key={h.id}
              style={[
                styles.archivedItem,
                { borderBottomColor: theme.cardBorder },
              ]}
            >
              <View style={styles.archivedInfo}>
                <Ionicons
                  name={h.icon as any}
                  size={20}
                  color={h.color}
                />
                <Text style={[styles.archivedName, { color: theme.textMuted }]}>
                  {h.name}
                </Text>
              </View>
              <View style={styles.archivedActions}>
                <TouchableOpacity
                  onPress={() => handleUnarchive(h.id, h.name)}
                  style={[
                    styles.archivedBtn,
                    { backgroundColor: theme.btnSecondaryBg },
                  ]}
                  hitSlop={8}
                >
                  <Ionicons
                    name="refresh-outline"
                    size={16}
                    color={theme.accent}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePermanentDelete(h.id, h.name)}
                  style={[
                    styles.archivedBtn,
                    { backgroundColor: theme.btnSecondaryBg },
                  ]}
                  hitSlop={8}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={theme.danger}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 20 },
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
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  accountInfo: { flex: 1 },
  accountName: { fontSize: 16, fontWeight: "700" },
  accountEmail: { fontSize: 13, marginTop: 2 },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumBadgeText: { fontSize: 11, fontWeight: "700" },
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  upgradeBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  signOutBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  signOutText: { fontSize: 15, fontWeight: "600" },
  accountPrompt: { fontSize: 14, marginBottom: 12 },
  signInBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  signInBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  themeRow: {
    flexDirection: "row",
    gap: 8,
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  accentRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  accentOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  fontRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  fontOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  fontLabel: { fontSize: 13, fontWeight: "600" },
  premiumGate: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  premiumGateText: { fontSize: 14, fontWeight: "600" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 18, fontWeight: "600" },
  subLabel: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  timeControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  timeLabel: { fontSize: 16 },
  timeButtons: { flexDirection: "row", alignItems: "center", gap: 12 },
  timeBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  timeBtnText: { fontSize: 24, fontWeight: "700" },
  timeValue: {
    fontSize: 20,
    fontWeight: "600",
    minWidth: 40,
    textAlign: "center",
  },
  applyBtn: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  applyBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  archivedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  archivedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  archivedName: { fontSize: 16, fontWeight: "500" },
  archivedActions: {
    flexDirection: "row",
    gap: 8,
  },
  archivedBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
