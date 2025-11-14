import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { scale, verticalScale } from 'react-native-size-matters';

import { findAll } from '../services/requests/findAll';
import { SpaceType } from '../types/Space';

const MuseumListScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState<SpaceType[]>([]);
  const [filtered, setFiltered] = useState<SpaceType[]>([]);
  const [query, setQuery] = useState('');

  const [userCity, setUserCity] = useState<string | null>(null);
  const [userState, setUserState] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<'city' | 'state' | 'all'>('all');

  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const queryRef = useRef<NodeJS.Timeout | null>(null);

  // Busca dados e localização
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setLoading(true);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Não foi possível acessar sua localização.');
          return;
        }

        const userLoc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = userLoc.coords;

        // Busca cidade e estado
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              "User-Agent": "seuapp/1.0 (seuemail@exemplo.com)",
              "Accept": "application/json"
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const dataLoc = await response.json();
        const cidade = dataLoc.address.city || dataLoc.address.town || dataLoc.address.village;
        const estado = dataLoc.address.state;

        setUserCity(cidade);
        setUserState(estado);

        // Busca museus
        const data = await findAll();
        setSpaces(data);
        setFiltered(data);

        // Extrai todas as tags únicas
        const tags = Array.from(
          new Set(
            data.flatMap((s) => s.terms?.tag || [])
          )
        );
        setTagOptions(tags);
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível carregar os museus.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  // Aplica filtros
  const applyFilters = () => {
    let list = [...spaces];

    // Filtro de busca
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.type?.name?.toLowerCase().includes(q)
      );
    }

    // Filtro de região
    if (selectedRegion === 'city' && userCity) {
      list = list.filter(
        (s) => s.En_Municipio?.toLowerCase() === userCity.toLowerCase()
      );
    } else if (selectedRegion === 'state' && userState) {
      list = list.filter(
        (s) => s.En_Estado?.toLowerCase() === userState.toLowerCase()
      );
    }

    // Filtro de tag
    if (selectedTag !== 'all') {
      list = list.filter((s) => s.terms?.tag?.includes(selectedTag));
    }

    setFiltered(list);
  };

  // Atualiza resultados dinamicamente
  useEffect(() => {
    if (queryRef.current) clearTimeout(queryRef.current);
    queryRef.current = setTimeout(() => applyFilters(), 300);
    return () => {
      if (queryRef.current) clearTimeout(queryRef.current);
    };
  }, [query, selectedRegion, selectedTag, spaces]);

  const handleGoToMuseum = (id: number) => {
    router.push({
      pathname: "/museumdetail",
      params: { id },
    });
  };

  const renderItem = ({ item }: { item: SpaceType }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: Colors[theme].backgroundCard,
          borderColor: Colors[theme].tertiaryDark
        }
      ]}
    >
      <View style={{ flexDirection: 'row' }}>
        {item.files?.avatar ? (
          <Image
            source={{ uri: item.files.avatar.url }}
            style={[styles.cardImage, { borderColor: Colors[theme].tertiaryDark, borderWidth: scale(1) }]}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Text style={{ color: Colors[theme].text }}>Sem imagem</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: theme == 'light' ? Colors.light.tertiaryDark : Colors.dark.tertiaryLight }]}>
            {item.name}
          </Text>

          {/* Exibe tags */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: scale(6) }}>
            {item.terms?.tag?.slice(0, 3).map((tag) => (
              <Text key={tag} style={styles.tagBadge}>{tag}</Text>
            ))}
          </View>

          <Text style={{ color: Colors[theme].text }} >{`${item.En_Municipio} - ${item.En_Estado}`}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <LinearGradient colors={Colors[theme].gradientPrimary} style={styles.actionButton}>
          <TouchableOpacity
            style={{ paddingHorizontal: verticalScale(12) }}
            onPress={() => handleGoToMuseum(item.id)}
          >
            <Text style={styles.actionButtonText}>SAIBA MAIS +</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );

  const keyExtractor = useMemo(() => (item: SpaceType) => String(item.id), []);

  return (
    <View style={[styles.screen, { backgroundColor: Colors[theme].background }]}>
      {/* Campo de pesquisa */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Pesquisar"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          style={[styles.searchInput, { backgroundColor: Colors[theme].backgroundCard, borderColor: Colors[theme].tertiaryDark, color: Colors[theme].tertiaryDark }]}
        />
      </View>

      {/* Filtros de Cidade-Estado-Todos */}
      <View style={styles.filterBar}>
          {/* Cidade */}
          {userCity && (
            <TouchableOpacity
              style={[
                styles.filterButton,
                styles.cityButton,
                { borderColor: Colors[theme].tertiaryDark },
                selectedRegion === 'city' && { backgroundColor: Colors[theme].tertiaryDark },
                selectedRegion !== 'city' && { backgroundColor: Colors[theme].tertiary }
              ]}
              onPress={() => setSelectedRegion('city')}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: Colors[theme].text }
                ]}
              >
                Cidade
              </Text>
            </TouchableOpacity>
          )}

          {/* Estado */}
          {userState && (
            <TouchableOpacity
              style={[
                styles.filterButton,
                { borderColor: Colors[theme].tertiaryDark },
                selectedRegion === 'state' && { backgroundColor: Colors[theme].tertiaryDark },
                selectedRegion !== 'state' && { backgroundColor: Colors[theme].tertiary }
              ]}
              onPress={() => setSelectedRegion('state')}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: Colors[theme].text }
                ]}
              >
                Estado
              </Text>
            </TouchableOpacity>
          )}

          {/* Todos */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              styles.allButton,
              { borderColor: Colors[theme].tertiaryDark },
              selectedRegion === 'all' && { backgroundColor: Colors[theme].tertiaryDark },
              selectedRegion !== 'all' && { backgroundColor: Colors[theme].tertiary }
            ]}
            onPress={() => setSelectedRegion('all')}
          >
            <Text
              style={[
                styles.filterText,
                { color: Colors[theme].text }
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
          
          {/* Picker de Tags */}
          <View
            style={[
              styles.tagSelectContainer,
              {
                borderColor: Colors[theme].tertiaryDark,
                backgroundColor: Colors[theme].backgroundCard,
              },
            ]}
          >
            <Dropdown
              style={{
                backgroundColor: Colors[theme].backgroundCard,
                borderWidth: 1,
                borderColor: Colors[theme].tertiaryDark,
                borderRadius: scale(8),
                paddingHorizontal: scale(10),
                height: verticalScale(40),
              }}
              placeholder="Selecione uma tag"
              placeholderStyle={{ color: Colors[theme].text }}
              selectedTextStyle={{ color: Colors[theme].text }}
              data={[
                { label: 'Nenhuma tag', value: 'all' },
                ...tagOptions.map(t => ({ label: t, value: t })),
              ]}
              labelField="label"
              valueField="value"
              value={selectedTag}
              containerStyle={{
                borderWidth: 1,
                borderColor: Colors[theme].tertiaryDark, 
                backgroundColor: Colors[theme].backgroundCard,
                outlineColor:Colors[theme].tertiaryDark,
                marginTop: scale(-8)
              }}              
              onChange={item => setSelectedTag(item.value)}
              dropdownPosition="bottom"
              maxHeight={verticalScale(200)}
              activeColor={Colors[theme].tertiaryDark}
              itemContainerStyle={{ backgroundColor: Colors[theme].backgroundCard }}
              itemTextStyle={{ color: Colors[theme].text }}
            />
          </View>


      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#99C9FF" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: verticalScale(120) }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MuseumListScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  searchBar: {
    padding: scale(12),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8)
  },

  searchInput: {
    flex: 1,
    height: verticalScale(44),
    borderRadius: scale(10),
    paddingHorizontal: scale(12),
    borderWidth: scale(1),
    borderColor: '#ccc'
  },

  filterBar: {
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0
  },

  filterButton: {
    padding: scale(4),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    gap: 0,
    height: verticalScale(40)
  },

  cityButton: {
    borderTopStartRadius: scale(10),
    borderBottomStartRadius: scale(10),
  },

  allButton: {
    borderTopEndRadius: scale(10),
    borderBottomEndRadius: scale(10),
    marginRight: scale(10)
  },

  filterText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: scale(12)
  },

  tagSelectContainer: {
    borderRadius: scale(8),
    flex: 1
  },
  
  selectInput: {
    fontSize: scale(14),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12)
  },

  card: {
    marginHorizontal: scale(12),
    marginVertical: verticalScale(10),
    borderRadius: scale(10),
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    overflow: 'hidden',
    borderWidth: scale(1)
  },

  cardImage: {
    margin: scale(20),
    width: scale(120),
    height: verticalScale(120),
    borderRadius: scale(6),
    justifyContent: 'center',
    alignItems: 'center'
  },

  cardImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  cardContent: {
    flex: 1,
    padding: scale(12)
  },

  cardTitle: {
    fontSize: scale(16),
    fontWeight: '600'
  },

  tagBadge: {
    backgroundColor: 'rgba(156, 75, 237, 0.15)',
    color: '#9C4BED',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: scale(20),
    fontSize: scale(11),
    marginRight: scale(6),
    marginBottom: scale(6)
  },

  cardFooter: {
    flex: 1,
    width: '100%'
  },

  actionButton: {
    height: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center'
  },

  actionButtonText: {
    color: '#fff',
    fontWeight: '700'
  },

  
});
