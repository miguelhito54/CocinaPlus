import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { RecipeRepository } from '@/recipees/infrastructure/recipeeRepository';
import { Recipe } from '@/recipees/domain/Recipe';

const CATEGORY_LABELS: Record<string, string> = {
    'Snacks': 'Snacks Curiosos y Saludables',
    'Cena': 'Cenas',
};

const CategoryDetail: React.FC = () => {
    const params = useLocalSearchParams();
    const rawCategory = typeof params.category === 'string' ? params.category : 'Unknown Category';
    const category = CATEGORY_LABELS[rawCategory] || rawCategory;
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const router = useRouter();

    // Hide the default header
    const navigation = useNavigation();
    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const repo = new RecipeRepository();
            const allRecipes = await repo.getAllRecipes();
            const filteredRecipes = allRecipes.filter(recipe => recipe.category === rawCategory);
            setRecipes(filteredRecipes);
        };

        fetchRecipes();
    }, [rawCategory]);

    return (
        <View style={styles.container}>
            {/* Custom header with back button, always transparent background */}
            <View style={[styles.customHeader, styles.headerNoBackground]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>{'‹'}</Text>
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{category}</Text>
                </View>
            </View>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push({ pathname: '/recipeDetail', params: { id: item.id } })}>
                        <View style={styles.card}>
                            <Image
                                source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                                style={styles.cardImage}
                            />
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>{item.name}</Text>
                                </View>
                                <Text style={styles.cardDescription}>
                                    Ingredientes:
                                </Text>
                                <View style={styles.ingredientList}>
                                    {item.ingredients.map((ingredient, idx) => (
                                        <Text style={styles.ingredientItem} key={idx}>
                                            • {ingredient}
                                        </Text>
                                    ))}
                                </View>
                                <Text style={styles.cardInstructions}>
                                    {item.instructions.substring(0, 80)}...
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay recetas en esta categoría.</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#FFF8F0',
    },
    customHeader: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 8,
        marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 32,
    },
    headerNoBackground: {
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: 48,
        zIndex: 2,
    },
    backButtonText: {
        fontSize: 38,
        color: '#782701',
        fontWeight: 'bold',
        lineHeight: 40,
        textAlign: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 18, // Decreased from 24
        fontWeight: 'bold',
        color: '#782701',
        letterSpacing: 1,
        textAlign: 'center',
    },
    title: {
        display: 'none',
    },
    listContent: {
        paddingBottom: 32,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#782701',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f3e2d0',
    },
    cardImage: {
        width: '100%',
        height: 170,
        resizeMode: 'cover',
        backgroundColor: '#eee',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#782701',
        flex: 1,
        marginRight: 8,
    },
    cardDescription: {
        fontSize: 15,
        color: '#b65d45',
        marginBottom: 4,
        fontWeight: '500',
    },
    ingredientList: {
        marginBottom: 8,
        marginLeft: 8,
    },
    ingredientItem: {
        fontSize: 13,
        color: '#782701',
    },
    cardInstructions: {
        fontSize: 13,
        color: '#555',
        fontStyle: 'italic',
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 40,
    },
});

export default CategoryDetail;