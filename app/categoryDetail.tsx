import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RecipeRepository } from '@/recipees/infrastructure/recipeeRepository';
import { Recipe } from '@/recipees/domain/Recipe';

const CATEGORY_LABELS: Record<string, string> = {
    'Snacks': 'Snacks Curiosos y Saludables',
    'Cena': 'Cenas',
    // Add more mappings if needed
};

const CategoryDetail: React.FC = () => {
    const params = useLocalSearchParams();
    const rawCategory = typeof params.category === 'string' ? params.category : 'Unknown Category';
    const category = CATEGORY_LABELS[rawCategory] || rawCategory;
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const router = useRouter();

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
            <Text style={styles.title}>
                {category}
            </Text>
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
        padding: 16,
        backgroundColor: '#FFF8F0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#782701',
        marginBottom: 20,
        textAlign: 'center',
        letterSpacing: 1,
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