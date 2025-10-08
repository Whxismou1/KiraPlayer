import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, borderRadius } from "../theme/colors"

export default function ListPicker({ visible, onClose, onSelect }) {
  const lists = [
    { key: "viendo", label: "Viendo", icon: "play-circle" },
    { key: "pendiente", label: "Pendiente", icon: "time" },
    { key: "completado", label: "Completado", icon: "checkmark-circle" },
  ]

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Añadir a lista</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            {lists.map((list) => (
              <TouchableOpacity
                key={list.key}
                style={styles.listItem}
                onPress={() => {
                  onSelect(list.key)
                  onClose()
                }}
              >
                <Ionicons name={list.icon} size={24} color={colors.primary} />
                <Text style={styles.listLabel}>{list.label}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  listContainer: {
    padding: spacing.lg,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  listLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
})
