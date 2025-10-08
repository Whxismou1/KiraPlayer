"use client"

import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, borderRadius } from "../theme/colors"

export default function ListAnimeCard({ anime, onPress, onMove, onRemove, currentList }) {
  const showActionMenu = () => {
    const actions = []

    // Move options
    if (currentList !== "viendo") {
      actions.push({
        text: "Mover a Viendo",
        onPress: () => onMove(anime.id, currentList, "viendo"),
      })
    }
    if (currentList !== "pendiente") {
      actions.push({
        text: "Mover a Pendiente",
        onPress: () => onMove(anime.id, currentList, "pendiente"),
      })
    }
    if (currentList !== "completado") {
      actions.push({
        text: "Mover a Completado",
        onPress: () => onMove(anime.id, currentList, "completado"),
      })
    }

    // Remove option
    actions.push({
      text: "Eliminar de la lista",
      onPress: () => onRemove(anime.id, currentList),
      style: "destructive",
    })

    actions.push({
      text: "Cancelar",
      style: "cancel",
    })

    Alert.alert("Acciones", "¿Qué deseas hacer?", actions)
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: anime.cover }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {anime.title}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.year}>{anime.year}</Text>
          <TouchableOpacity onPress={showActionMenu} style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  image: {
    width: 100,
    height: 140,
    backgroundColor: colors.surfaceLight,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  year: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  menuButton: {
    padding: spacing.xs,
  },
})
