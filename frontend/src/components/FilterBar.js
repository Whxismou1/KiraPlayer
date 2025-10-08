import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "../theme/colors";

export default function FilterBar({
  onSearch,
  onFilterChange,
  selectedStatus,
  selectedRating,
}) {
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const statuses = ["emision", "finalizado"];
  const ratings = [9, 8, 7, 6, 5];

  const handleSearch = (text) => {
    setSearchText(text);
    onSearch(text);
  };

  const toggleStatus = (status) => {
    const newStatus = selectedStatus === status ? null : status;
    onFilterChange({ status: newStatus });
  };

  const toggleRating = (rating) => {
    const newRating = selectedRating === rating ? null : rating;
    onFilterChange({ rating: newRating });
  };

  const clearFilters = () => {
    setSearchText("");
    onSearch("");
    onFilterChange({ status: null, rating: null });
  };

  const hasActiveFilters = selectedStatus || selectedRating || searchText;

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Buscar anime..."
          placeholderTextColor={colors.textTertiary}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ⚙️ Toggle Filtros */}
      <View style={styles.filterHeader}>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color={colors.text} />
          <Text style={styles.filterToggleText}>Filtros</Text>
          <Ionicons
            name={showFilters ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>

        {hasActiveFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearButton}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 🎛 Panel de Filtros */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Estado */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Estado</Text>
            <View style={styles.chipRow}>
              {statuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.chip,
                    selectedStatus === status && styles.chipActive,
                  ]}
                  onPress={() => toggleStatus(status)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedStatus === status && styles.chipTextActive,
                    ]}
                  >
                    {status === "emision" ? "En emisión" : "Finalizado"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Rating mínimo</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
            >
              {ratings.map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.chip,
                    selectedRating === rating && styles.chipActive,
                  ]}
                  onPress={() => toggleRating(rating)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedRating === rating && styles.chipTextActive,
                    ]}
                  >
                    {rating}+
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  filterToggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  clearButton: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  filtersContainer: {
    marginTop: spacing.lg,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chipScroll: { flexDirection: "row" },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.text,
    fontWeight: "600",
  },
});
