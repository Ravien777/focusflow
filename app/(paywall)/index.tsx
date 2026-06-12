import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../src/store/useStore";
import { useTheme } from "../../src/theme";
import {
  configureRevenueCat,
  getOfferings,
  purchasePackage,
  restorePurchases,
  isPremium,
  isRevenueCatConfigured,
} from "../../src/services/purchases";

const FEATURES = [
  { icon: "cloud-upload-outline", name: "Cloud Sync", desc: "Sync across all your devices" },
  { icon: "infinite-outline", name: "Unlimited Habits", desc: "No more 5-habit limit" },
  { icon: "color-palette-outline", name: "Custom Themes", desc: "Accent colors & font sizes" },
  { icon: "trending-up-outline", name: "Advanced Analytics", desc: "Trends, predictions & CSV export" },
  { icon: "document-text-outline", name: "Habit Notes", desc: "Journal entries for every check-in" },
  { icon: "snow-outline", name: "Streak Freeze", desc: "Freeze your streak when life happens" },
  { icon: "timer-outline", name: "Custom Intervals", desc: "Set your own focus & break times" },
];

export default function PaywallScreen() {
  const [offerings, setOfferings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const setPremium = useStore((s) => s.setPremium);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme(useStore((s) => s.theme));

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      await configureRevenueCat();
      const off = await getOfferings();
      setOfferings(off);
    } catch (e) {
      console.warn("RevenueCat init failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: any) => {
    setPurchasing(true);
    try {
      const info = await purchasePackage(pkg);
      if (info && isPremium(info)) {
        setPremium(true);
        router.back();
      }
    } catch (e: any) {
      if (e.code !== "USER_CANCELLED") {
        Alert.alert("Error", "Purchase failed. Please try again.");
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    try {
      const info = await restorePurchases();
      if (info && isPremium(info)) {
        setPremium(true);
        Alert.alert("Restored", "Your purchases have been restored!");
        router.back();
      } else {
        Alert.alert("No Purchases", "No previous purchases found.");
      }
    } catch (e) {
      Alert.alert("Error", "Restore failed. Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  const monthly = offerings?.monthly;
  const yearly = offerings?.annual;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.close}
          hitSlop={12}
        >
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <View style={[styles.iconCircle, { backgroundColor: `${theme.accent}20` }]}>
          <Ionicons name="diamond" size={40} color={theme.accent} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Upgrade to Premium</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Unlock the full FocusFlow experience
        </Text>
      </View>

      <View style={styles.features}>
        {FEATURES.map((f) => (
          <View key={f.name} style={styles.featureRow}>
            <Ionicons name={f.icon as any} size={22} color={theme.accent} />
            <View style={styles.featureText}>
              <Text style={[styles.featureName, { color: theme.text }]}>{f.name}</Text>
              <Text style={[styles.featureDesc, { color: theme.textMuted }]}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.accent} style={{ marginVertical: 24 }} />
      ) : isRevenueCatConfigured() ? (
        <View style={styles.pricing}>
          {yearly && (
            <TouchableOpacity
              style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.accent }]}
              onPress={() => handlePurchase(yearly)}
              disabled={purchasing}
              activeOpacity={0.7}
            >
              <View style={styles.bestBadge}>
                <Text style={styles.bestText}>BEST VALUE</Text>
              </View>
              <Text style={[styles.planPrice, { color: theme.text }]}>
                {yearly.product.priceString}
              </Text>
              <Text style={[styles.planPeriod, { color: theme.textMuted }]}>/ year</Text>
              <Text style={[styles.planTrial, { color: theme.accent }]}>
                3-day free trial
              </Text>
            </TouchableOpacity>
          )}

          {monthly && (
            <TouchableOpacity
              style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              onPress={() => handlePurchase(monthly)}
              disabled={purchasing}
              activeOpacity={0.7}
            >
              <Text style={[styles.planPrice, { color: theme.text }]}>
                {monthly.product.priceString}
              </Text>
              <Text style={[styles.planPeriod, { color: theme.textMuted }]}>/ month</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleRestore}
            disabled={purchasing}
            style={styles.restore}
          >
            <Text style={[styles.restoreText, { color: theme.accent }]}>
              Restore Purchases
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.comingSoonCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Ionicons name="construct-outline" size={32} color={theme.textMuted} />
          <Text style={[styles.comingSoonTitle, { color: theme.text }]}>
            Premium Coming Soon
          </Text>
          <Text style={[styles.comingSoonDesc, { color: theme.textMuted }]}>
            Configure RevenueCat API keys in src/services/purchases.ts to enable in-app purchases.
          </Text>
        </View>
      )}

      {purchasing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16 },
  close: { alignSelf: "flex-end" },
  hero: { alignItems: "center", paddingVertical: 24, gap: 12 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 16 },
  features: { paddingHorizontal: 24, gap: 16, marginBottom: 24 },
  featureRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  featureText: { flex: 1 },
  featureName: { fontSize: 16, fontWeight: "600" },
  featureDesc: { fontSize: 13, marginTop: 2 },
  pricing: { paddingHorizontal: 24, gap: 12 },
  planCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    alignItems: "center",
  },
  bestBadge: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  bestText: { color: "#fff", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  planPrice: { fontSize: 36, fontWeight: "900" },
  planPeriod: { fontSize: 15 },
  planTrial: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  restore: { alignItems: "center", paddingVertical: 16 },
  restoreText: { fontSize: 15, fontWeight: "600" },
  comingSoonCard: {
    alignItems: "center",
    gap: 12,
    padding: 32,
    marginHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  comingSoonTitle: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  comingSoonDesc: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
