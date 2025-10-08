import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, borderRadius } from "../theme/colors";

export default function AnimeCard({ anime, onPress }) {


  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{  uri: anime.cover  }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {anime.title}
        </Text>

        <View style={styles.footer}>
          {anime.status && (
            <View
              style={[
                styles.badge,
                anime.status === "emision"
                  ? styles.badgeEmision
                  : styles.badgeFinalizado,
              ]}
            >
              <Text style={styles.badgeText}>
                {anime.status === "emision" ? "En emisión" : "Finalizado"}
              </Text>
            </View>
          )}

          <View style={styles.ratingContainer}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.ratingText}>
              {anime.rating ? anime.rating : "—"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const CARD_WIDTH = 170;
const CARD_HEIGHT = 280;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginBottom: spacing.md,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  image: {
    width: "100%",
    height: 190,
    backgroundColor: colors.surfaceLight,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
    flexShrink: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeEmision: {
    backgroundColor: colors.emision + "20",
  },
  badgeFinalizado: {
    backgroundColor: colors.finalizado + "20",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 12,
    color: "#FFD700",
    marginRight: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
});
