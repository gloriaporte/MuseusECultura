import { findAll } from "@/services/requests/findAll";
import { filterByRadius } from "@/utils/filterByRadius";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";

export default function EventMapScreen() {
  const [region, setRegion] = useState<any>(null);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<any>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  const RADIUS_KM = 100;
  const OPENROUTE_API_KEY =
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFjM2I4NjkxYmM3ZTRmZDhiNGNhNTA3N2I0OGQ1MzJmIiwiaCI6Im11cm11cjY0In0=";

  useEffect(() => {
    let subscriber: Location.LocationSubscription;
    let mounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!mounted) return;
        if (status !== "granted") {
          alert("Permissão de localização negada.");
          if (mounted) setLoading(false);
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        if (!mounted) return;

        setRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });

        try {
          const data = await findAll();
          const nearbySpaces = filterByRadius(coords.latitude, coords.longitude, data, RADIUS_KM);
          if (mounted) setSpaces(nearbySpaces);
        } catch (err) {
          console.error("Erro findAll/filterByRadius:", err);
        }

        subscriber = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 5 },
          (loc) => {
            if (mounted) {
              setRegion((prev) => ({
                ...prev,
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              }));
            }
          }
        );
      } catch (err) {
        console.error("Erro no useEffect principal:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      subscriber?.remove();
    };
  }, []);

  // Atualiza rota quando o usuário ou espaço selecionado muda
  useEffect(() => {
    const fetchRoute = async () => {
      if (!selectedSpace || !region) return;
      try {
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPENROUTE_API_KEY}&start=${region.longitude},${region.latitude}&end=${selectedSpace.lon},${selectedSpace.lat}`
        );
        const data = await response.json();
        const coords = data.features[0].geometry.coordinates.map(([lon, lat]: [number, number]) => ({
          latitude: lat,
          longitude: lon,
        }));
        setRouteCoords(coords);
      } catch (err) {
        console.error("Erro ao buscar rota:", err);
      }
    };
    fetchRoute();
  }, [selectedSpace, region]);

  if (!region || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#9C4BED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onPress={() => {
          setSelectedSpace(null);
          setRouteCoords([]);
        }}
      >
        {/* OpenStreetMap como fundo */}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />

        {/* Usuário */}
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} pinColor="#9C4BED" title="Você está aqui" />

        {/* Spaces */}
        {spaces.map((space) => {
          if (!space.location?.latitude || !space.location?.longitude) return null;
          const lat = parseFloat(space.location.latitude);
          const lon = parseFloat(space.location.longitude);

          return (
            <Marker
                title={ space.name || 'Sem nome'}
                key={space.id}
                coordinate={{ latitude: lat, longitude: lon }}
                pinColor="#FF6347"
                onPress={() => setSelectedSpace({ lat, lon })}
          />
          );
        })}

        {/* Rota */}
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeColor="#9C4BED" strokeWidth={4} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  callout: { width: 200, padding: 5, minHeight: 50 },
  spaceName: { fontWeight: "bold", fontSize: 16 },
  spaceLink: { fontSize: 14, color: "#1E90FF", marginTop: 4, textDecorationLine: "underline" },
  clickInfo: { fontSize: 12, marginTop: 6, color: "#666" },
});
