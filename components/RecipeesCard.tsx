import React from 'react';
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import { GetRecipesUseCase } from "@/recipees/application/GetRecipesUseCase";
import { RecipeRepository } from "@/recipees/infrastructure/recipeeRepository";
import { Recipe } from "@/recipees/domain/Recipe";
import { SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function recipeCard(){
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const repo = new RecipeRepository();
      const useCase = new GetRecipesUseCase(repo);
      const result = await useCase.execute();
      setRecipes(result);
    };

    fetchRecipes();
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {recipes.map((recipe) => (
          <View key={recipe.id} style={styles.recipeCard}>
            <View style={styles.imageContainer}>
              {recipe.imageUrl ? (
                <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>🍽️</Text>
                </View>
              )}
            </View>
            
            <View style={styles.recipeContent}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              
              <Text style={styles.sectionTitle}>
                <AntDesign name="appstore1" size={16} color="#e63946" /> Ingredientes:
              </Text>
              <Text style={styles.ingredients}>{recipe.ingredients.join(", ")}</Text>

              <Text style={styles.sectionTitle}>
                <AntDesign name="tags" size={16} color="#e63946" /> Categoría:
              </Text>
              <Text style={styles.category}>{recipe.category}</Text>
              
              <Text style={styles.sectionTitle}>
                <AntDesign name="clockcircleo" size={16} color="#e63946" /> Preparación
              </Text>
              <Text style={styles.instructions}>{recipe.instructions}</Text>
              
              <View style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Preparar Ahora</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    marginBottom: 16,
    marginTop: 8,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f2f2f2',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5ffe8',
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recipeContent: {
    padding: 16,
  },
  recipeName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: '#212121',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#212121',
    marginTop: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredients: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#bdbbbb',
    lineHeight: 22,
  },
  category: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#bdbbbb',
    lineHeight: 22,
    marginBottom: 10,
  },
  instructions: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#bdbbbb',
    lineHeight: 22,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#A3D9B1', 
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: {
    fontFamily: 'Poppins_700Bold',
    color: 'white',
    fontSize: 16,
  }
});