import { findAll } from "@/services/requests/findAll";
import { filterByRadius } from "@/utils/filterByRadius";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function EventMapScreen() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permissão de localização negada.");
          setLoading(false);
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        const latitude = coords.latitude;
        const longitude = coords.longitude;

        // Pega todos os museus próximos
        const data = await findAll();
        const nearbySpaces = filterByRadius(latitude, longitude, data, 100);

        // Constrói array JS para passar pro Leaflet
        const spacesJS = nearbySpaces
          .map(
            (s) =>
              `{ id: ${s.id}, name: "${s.name}", lat: ${parseFloat(
                s.location.latitude
              )}, lon: ${parseFloat(s.location.longitude)} }`
          )
          .join(",");

        // HTML do Leaflet
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
            <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
            <style>
              html, body, #map { height: 100%; margin: 0; padding: 0; }
            </style>
          </head>
          <body>
            <div id="map"></div>
            <script>
              const map = L.map('map').setView([${latitude}, ${longitude}], 13);

              // OpenStreetMap Tiles
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
              }).addTo(map);

              // Marcador do usuário
              L.marker([${latitude}, ${longitude}], {
                radius: 10,
                color: "#9C4BED",
                fillColor: "#9C4BED",
                fillOpacity: 1
              }).addTo(map).bindPopup("Você está aqui").openPopup();

              // Marcadores de museus
              const spaces = [${spacesJS}];
              spaces.forEach(space => {
                L.marker([space.lat, space.lon], { title: space.name }).addTo(map)
                  .bindPopup(space.name);
              });
            </script>
          </body>
          </html>
        `;

        setHtmlContent(html);
      } catch (err) {
        console.error("Erro ao gerar mapa:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !htmlContent) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#9C4BED" />
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      style={{ flex: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
});
