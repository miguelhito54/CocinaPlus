import React, { useState, useEffect } from 'react';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../.env/firebaseConfig'; // Assuming this is where your Firestore instance is initialized
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface Recipe {
  id?: string; // Optional id for new recipes not yet in Firestore
  name: string;
  ingredients: string[];
  instructions: string;
}

const RecipeesCRUD: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const deleteIngredient = (index: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  const updateIngredient = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  const clearInputs = () => {
    setName('');
    setIngredients([]);
    setInstructions('');
    setSelectedRecipeId(null);
  };

  const createRecipe = async () => {
    try {
      const docRef = await addDoc(collection(db, 'recipes'), { name, ingredients, instructions });
      console.log('Document written with ID: ', docRef.id);
      readRecipes();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const readRecipes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData: Recipe[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        ingredients: doc.data().ingredients || [],
        instructions: doc.data().instructions,
      }));
      setRecipes(recipesData);
    } catch (e) {
      console.error('Error getting documents:', e);
    }
  };

  const updateRecipe = async (id: string, name: string, ingredients: string[], instructions: string) => {
    try {
      const recipeRef = doc(db, 'recipes', id);
      await updateDoc(recipeRef, { name, ingredients, instructions });
      console.log('Document updated with ID: ', id);
      clearInputs();
      readRecipes();
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recipes', id));
      console.log('Document deleted with ID: ', id);
      readRecipes();
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setName(recipe.name || '');
    setIngredients(recipe.ingredients);
    setInstructions(recipe.instructions);
    setSelectedRecipeId(recipe.id ?? null);
  };

  useEffect(() => {
    readRecipes();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestion de Recetas</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la receta"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <View style={styles.ingredientsContainer}>
        <Text style={styles.label}>Ingredientes:</Text>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientRow}>
            <TextInput
              style={styles.input}
              placeholder={`Ingredientes ${index + 1}`}
              placeholderTextColor="#999"
              value={ingredient}
              onChangeText={(value) => updateIngredient(index, value)}
            />
            <TouchableOpacity onPress={() => deleteIngredient(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
          <Text style={styles.addButtonText}>Agregar Ingrediente</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Instrucciones de preparación"
        placeholderTextColor="#999"
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />

      {!selectedRecipeId ? (
        <TouchableOpacity onPress={() => { createRecipe(); clearInputs(); }} style={styles.createButton}>
          <Text style={styles.createButtonText}>Crear</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => { updateRecipe(selectedRecipeId, name, ingredients, instructions); clearInputs(); }} style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Actualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { deleteRecipe(selectedRecipeId); clearInputs(); }} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Borrar</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.subtitle}>Recetas Creadas</Text>
      {recipes.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          style={[styles.recipeCard, selectedRecipeId === recipe.id && styles.selectedRecipeCard]}
          onPress={() => handleRecipeClick(recipe)}
        >
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Text style={styles.recipeDetails}>Ingredientes: {recipe.ingredients.join(', ')}</Text>
          <Text style={styles.recipeDetails}>Instrucciones: {recipe.instructions}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40, // Added padding to the top
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: '#e63946',
    borderRadius: 8,
    padding: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#A3D9B1',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#2a9d8f',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#2a9d8f',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedRecipeCard: {
    borderColor: '#2a9d8f',
    borderWidth: 2,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recipeDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default RecipeesCRUD;