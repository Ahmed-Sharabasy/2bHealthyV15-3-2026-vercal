const BASE_URL = "https://api.spoonacular.com";
const API_KEY = process.env.SPOONACULAR_API_KEY;

export const fetchFood = async (req, res) => {
  const { query } = req.query;
  const response = await fetch(
    `${BASE_URL}/recipes/complexSearch?apiKey=${API_KEY}&query=${query}`,
  );
  const data = await response.json();

  // const flutterResponse = {
  //   results: data.results.map((recipe) => ({
  //     id: recipe.id,
  //     title: recipe.title,
  //     image: recipe.image,
  //   })),
  // };
  res.json(data);
};

export const getFullRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const response = await fetch(
    `${BASE_URL}/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`,
  );
  const data = await response.json();
  res.json(data);

  // ... rest of the code
};

export const getFoodNutrition = async (req, res) => {
  const { foodName } = req.params;
  const response = await fetch(
    `${BASE_URL}/recipes/guessNutrition?apiKey=${API_KEY}&title=${foodName}`,
  );
  const data = await response.json();
  // ... rest of the code
};

export const searchRecipesByIngredients = async (req, res) => {
  const { ingredients, number } = req.query;
  const response = await fetch(
    `${BASE_URL}/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients.join(",")}&number=${number}&ranking=1&ignorePantry=true`,
  );
  const data = await response.json();
  // ... rest of the code
};

// get recipe by name and return its nutrition information
export const getFoodNutritionWithImage = async (req, res) => {
  const { foodName } = req.query; // ✅ query مش params

  const response = await fetch(
    `${BASE_URL}/recipes/complexSearch?apiKey=${API_KEY}&query=${foodName}&addRecipeNutrition=true&number=1`,
  );
  const data = await response.json();
  const item = data.results[0];

  res.json({
    title: item.title,
    image: item.image,
    calories: item.nutrition?.nutrients?.find((n) => n.name === "Calories")
      ?.amount,
    protein: item.nutrition?.nutrients?.find((n) => n.name === "Protein")
      ?.amount,
    fat: item.nutrition?.nutrients?.find((n) => n.name === "Fat")?.amount,
    carbs: item.nutrition?.nutrients?.find((n) => n.name === "Carbohydrates")
      ?.amount,
  });
};
