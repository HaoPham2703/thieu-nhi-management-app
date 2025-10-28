import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { churchesData } from "@/constants/churches";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Declare window for web
declare const window: any;

const { width, height } = Dimensions.get("window");
const isSmallScreen = width < 375;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<
    Location.PermissionStatus | "pending"
  >("pending");
  const [animatedValues] = useState(
    churchesData.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Animation khi mount
  useEffect(() => {
    Animated.stagger(
      50, // Delay 50ms giữa mỗi item
      animatedValues.map((animValue) =>
        Animated.timing(animValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  // Phân loại nhà thờ theo khu vực
  const churchesByRegion = {
    "Hà Nội": churchesData.filter((church) =>
      church.address.includes("Hà Nội")
    ),
    "TP. Hồ Chí Minh": churchesData.filter(
      (church) =>
        church.address.includes("TP. Hồ Chí Minh") ||
        church.address.includes("HCM")
    ),
    Khác: churchesData.filter(
      (church) =>
        !church.address.includes("Hà Nội") &&
        !church.address.includes("TP. Hồ Chí Minh") &&
        !church.address.includes("HCM")
    ),
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setLocation(userLocation);
      } else {
        // Nếu không có quyền, dùng vị trí Hà Nội làm mặc định
        setLocation({ latitude: 21.0285, longitude: 105.8542 });
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Lỗi", "Không thể lấy vị trí của bạn");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await requestLocationPermission();
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.loadingText}>Đang tải bản đồ...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          ⛪ Nhà thờ gần bạn
        </ThemedText>
        {permissionStatus === "granted" && location && (
          <ThemedText style={styles.locationText}>
            📍 Đã tìm thấy vị trí của bạn
          </ThemedText>
        )}
        {permissionStatus === "denied" && (
          <ThemedText style={styles.warningText}>
            ⚠️ Đang dùng vị trí mặc định
          </ThemedText>
        )}
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <ThemedText style={styles.refreshButtonText}>🔄 Làm mới</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Church List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(churchesByRegion).map(([region, churches]) => (
          <View key={region}>
            {/* Header phân khu vực */}
            <View style={styles.regionHeader}>
              <View style={styles.regionHeaderLine} />
              <ThemedText style={styles.regionHeaderText}>{region}</ThemedText>
              <View style={styles.regionHeaderLine} />
            </View>

            {churches.map((church) => {
              const openMap = () => {
                // Tìm kiếm bằng tên nhà thờ
                const searchQuery = encodeURIComponent(
                  `${church.name}, ${church.address}`
                );
                const googleSearchUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

                // Check platform để mở URL phù hợp
                if (Platform.OS === "web") {
                  window.open(googleSearchUrl, "_blank");
                } else {
                  Linking.openURL(googleSearchUrl);
                }
              };

              const openDirections = () => {
                // Chỉ đường bằng tên và địa chỉ nhà thờ
                const destination = encodeURIComponent(
                  `${church.name}, ${church.address}`
                );
                const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

                // Check platform để mở URL phù hợp
                if (Platform.OS === "web") {
                  window.open(url, "_blank");
                } else {
                  Linking.openURL(url);
                }
              };

              const animatedStyle = {
                opacity: animatedValues[church.id - 1],
                transform: [
                  {
                    translateY: animatedValues[church.id - 1].interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                  {
                    scale: animatedValues[church.id - 1].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              };

              return (
                <Animated.View
                  key={church.id}
                  style={[styles.churchCardContainer, animatedStyle]}
                >
                  <TouchableOpacity style={styles.churchCard} onPress={openMap}>
                    <View style={styles.churchIcon}>
                      <ThemedText style={styles.iconText}>⛪</ThemedText>
                    </View>
                    <View style={styles.churchInfo}>
                      <ThemedText style={styles.churchName}>
                        {church.name}
                      </ThemedText>
                      <ThemedText style={styles.churchAddress}>
                        {church.address}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>

                  {/* Nút điều khiển */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={openMap}
                    >
                      <ThemedText style={styles.actionButtonText}>
                        🗺️
                      </ThemedText>
                      <ThemedText style={styles.actionButtonLabel}>
                        Xem bản đồ
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.actionButtonDirections,
                      ]}
                      onPress={openDirections}
                    >
                      <ThemedText style={styles.actionButtonText}>
                        🧭
                      </ThemedText>
                      <ThemedText style={styles.actionButtonLabel}>
                        Chỉ đường
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  header: {
    padding: isSmallScreen ? 12 : 16,
    paddingTop: 48,
    gap: 8,
    backgroundColor: "rgba(10, 126, 164, 0.05)",
  },
  headerTitle: {
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: "bold",
  },
  locationText: {
    fontSize: isSmallScreen ? 12 : 14,
    opacity: 0.7,
  },
  warningText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: "#ff6b6b",
  },
  refreshButton: {
    alignSelf: "flex-start",
    backgroundColor: "#0a7ea4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: isSmallScreen ? 12 : 16,
  },
  regionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginBottom: 16,
  },
  regionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(10, 126, 164, 0.3)",
  },
  regionHeaderText: {
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#0a7ea4",
  },
  churchCardContainer: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(10, 126, 164, 0.15)",
  },
  churchCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: isSmallScreen ? 16 : 18,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 2.5,
    borderColor: "#0a7ea4",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  churchIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0a7ea4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  iconText: {
    fontSize: 24,
  },
  churchInfo: {
    flex: 1,
    paddingLeft: 4,
  },
  churchName: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    color: "#0a7ea4",
    letterSpacing: 0.2,
  },
  churchAddress: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#0a7ea4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 32,
    marginBottom: 6,
  },
  actionButtonLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  actionButtonDirections: {
    backgroundColor: "#2ecc71",
    // Thêm border cho nút chỉ đường
    borderWidth: 2,
    borderColor: "#27ae60",
  },
});
