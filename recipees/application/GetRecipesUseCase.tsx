import { Recipe } from "../domain/Recipe";
import { RecipeRepository } from "../infrastructure/recipeeRepository";

export class GetRecipesUseCase {
  constructor(private recipeRepository: RecipeRepository) {}

  async execute(): Promise<Recipe[]> {
    return await this.recipeRepository.getAllRecipes();
  }
}