import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { RecipeRepository } from '@/recipees/infrastructure/recipeeRepository';
import { Recipe } from '@/recipees/domain/Recipe';

interface CategoryDetailProps {
    route?: {
        params?: {
            category?: string;
        };
    };
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ route }) => {
    const category = route?.params?.category || 'Unknown Category'; // Fallback for undefined route or params
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const repo = new RecipeRepository();
            const allRecipes = await repo.getAllRecipes(); // Fetch all recipes
            const filteredRecipes = allRecipes.filter(recipe => recipe.category === category); // Filter by category
            setRecipes(filteredRecipes);
        };

        fetchRecipes();
    }, [category]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Recipes in <Text>{category}</Text>
            </Text>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image
                            source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                            style={styles.cardImage}
                        />
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardDescription}>
                                {item.ingredients.length} ingredients
                            </Text>
                            <Text style={styles.cardInstructions}>
                                {item.instructions.substring(0, 50)}...
                            </Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    cardInstructions: {
        fontSize: 12,
        color: '#777',
    },
});

export default CategoryDetail;