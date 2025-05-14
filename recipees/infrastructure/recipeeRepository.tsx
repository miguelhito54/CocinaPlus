import { collection, getDocs } from "firebase/firestore";
import { db } from "@/.env/firebaseConfig";
import { Recipe } from "@/recipees/domain/Recipe";

export class RecipeRepository {
  async getAllRecipes(): Promise<Recipe[]> {
    const recipesCollection = collection(db, "recipes");
    const recipeSnapshot = await getDocs(recipesCollection);
    return recipeSnapshot.docs.map((doc) => {
      const data = doc.data();
      return new Recipe(
        doc.id,
        data.name,
        data.ingredients,
        data.category, 
        data.instructions,
        data.imageUrl || "" 
      );
    });
  }
}