import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimeCard from "../components/AnimeCard";
import { colors, spacing } from "../theme/colors";
import { useEffect, useState, useCallback } from "react";
import { getLatestAnimes } from "../api/animeApi";

const BASE_IMG_URL = "https://www3.animeflv.net";

export default function HomeScreen({ navigation }) {
  const [latestAnimes, setLatestsAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnimes();
  }, []);

  const loadAnimes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLatestAnimes();
      if (data && Array.isArray(data)) {
        const mapped = data.map((anime) => ({
          id: anime.id,
          title: anime.title,
          cover: `${BASE_IMG_URL}${anime.poster}`,
          rating: anime.rating || "—",
          status:
            anime.debut?.toLowerCase() === "estreno" ? "emision" : "finalizado",
        }));
        setLatestsAnimes(mapped);
      }
    } catch (error) {
      console.error("❌ Error cargando animes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnimes();
  };

  const renderAnimeItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <AnimeCard
        anime={item}
        onPress={() => navigation.navigate("Info", { anime: item })}
      />
    </View>
  );

  // 📍 Si está cargando, mostramos el indicador centrado
  if (loading && !refreshing && latestAnimes.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando animes...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.logo}>Kira</Text>
      </View>

      <FlatList
        data={latestAnimes}
        renderItem={renderAnimeItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimos animes</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Text style={styles.seeAllButton}>Ver todos</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay animes disponibles</Text>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  seeAllButton: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
  },
  row: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    flex: 1,
    margin: spacing.sm / 2,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
