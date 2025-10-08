import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useLists } from "../context/ListsContext";
import VideoPlayer from "../components/VideoPlayer";
import ListPicker from "../components/ListPicker";
import { colors, spacing, borderRadius } from "../theme/colors";
import { getLinks, getAnimeInfo } from "../api/animeApi";

export default function InfoScreen({ navigation, route }) {
  const { anime } = route.params;
  const { user } = useAuth();
  const { addToList, isInList } = useLists();

  const [animeInfo, setAnimeInfo] = useState(anime || {});
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEpisode, setLoadingEpisode] = useState(false);
  const [showListPicker, setShowListPicker] = useState(false);

  useEffect(() => {
    loadAnimeInfo();
  }, []);

  const loadAnimeInfo = async () => {

    let cleanId = anime.id;
    if (cleanId?.startsWith("anime/")) {
      cleanId = cleanId.replace("anime/", "");
    }
    try {
      setLoading(true);
      const infoAnime = await getAnimeInfo(cleanId);
      const linksData = await getLinks(cleanId, selectedEpisode);
      const links = linksData || [];
      const mainInfo = infoAnime?.[0] || {};
      const extraInfo = infoAnime?.[1] || {};

      const fullData = {
        ...anime,
        id: extraInfo.id || anime.id,
        title: mainInfo.title || anime.title,
        cover: mainInfo.poster || anime.cover,
        description: mainInfo.synopsis || "Sin descripción disponible.",
        status:
          mainInfo.debut?.toLowerCase().includes("emision") ||
          mainInfo.debut?.toLowerCase().includes("emisión")
            ? "emision"
            : "finalizado",
        genres: extraInfo.genres || [],
        episodes: extraInfo.episodes || [],
        sources: links,
      };

      setAnimeInfo(fullData);
      setSources(links);
      if (links.length > 0) setSelectedSource(links[0]);
    } catch (err) {
      console.error("Error cargando info del anime:", err);
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };

  const handleEpisodeSelect = async (epNumber) => {
    if (epNumber === selectedEpisode) return;
    setLoadingEpisode(true);
    setSelectedEpisode(epNumber);
    setSources([]);

    try {
      let cleanId = animeInfo.id;
      if (cleanId?.startsWith("anime/")) {
        cleanId = cleanId.replace("anime/", "");
      }
      const linksData = await getLinks(cleanId, epNumber);
      const links = linksData || [];
      setSources(links);
      if (links.length > 0) setSelectedSource(links[0]);
    } catch (err) {
      console.error("Error cargando links:", err);
    } finally {
      setLoadingEpisode(false);
    }
  };

  const handleAddToList = () => {
    if (!user) {
      Alert.alert(
        "Inicia sesión",
        "Debes iniciar sesión para añadir animes a tus listas",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Iniciar sesión",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
      return;
    }

    setShowListPicker(true);
  };

  const handleSelectList = (listName) => {
    addToList(animeInfo, listName);
  };

  const inList = isInList(animeInfo.id);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {animeInfo.title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: animeInfo.cover }} style={styles.cover} />

        <View style={styles.infoSection}>
          <Text style={styles.title}>{animeInfo.title}</Text>

          <View style={styles.metadata}>
            <View
              style={[
                styles.statusBadge,
                animeInfo.status === "emision"
                  ? styles.statusEmision
                  : styles.statusFinalizado,
              ]}
            >
              <Text style={styles.statusText}>
                {animeInfo.status === "emision" ? "En emisión" : "Finalizado"}
              </Text>
            </View>
            <Text style={styles.year}>⭐ {animeInfo.rating || "—"}</Text>
          </View>

          {animeInfo.genres?.length > 0 && (
            <View style={styles.genres}>
              {animeInfo.genres.map((genre, index) => (
                <View key={index} style={styles.genreChip}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.description}>{animeInfo.description}</Text>

          <TouchableOpacity
            style={[styles.addButton, inList && styles.addButtonDisabled]}
            onPress={handleAddToList}
            disabled={inList}
          >
            <Ionicons
              name={inList ? "checkmark-circle" : "add-circle"}
              size={24}
              color={colors.text}
            />
            <Text style={styles.addButtonText}>
              {inList ? "Ya está en tu lista" : "Añadir a lista"}
            </Text>
          </TouchableOpacity>
        </View>

        {animeInfo.episodes?.length > 0 && (
          <View style={styles.episodesSection}>
            <Text style={styles.sectionTitle}>Episodios</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.episodeList}
            >
              {animeInfo.episodes.map((ep) => (
                <TouchableOpacity
                  key={ep.episode}
                  style={[
                    styles.episodeButton,
                    selectedEpisode === ep.episode &&
                      styles.episodeButtonActive,
                  ]}
                  onPress={() => handleEpisodeSelect(ep.episode)}
                >
                  <Text
                    style={[
                      styles.episodeText,
                      selectedEpisode === ep.episode &&
                        styles.episodeTextActive,
                    ]}
                  >
                    {ep.episode}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.playerSection}>
          <Text style={styles.sectionTitle}>Reproductor</Text>

          {loadingEpisode ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : selectedSource ? (
            <VideoPlayer source={selectedSource} />
          ) : (
            <Text style={{ color: colors.textSecondary }}>
              Selecciona un episodio o servidor
            </Text>
          )}
        </View>

        {/* Servidores */}
        {sources.length > 0 && !loadingEpisode && (
          <View style={styles.serversSection}>
            <Text style={styles.sectionTitle}>Servidores disponibles</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.serversList}
            >
              {sources.map((source, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.serverButton,
                    selectedSource?.server === source.server &&
                      styles.serverButtonActive,
                  ]}
                  onPress={() => setSelectedSource(source)}
                >
                  <View style={styles.serverInfo}>
                    <Ionicons
                      name="server-outline"
                      size={18}
                      color={
                        selectedSource?.server === source.server
                          ? "#fff"
                          : colors.textSecondary
                      }
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.serverText,
                        selectedSource?.server === source.server &&
                          styles.serverTextActive,
                      ]}
                    >
                      {source.title || source.server}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.serverMeta,
                      selectedSource?.server === source.server &&
                        styles.serverMetaActive,
                    ]}
                  >
                    {source.ads ? "⚠️ Con anuncios" : "✅ Sin anuncios"} ·{" "}
                    {source.allow_mobile ? "📱 Móvil" : "💻 Solo PC"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <ListPicker
        visible={showListPicker}
        onClose={() => setShowListPicker(false)}
        onSelect={handleSelectList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { padding: spacing.sm, marginRight: spacing.sm },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  headerSpacer: { width: 40 },
  cover: {
    width: "100%",
    height: 300,
    backgroundColor: colors.surfaceLight,
  },
  infoSection: { padding: spacing.lg },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  statusEmision: { backgroundColor: colors.emision + "20" },
  statusFinalizado: { backgroundColor: colors.finalizado + "20" },
  statusText: { fontSize: 12, fontWeight: "600", color: colors.text },
  year: { fontSize: 16, color: colors.textSecondary },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  genreChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  genreText: { fontSize: 12, color: colors.textSecondary },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  addButtonDisabled: { backgroundColor: colors.surface },
  addButtonText: { fontSize: 16, fontWeight: "600", color: colors.text },
  playerSection: { padding: spacing.lg },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  episodesSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  episodeList: { flexDirection: "row", gap: spacing.sm },
  episodeButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  episodeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  episodeText: { color: colors.textSecondary, fontSize: 14 },
  episodeTextActive: { color: "#fff", fontWeight: "600" },
  serversSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  serversList: { flexDirection: "row", gap: spacing.sm },
  serverButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  serverButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  serverInfo: { flexDirection: "row", alignItems: "center" },
  serverText: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
  serverTextActive: { color: "#fff" },
  serverMeta: {
    color: colors.textSecondary,
    fontSize: 11,
    opacity: 0.7,
    marginTop: 4,
  },
  serverMetaActive: { color: "#fff", opacity: 0.9 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 10,
    fontSize: 16,
  },
});
