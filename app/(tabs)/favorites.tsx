import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Favorites = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Favorites Page</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default Favorites;