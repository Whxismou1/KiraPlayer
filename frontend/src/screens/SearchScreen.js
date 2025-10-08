import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimeCard from "../components/AnimeCard";
import FilterBar from "../components/FilterBar";
import { colors, spacing } from "../theme/colors";
import { filterAnimes, getAllAnimes, searchAnime } from "../api/animeApi";

export default function SearchScreen({ navigation }) {
  const [animes, setAnimes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🧩 Filtros seleccionados
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  // 🧠 Cargar animes iniciales
  useEffect(() => {
    loadAnimes(1, true);
  }, [searchQuery, selectedGenres, selectedStatus, selectedYear, selectedRating]);

  const loadAnimes = useCallback(
    async (pageToLoad = 1, reset = false) => {
      if (loading) return;
      setLoading(true);

      try {
        let data;

        // 🔍 Si hay búsqueda activa, usa searchAnime
        if (searchQuery) {
          data = await searchAnime(searchQuery);
        } else {
          // 🧩 Si hay filtros activos, llama al endpoint /anime/filter
          const hasFilters =
            selectedGenres.length > 0 ||
            selectedStatus ||
            selectedYear ||
            selectedRating;

          if (hasFilters) {
            const filters = {
              genres: selectedGenres,
              status: selectedStatus,
              year: selectedYear,
              rating: selectedRating,
            };
            data = await filterAnimes(filters);
          } else {
            // 🔹 Sin filtros → carga lista general
            data = await getAllAnimes(pageToLoad);
          }
        }

        const results = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        const mappedResults = results.map((item) => ({
          ...item,
          cover:
            item.cover ||
            item.poster ||
            item.banner ||
            item.image ||
            item.picture ||
            null,
        }));

        setAnimes((prev) =>
          reset ? mappedResults : [...prev, ...mappedResults]
        );
        setHasMore(results.length > 0);
      } catch (error) {
        console.error("❌ Error cargando animes:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [
      searchQuery,
      selectedGenres,
      selectedStatus,
      selectedYear,
      selectedRating,
      loading,
    ]
  );

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadAnimes(nextPage);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadAnimes(1, true);
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setPage(1);
    await loadAnimes(1, true);
  };

  // 🧩 Recibe los cambios de filtros desde FilterBar
  const handleFilterChange = ({ genres, status, year, rating }) => {
    if (genres) setSelectedGenres(genres);
    if (status !== undefined) setSelectedStatus(status);
    if (year !== undefined) setSelectedYear(year);
    if (rating !== undefined) setSelectedRating(rating);
  };

  const renderAnimeItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <AnimeCard
        anime={item}
        onPress={() => navigation.navigate("Info", { anime: item })}
      />
    </View>
  );

  const renderFooter = () =>
    loading && hasMore ? (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={{ marginVertical: 20 }}
      />
    ) : null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
        <Text style={styles.resultCount}>{animes?.length} resultados</Text>
      </View>

      <FilterBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        selectedGenres={selectedGenres}
        selectedStatus={selectedStatus}
        selectedYear={selectedYear}
        selectedRating={selectedRating}
      />

      <FlatList
        data={animes}
        renderItem={renderAnimeItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No se encontraron resultados
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
    marginBottom: spacing.xs,
  },
  resultCount: { fontSize: 14, color: colors.textSecondary },
  listContent: { padding: spacing.lg },
  row: { justifyContent: "space-between" },
  cardWrapper: { width: "48%" },
  emptyContainer: { paddingVertical: spacing.xxl, alignItems: "center" },
  emptyText: { fontSize: 16, color: colors.textSecondary },
});
