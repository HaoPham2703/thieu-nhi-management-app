import { Church, churchesData } from "@/constants/churches";

// Function để lấy nhà thờ theo ID
export const getChurchById = (id: number): Church | undefined => {
  return churchesData.find((church) => church.id === id);
};

// Function để lấy nhà thờ gần nhất theo tọa độ
export const getNearestChurches = (
  lat: number,
  lng: number,
  limit: number = 5
): (Church & { distance: number })[] => {
  const churchesWithDistance = churchesData.map((church) => {
    const distance = calculateDistance(lat, lng, church.lat, church.long);
    return { ...church, distance };
  });

  return churchesWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};

// Tính khoảng cách giữa 2 điểm (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Khoảng cách (km)
}

// Function để format khoảng cách
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(2)}km`;
};

// Function để lấy tất cả nhà thờ
export const getAllChurches = (): Church[] => {
  return churchesData;
};
