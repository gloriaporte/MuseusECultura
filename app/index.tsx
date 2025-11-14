import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

import IndexVectorRoxo from '@/assets/images/index-vector-roxo.svg';
import Index1 from '@/assets/images/index1.svg';
import Index2 from '@/assets/images/index2.svg';
import Index3 from '@/assets/images/index3.svg';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Explore',
    description:
      'Descubra museus incríveis, exposições e experiências culturais únicas perto de você, transformando sua visita em uma jornada inesquecível.',
    image: Index1,
  },
  {
    id: '2',
    title: 'Experiencie',
    description:
      'Procure museus que contam desde o passado não tão distante, com artes pontilhadas e histórias emocionantes.',
    image: Index2,
  },
  {
    id: '3',
    title: 'Visite',
    description:
      'Roteirize seu passeio de acordo os museus em sua rota, aproveitando da melhor forma o trajeto.',
    image: Index3,
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const theme = Colors.dark;
  const router = useRouter();

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleStart = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('(tabs)');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <View style={{ height: height }}>
        <View style={{ position: 'absolute', top: verticalScale(50), zIndex: 2 }}>
          <FlatList
            ref={flatListRef}
            data={slides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            renderItem={({ item }) => {
              const ImageComponent = item.image;

              return (
                <View style={styles.slide}>
                  <ImageComponent width={340} height={360} />
                  <Text style={[styles.title, { color: theme.title }]}>{item.title}</Text>
                  <Text style={[styles.description, { color: theme.text }]}>{item.description}</Text>
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
          />

          <View style={styles.dotsContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentIndex ? theme.secondaryLight : theme.secondaryDark,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={async () => handleStart()}
        >
          <LinearGradient
              colors={['#99C9FF', '#9C4BED']}
              style={styles.buttonGradient}
            />
            <Text style={styles.buttonText}>
              COMECE AGORA
              </Text>
        </TouchableOpacity>

        <IndexVectorRoxo
          style={styles.vectorRoxo}
          preserveAspectRatio="none"
          width={width}
          height={450}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111"
  },

  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(30),
    zIndex: 1
  },

  title: {
    fontSize: scale(26),
    fontWeight: '600',
    marginBottom: verticalScale(20),
    textAlign: 'center'
  },

  description: {
    fontSize: scale(16),
    textAlign: 'center'
  },

  button: {
    borderRadius: scale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(40),
    position: 'absolute',
    bottom: verticalScale(50),
    left: verticalScale(60),
    zIndex: 2,
  },

  buttonGradient: {
    borderRadius: scale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(40),
    position: 'absolute',
    width: verticalScale(200),
    height: scale(60),
    left: (20),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },


  buttonText: {
    fontWeight: 'bold',
    fontSize: scale(20),
    color: "#564B73",
    textAlign: 'center'
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(20),
  },

  dot: {
    width: scale(8),
    height: verticalScale(8),
    borderRadius: scale(10),
    marginHorizontal: scale(5),
  },

  vectorRoxo: {
    position: 'absolute',
    bottom: scale(-60)
  },
});
