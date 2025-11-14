import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-matters';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
      
    return (
        <View>
            <View style={[styles.header, { backgroundColor: Colors[theme].primary  }]}> 
                <Text style={[styles.title, { color: theme === 'light' ? "#FFF" : "#DDD" }]}>Museus & Cultura</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                        <Ionicons name={theme === 'light' ? 'sunny' : 'moon'} size={24} color={theme === 'light' ? '#FFF' : '#DDD'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: scale(10),
        paddingTop: scale(40)
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    themeButton: {
        padding: 8,
        borderRadius: 16,
    }
});