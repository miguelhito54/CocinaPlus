import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { RecipeRepository } from '@/recipees/infrastructure/recipeeRepository';
import { Recipe } from '@/recipees/domain/Recipe';
import { AntDesign } from '@expo/vector-icons';

const RecipeDetail: React.FC = () => {
    const params = useLocalSearchParams();
    const recipeId = typeof params.id === 'string' ? params.id : '';
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!recipeId) return;
            const repo = new RecipeRepository();
            const allRecipes = await repo.getAllRecipes();
            const found = allRecipes.find(r => r.id === recipeId);
            setRecipe(found || null);
            setLoading(false);
        };
        fetchRecipe();
    }, [recipeId]);

    const toggleLike = () => {
        setLiked(prev => !prev);
        // Here you can add logic to persist the like in your database
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#782701" />
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Receta no encontrada</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: '', // Remove title
                    headerStyle: {
                        backgroundColor: '#FFF8F0',
                    },
                    headerBackTitle: '', // <-- This removes the previous page name
                    headerTintColor: '#782701',
                }}
            />
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: recipe.imageUrl || 'https://via.placeholder.com/300' }}
                        style={styles.image}
                    />
                    <TouchableOpacity onPress={toggleLike} style={styles.heartOverlay}>
                        <AntDesign
                            name={liked ? 'heart' : 'hearto'}
                            size={32}
                            color={liked ? '#B65D45' : '#fff'}
                            style={styles.heartIcon}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>{recipe.name}</Text>
                <Text style={styles.sectionTitle}>Ingredientes:</Text>
                <View style={styles.ingredientList}>
                    {recipe.ingredients.map((ingredient, idx) => (
                        <Text style={styles.ingredientItem} key={idx}>
                            • {ingredient}
                        </Text>
                    ))}
                </View>
                <Text style={styles.sectionTitle}>Instrucciones:</Text>
                <Text style={styles.instructions}>{recipe.instructions}</Text>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF8F0',
    },
    imageWrapper: {
        position: 'relative',
        marginBottom: 18,
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        backgroundColor: '#eee',
    },
    heartOverlay: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(120,39,1,0.7)',
        borderRadius: 24,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    heartIcon: {
        // No extra style needed, but you can adjust shadow here if desired
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#782701',
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#B65D45',
        marginTop: 16,
        marginBottom: 8,
    },
    ingredientList: {
        marginBottom: 12,
        marginLeft: 8,
    },
    ingredientItem: {
        fontSize: 15,
        color: '#782701',
        marginBottom: 2,
    },
    instructions: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        marginBottom: 20,
    },
});

export default RecipeDetail;
