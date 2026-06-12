import { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStore } from "../src/store/useStore";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    icon: "checkmark-circle",
    title: "Welcome to FocusFlow",
    subtitle: "Build habits that stick",
    description:
      "Track your daily routines, maintain streaks, and stay focused with the built-in Pomodoro timer.",
  },
  {
    icon: "fitness",
    title: "Track What Matters",
    subtitle: "Every day counts",
    description:
      "Quick check-ins, streak tracking, and progress bars keep you motivated. Schedule habits for specific days of the week.",
  },
  {
    icon: "timer",
    title: "Stay in the Zone",
    subtitle: "Focus & recharge",
    description:
      "Use the Pomodoro timer to stay productive. Get daily reminders so you never miss a check-in.",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const onScroll = useCallback((e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  }, []);

  const finish = () => {
    completeOnboarding();
    router.replace("/");
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const renderItem = ({ item }: { item: (typeof SLIDES)[0] }) => (
    <View style={styles.slide}>
      <View style={styles.iconWrap}>
        <Ionicons name={item.icon as any} size={80} color="#3B82F6" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={finish}
        hitSlop={12}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={false}
        keyExtractor={(_, i) => i.toString()}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex ? "#3B82F6" : "#333",
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {isLastSlide ? (
          <TouchableOpacity
            style={styles.getStartedBtn}
            onPress={finish}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  skipBtn: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
  slide: {
    width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 120,
  },
  iconWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3B82F6",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  getStartedBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
  },
  getStartedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
