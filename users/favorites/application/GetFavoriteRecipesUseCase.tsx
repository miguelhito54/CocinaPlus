import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/.env/firebaseConfig";
import { RecipeRepository } from '@/recipees/infrastructure/recipeeRepository';

export async function GetFavoriteRecipesUseCase() {
    const user = auth.currentUser;
    if (!user) return [];
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    let favorites: string[] = [];
    if (userDoc.exists()) {
        favorites = userDoc.data().favorites || [];
    }
    if (favorites.length === 0) return [];
    const repo = new RecipeRepository();
    const allRecipes = await repo.getAllRecipes();
    return allRecipes.filter(r => favorites.includes(r.id));
}
