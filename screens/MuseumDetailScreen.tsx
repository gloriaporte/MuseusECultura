import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useSpaceDetail } from "@/hooks/useSpaceDetail";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRoute } from "@react-navigation/native";
import { useRouter } from 'expo-router';
import React from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from 'react-native-size-matters';

const MuseumDetailScreen = () => {
  const route = useRoute();
  const { id } = route.params as { id: number };
  const { space, loading } = useSpaceDetail(id);
  const { theme } = useTheme();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#9C4BED" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!space) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Museu não encontrado.</Text>
      </View>
    );
  }

  const imageUrl =
    space.files?.header?.url ||
    space.files?.avatar?.transformations?.avatarBig?.url ||
    space.files?.avatar?.url;

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      {/* Imagem */}
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Nome */}
      <Text style={[styles.title,  { color: theme == 'light' ? Colors.light.tertiaryDark : Colors.dark.tertiaryLight }]}>{space.name}</Text>

      {/* Descrição */}
      <View style={styles.content}>
        <Text style={[styles.description, {color: Colors[theme].text}]}>
          {space.longDescription ||
            space.shortDescription ||
            "Descrição não disponível."}
        </Text>

        {/* Palavras-chave */}
        {space.terms?.tag.length > 0 && (
          <Text style={styles.tags}>
            <Text style={styles.bold}>Palavras-chave: </Text>
            {space.terms.tag.join(", ")}
          </Text>
        )}

        {/* Endereço */}
        {space.En_Nome_Logradouro && (
          <View style={styles.row}>
            <FontAwesome name="map-marker" size={24} color={Colors[theme].tertiary } />
            <View style={{ flex: 1 }}>
              <Text style={[styles.address, { color: Colors[theme].text }]}>
                {space.En_Nome_Logradouro}, {space.En_Num}{" "}
                {space.En_Complemento ? `- ${space.En_Complemento}` : ""}
              </Text>
              <Text style={styles.addressSub}>
                {space.En_Bairro} - {space.En_Municipio}/{space.En_Estado}
              </Text>
              {space.location?.latitude && (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `https://www.google.com/maps?q=${space.location.latitude},${space.location.longitude}`
                    )
                  }
                >
                  <Text style={styles.link}>Ver no Google Maps</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Site oficial */}
        {space.singleUrl && (
          <TouchableOpacity
            style={[styles.row, { marginTop: 10 }]}
            onPress={() => Linking.openURL(space.singleUrl!)}
          >
            <View style={{ flexDirection: 'row', marginTop: verticalScale(8) }}>
              <FontAwesome name="globe" size={20} color={Colors[theme].tertiary } />
              <Text style={[styles.textSmall, { color: Colors[theme].text }]}>Site</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Horário */}
        <View>
          {space.horario && (
            <View style={styles.row}>
            <FontAwesome name="clock-o" size={20} color={Colors[theme].tertiary } />
            <Text style={[styles.textSmall, { color: Colors[theme].text }]}>Horário: {space.horario}</Text>
            </View>
          )}

          {/* Acessibilidade */}
          {space.acessibilidade && (
            <View style={{ flexDirection: 'row', marginTop: verticalScale(8) }}>
              <FontAwesome name="wheelchair" size={20} color={Colors[theme].tertiary } />
              <Text style={[styles.textSmall, { color: Colors[theme].text }]}>Acessibilidade: {space.acessibilidade}</Text>
            </View>
          )}

          {/* Telefone */}
          {space.telefonePublico && (
            <View style={{ flexDirection: 'row', marginTop: verticalScale(8) }}>
              <FontAwesome name="phone" size={20} color={Colors[theme].tertiary } />
              <Text style={[styles.textSmall, { color: Colors[theme].text }]}> {space.telefonePublico}</Text>
            </View>
          )}
        </View>

        {/* Botões */}
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Calendário</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/dir/?api=1&destination=${space.location?.latitude},${space.location?.longitude}`
              )
            }
          >
            <Text style={styles.buttonText}>Ver no mapa</Text>
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={24} color={Colors[theme].tertiary} />
          <Text style={[styles.backText, { color: Colors[theme].tertiary }]}> Voltar</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

export default MuseumDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#fff",
    marginTop: verticalScale(10),
    fontSize: 16,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  imageContainer: {
    flex: 1,
    width: '100%'
  },
  image: {
    width: "100%",
    height: scale(150)
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  description: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 20,
  },
  tags: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 13,
  },
  bold: {
    color: "#fff",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    gap: 6,
  },
  address: {
    color: "#ddd",
    fontSize: 13,
  },
  addressSub: {
    color: "#999",
    fontSize: 13,
  },
  link: {
    color: "#9C4BED",
    textDecorationLine: "underline",
    marginTop: 2,
    fontSize: 13,
  },
  textSmall: {
    color: "#bbb",
    fontSize: 13,
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#9C4BED",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: 'absolute',
    bottom: scale(-100),
    left: scale(20)
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
  }
  
});
