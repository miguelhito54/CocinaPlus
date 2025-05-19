import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, ScrollView, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { GetRecipesUseCase } from '@/recipees/application/GetRecipesUseCase';
import { RecipeRepository } from '@/recipees/infrastructure/recipeeRepository';
import { Recipe } from '@/recipees/domain/Recipe';
import { useRouter } from 'expo-router';

// Define the categories data
const categoriesData = [
  { name: 'Desayunos', image: 'https://i.imgur.com/wuMnzFW.png' },
  { name: 'Brunch', image: 'https://i.imgur.com/tgPp52q.png' },
  { name: 'Almuerzos', image: 'https://i.imgur.com/q9VGz8Q.png' },
  { name: 'Snacks Curiosos y Saludables', image: 'https://i.imgur.com/Ah1XlHI.png ' },
  { name: 'Postres', image: 'https://i.imgur.com/h4uLXKF.png ' },
  { name: 'Cenas', image: 'https://i.imgur.com/TEQlJZZ.png ' },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      const useCase = new GetRecipesUseCase(new RecipeRepository());
      const recipes = await useCase.execute();
      setAllRecipes(recipes);
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (search.trim().length === 0) {
      setFilteredRecipes([]);
      return;
    }
    const lower = search.toLowerCase();
    setFilteredRecipes(
      allRecipes.filter(
        r =>
          r.name.toLowerCase().includes(lower) ||
          r.category.toLowerCase().includes(lower)
      )
    );
  }, [search, allRecipes]);

  useEffect(() => {
    if (typeof window !== 'undefined' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleRecipePress = (recipe: Recipe) => {
    router.push({ pathname: '/recipeDetail', params: { id: recipe.id } });
  };

  const handleCategoryPress = (category: { name: string }) => {
    router.push({ pathname: '/categoryDetail', params: { category: category.name } });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Cocina+</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBarWrapper}>
            <TextInput
              ref={searchInputRef}
              style={styles.searchBar}
              placeholder="Buscar recetas..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
              autoFocus={Platform.OS === 'web'}
            />
            {search.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setSearch('')}>
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {filteredRecipes.length > 0 && (
          <View style={styles.resultsContainer}>
            <ScrollView
              style={{ maxHeight: 250 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {filteredRecipes.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resultItem}
                  onPress={() => handleRecipePress(item)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.resultImage} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultTitle}>{item.name}</Text>
                    <Text style={styles.resultCategory}>{item.category}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <FlatList
            data={categoriesData}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.tilesContainer}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCategoryPress(item)}>
                <View style={styles.tile}>
                  <View style={styles.tileImageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.tileImage}
                    />
                  </View>
                  <Text style={styles.tileTitle}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0', 
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    marginTop: 24,
  },
  logo: {
    fontSize: 36, 
    fontWeight: 'bold',
    color: '#782701',
    letterSpacing: 1,
    textAlign: 'center',
    width: '100%',
    textShadowColor: '#fff8f0',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchBarContainer: {
    marginBottom: 20,
  },
  searchBarWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchBar: {
    backgroundColor: '#fff', 
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#782701', 
    color: '#782701', 
    paddingRight: 36, // space for the X button
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  clearButtonText: {
    fontSize: 22,
    color: '#782701',
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  tilesContainer: {
    alignItems: 'center',
  },
  tile: {
    width: 145,
    height: 145,
    backgroundColor: '#782701',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tileImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tileImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85, 
  },
  tileTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'left',
    textShadowColor: '#782701',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categoriesContainer: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#782701', 
    marginBottom: 20,
    backgroundColor: '#fff', 
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#782701', 
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#782701',
    maxHeight: 250,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#782701',
  },
  resultCategory: {
    fontSize: 13,
    color: '#888',
  },
});