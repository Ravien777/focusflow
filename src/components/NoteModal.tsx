import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useStore } from "../store/useStore";
import { useTheme } from "../theme";

interface NoteModalProps {
  habitId: string;
  date: string;
  currentNote: string;
  onClose: () => void;
}

export const NoteModal = ({ habitId, date, currentNote, onClose }: NoteModalProps) => {
  const [note, setNote] = useState(currentNote);
  const updateCheckInNote = useStore((s) => s.updateCheckInNote);
  const theme = useTheme(useStore((s) => s.theme));

  const handleSave = () => {
    updateCheckInNote(habitId, date, note);
    onClose();
  };

  return (
    <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
      <View style={[styles.sheet, { backgroundColor: theme.card }]}>
        <View style={styles.handle} />
        <Text style={[styles.title, { color: theme.text }]}>Journal Entry</Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              color: theme.text,
              borderColor: theme.cardBorder,
            },
          ]}
          placeholder="How did it go?"
          placeholderTextColor={theme.textMuted}
          value={note}
          onChangeText={setNote}
          multiline
          autoFocus
          maxLength={500}
        />

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.cancelBtn,
              { backgroundColor: theme.btnSecondaryBg },
            ]}
          >
            <Text style={[styles.cancelText, { color: theme.textMuted }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={styles.saveText}>Save Note</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 200,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
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
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    textAlignVertical: "top",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: { fontSize: 16, fontWeight: "600" },
  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
