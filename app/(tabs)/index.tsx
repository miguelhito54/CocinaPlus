import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter
import { useEffect, useState } from 'react';
import { RecipeRepository } from '@/recipees/infrastructure/recipeeRepository';
import { Recipe } from '@/recipees/domain/Recipe';

export default function HomeScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchCategories = async () => {
      const repo = new RecipeRepository();
      const allRecipes = await repo.getAllRecipes();
      const uniqueCategories = Array.from(new Set(allRecipes.map(recipe => recipe.category))); // Get unique categories
      setCategories(uniqueCategories);
    };

    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Cocina+</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for recipes..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Categories Section */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.tilesContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tile}
              onPress={() => {
                console.log('Navigating to CategoryDetail with category:', item); // Debug the category value
                router.push(`/categoryDetail?category=${encodeURIComponent(item)}`); // Use router.push
              }}
            >
              <View style={styles.tileImageContainer}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/150' }}
                  style={styles.tileImage}
                />
              </View>
              <Text style={styles.tileTitle}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  searchBarContainer: {
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  tilesContainer: {
    alignItems: 'center', // Center tiles horizontally
  },
  tile: {
    width: 160, // Slightly larger tile size
    height: 110,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'space-around', // Distribute space more evenly
  },
  tileImageContainer: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  categoriesContainer: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

