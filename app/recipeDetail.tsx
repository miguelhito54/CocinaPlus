import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { RecipeRepository } from '@/recipees/infrastructure/recipeeRepository';
import { Recipe } from '@/recipees/domain/Recipe';
import { AntDesign } from '@expo/vector-icons';
import { doc, setDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/.env/firebaseConfig";
import { auth } from "@/.env/firebaseConfig";

const RecipeDetail: React.FC = () => {
    const params = useLocalSearchParams();
    const recipeId = typeof params.id === 'string' ? params.id : '';
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const router = useRouter();
    const navigation = useNavigation();

    // Hide the default header
    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

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

        // Check if this recipe is a favorite for the current user
        const checkFavorite = async () => {
            const user = auth.currentUser;
            if (!user || !recipeId) return;
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const favorites = userDoc.data().favorites || [];
                setLiked(favorites.includes(recipeId));
            }
        };
        checkFavorite();
    }, [recipeId]);

    const toggleLike = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("Debes iniciar sesión para agregar favoritos.");
            return;
        }
        const userDocRef = doc(db, "users", user.uid);
        if (!liked) {
            await setDoc(
                userDocRef,
                { favorites: arrayUnion(recipeId) },
                { merge: true }
            );
            setLiked(true);
        } else {
            await setDoc(
                userDocRef,
                { favorites: arrayRemove(recipeId) },
                { merge: true }
            );
            setLiked(false);
        }
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
        <View style={styles.container}>
            {/* Custom header with back button, always transparent background */}
            <View style={[styles.customHeader, styles.headerNoBackground]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>{'‹'}</Text>
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{recipe.name}</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
        paddingHorizontal: 16,
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
        fontSize: 14, 
        fontWeight: 'bold',
        color: '#782701',
        letterSpacing: 1,
        textAlign: 'center',
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
