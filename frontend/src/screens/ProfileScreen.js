import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useLists } from "../context/ListsContext";
import { borderRadius, colors, spacing } from "../theme/colors";

export default function ProfileScreen({ navigation }) {
  const { user, profile, logout } = useAuth();
  const { getTotalCount, lists } = useLists();

  const handleLogout = () => {
    logout();
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        <View style={styles.notAuthContainer}>
          <Ionicons
            name="person-circle-outline"
            size={80}
            color={colors.textTertiary}
          />
          <Text style={styles.notAuthTitle}>No has iniciado sesión</Text>
          <Text style={styles.notAuthText}>
            Inicia sesión para guardar tus animes favoritos y crear listas
          </Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.text} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{profile[0]?.username}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Estadísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lists.viendo.length}</Text>
              <Text style={styles.statLabel}>Viendo</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lists.pendiente.length}</Text>
              <Text style={styles.statLabel}>Pendiente</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lists.completado.length}</Text>
              <Text style={styles.statLabel}>Completado</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getTotalCount()}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionItem}>
            <Ionicons name="create-outline" size={24} color={colors.text} />
            <Text style={styles.actionText}>Editar perfil</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
            <Text style={[styles.actionText, styles.actionTextDanger]}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Kira v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  content: {
    padding: spacing.lg,
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  notAuthTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  notAuthText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginBottom: spacing.lg,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  actionTextDanger: {
    color: colors.error,
  },
  actionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  appInfoText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});
