import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../store/useStore";
import { useTheme } from "../theme";

interface HabitPickerProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onClose: () => void;
}

export const HabitPicker = ({ selectedId, onSelect, onClose }: HabitPickerProps) => {
  const habits = useStore((s) => s.habits.filter((h) => !h.archived));
  const theme = useTheme(useStore((s) => s.theme));

  return (
    <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
      <View style={[styles.sheet, { backgroundColor: theme.card }]}>
        <View style={styles.handle} />
        <Text style={[styles.title, { color: theme.text }]}>
          What are you focusing on?
        </Text>

        <TouchableOpacity
          onPress={() => {
            onSelect(null);
            onClose();
          }}
          style={[
            styles.option,
            {
              backgroundColor: selectedId === null ? theme.accent : theme.btnSecondaryBg,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Ionicons name="apps-outline" size={22} color={selectedId === null ? "#fff" : theme.textMuted} />
          <Text
            style={[
              styles.optionText,
              { color: selectedId === null ? "#fff" : theme.text },
            ]}
          >
            No habit (just focus)
          </Text>
        </TouchableOpacity>

        <FlatList
          data={habits}
          keyExtractor={(h) => h.id}
          renderItem={({ item }) => {
            const active = selectedId === item.id;
            return (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item.id);
                  onClose();
                }}
                style={[
                  styles.option,
                  {
                    backgroundColor: active ? item.color : theme.btnSecondaryBg,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Ionicons name={item.icon as any} size={22} color={active ? "#fff" : item.color} />
                <Text
                  style={[
                    styles.optionText,
                    { color: active ? "#fff" : theme.text },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 100,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#555",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
