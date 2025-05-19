import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../.env/firebaseConfig';

const Favorites = () => {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const snapshot = await getDocs(collection(db, 'users'));
            // Extrae el campo favorite de cada documento
            const favs: string[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.favorite) {
                    favs.push(data.favorite);
                }
            });
            setFavorites(favs);
        };
        fetchFavorites();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Favorites Page</Text>
            <FlatList
                data={favorites}
                keyExtractor={(item, idx) => item + idx}
                renderItem={({ item }) => (
                    <Text style={styles.favoriteItem}>Receta ID: {item}</Text>
                )}
                ListEmptyComponent={<Text style={styles.text}>No hay favoritos</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    favoriteItem: {
        fontSize: 16,
        color: '#782701',
        marginBottom: 10,
    },
});

export default Favorites;