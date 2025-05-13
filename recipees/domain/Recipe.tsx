export class Recipe {
    constructor(
      public id: string,
      public name: string,
      public ingredients: string[],
      public category: string,
      public instructions: string,
      public imageUrl: string 
    ) {}
  
    isValid(): boolean {
      return (
        this.name.trim().length > 0 &&
        this.ingredients.length > 0 &&
        this.instructions.trim().length > 0
      );
    }
  

    getShortDescription(): string {
      return `${this.name} - ${this.ingredients.length} ingredientes`;
    }
  }
