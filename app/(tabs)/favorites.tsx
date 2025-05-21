import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { GetFavoriteRecipesUseCase } from '@/users/favorites/application/GetFavoriteRecipesUseCase';

const Favorites = () => {
    const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchFavorites = async () => {
        setLoading(true);
        const recipes = await GetFavoriteRecipesUseCase();
        setFavoriteRecipes(recipes);
        setLoading(false);
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <View style={styles.container}>
            {favoriteRecipes.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No tienes recetas favoritas aún.</Text>
                    <TouchableOpacity style={styles.reloadBarButton} onPress={fetchFavorites}>
                        <AntDesign name="reload1" size={22} color="#fff" />
                        <Text style={styles.reloadBarText}>Recargar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={favoriteRecipes}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => router.push({ pathname: '/recipeDetail', params: { id: item.id } })}
                            >
                                <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }} style={styles.image} />
                                <View style={styles.info}>
                                    <Text style={styles.title}>{item.name}</Text>
                                    <Text style={styles.category}>{item.category}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ paddingBottom: 70 }}
                    />
                    <View style={styles.reloadBarContainer}>
                        <TouchableOpacity style={styles.reloadBarButton} onPress={fetchFavorites}>
                            <AntDesign name="reload1" size={22} color="#fff" />
                            <Text style={styles.reloadBarText}>Recargar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF8F0',
    },
    emptyText: {
        fontSize: 16,
        color: '#782701',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 24,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 14,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 14,
        backgroundColor: '#eee',
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#782701',
    },
    category: {
        fontSize: 14,
        color: '#B65D45',
        marginTop: 2,
    },
    reloadBarContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 16,
        backgroundColor: 'transparent',
    },
    reloadBarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#782701',
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 10,
        elevation: 2,
    },
    reloadBarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    reloadCircle: {
        position: 'absolute',
        bottom: 140,
        right: 24,
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#782701',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        zIndex: 10,
    },
});

export default Favorites;