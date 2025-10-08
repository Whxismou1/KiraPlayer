"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLists } from "../context/ListsContext"
import ListAnimeCard from "../components/ListAnimeCard"
import { colors, spacing } from "../theme/colors"

export default function ListsScreen({ navigation }) {
  const { lists, moveToList, removeFromList } = useLists()
  const [activeTab, setActiveTab] = useState("viendo")

  const tabs = [
    { key: "viendo", label: "Viendo", count: lists.viendo.length },
    { key: "pendiente", label: "Pendiente", count: lists.pendiente.length },
    { key: "completado", label: "Completado", count: lists.completado.length },
  ]

  const currentList = lists[activeTab]

  const renderAnimeItem = ({ item }) => (
    <ListAnimeCard
      anime={item}
      currentList={activeTab}
      onPress={() => navigation.navigate("Info", { anime: item })}
      onMove={moveToList}
      onRemove={removeFromList}
    />
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Listas</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
            <View style={[styles.badge, activeTab === tab.key && styles.badgeActive]}>
              <Text style={[styles.badgeText, activeTab === tab.key && styles.badgeTextActive]}>{tab.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={currentList}
        renderItem={renderAnimeItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay animes en esta lista</Text>
            <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.navigate("Search")}>
              <Text style={styles.exploreButtonText}>Explorar animes</Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  badgeActive: {
    backgroundColor: colors.primaryDark,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  badgeTextActive: {
    color: colors.text,
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: spacing.md,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
})
