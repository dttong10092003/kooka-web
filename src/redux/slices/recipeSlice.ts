import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ==== Types ====
export interface IngredientType {
    _id: string;
    name: string;
}

export interface Ingredient {
    _id: string;
    name: string;
    typeId: string;
}

export interface Tag {
    _id: string;
    name: string;
}

export interface Cuisine {
    _id: string;
    name: string;
}

export interface Category {
    _id: string;
    name: string;
}

export interface Instruction {
    title: string;
    image: string;
    subTitle: string[];
}

export interface Recipe {
    _id: string;
    name: string;
    ingredients: Ingredient[];
    tags: Tag[];
    short: string;
    instructions: Instruction[];
    image: string;
    video: string;
    calories: number;
    time: number;
    size: number;
    difficulty: string;
    cuisine: Cuisine;
    category: Category;
    rate: number;
    numberOfRate: number;
}

// --- Search Recipes ---
interface SearchPayload {
    ingredients?: string[];
    tags?: string[];
    cuisine?: string;
    category?: string;
    top_k?: number;
}

// --- Search Recipes by Keyword ---
interface KeywordSearchPayload {
    keywords: string;
    tags?: string[];
    cuisine?: string;
    category?: string;
    top_k?: number;
}

// ==== State ====
interface RecipeState {
    recipes: Recipe[];
    ingredients: Ingredient[];
    ingredientTypes: IngredientType[];
    tags: Tag[];
    cuisines: Cuisine[];
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: RecipeState = {
    recipes: [],
    ingredients: [],
    ingredientTypes: [],
    tags: [],
    cuisines: [],
    categories: [],
    loading: false,
    error: null,
};

// ==== API base ====
const API_URL = "http://localhost:5000/api";

// ==== Async Thunks ====
export const searchRecipes = createAsyncThunk(
    "recipes/search",
    async (payload: SearchPayload) => {
        const res = await axios.post("http://127.0.0.1:8000/api/search", payload, {
            headers: { "Content-Type": "application/json" },
        });
        // Backend trả về { query: string, hits: [...] }
        return res.data.hits as Recipe[];
    }
);

export const searchRecipesByKeyword = createAsyncThunk(
    "recipes/searchByKeyword",
    async (payload: KeywordSearchPayload) => {
        const res = await axios.post("http://127.0.0.1:8000/api/search/search-by-keyword", payload, {
            headers: { "Content-Type": "application/json" },
        });
        // Backend trả về { query: string, hits: [...] }
        return res.data.hits as Recipe[];
    }
);

// --- Recipes ---
export const fetchRecipes = createAsyncThunk("recipes/fetchAll", async () => {
    const res = await axios.get(`${API_URL}/recipes`);
    return res.data as Recipe[];
});

export const getRecipeById = createAsyncThunk("recipes/fetchById", async (id: string) => {
    const res = await axios.get(`${API_URL}/recipes/${id}`);
    return res.data as Recipe;
});

export const addRecipe = createAsyncThunk("recipes/add", async (recipe: Omit<Recipe, "_id">) => {
    const res = await axios.post(`${API_URL}/recipes`, recipe);
    return res.data as Recipe;
});

export const updateRecipe = createAsyncThunk(
    "recipes/update",
    async ({ id, recipe }: { id: string; recipe: Partial<Recipe> }) => {
        const res = await axios.put(`${API_URL}/recipes/${id}`, recipe);
        return res.data as Recipe;
    }
);

export const deleteRecipe = createAsyncThunk("recipes/delete", async (id: string) => {
    await axios.delete(`${API_URL}/recipes/${id}`);
    return id;
});

// --- Ingredients ---
export const fetchIngredients = createAsyncThunk("ingredients/fetchAll", async () => {
    const res = await axios.get(`${API_URL}/ingredients`);
    return res.data as Ingredient[];
});

export const getIngredientsByType = createAsyncThunk("ingredients/fetchByType", async (typeId: string) => {
    const res = await axios.get(`${API_URL}/ingredients/type/${typeId}`);
    return res.data as Ingredient[];
});

export const getIngredientById = createAsyncThunk("ingredients/fetchById", async (id: string) => {
    const res = await axios.get(`${API_URL}/ingredients/${id}`);
    return res.data as Ingredient;
});

export const addIngredient = createAsyncThunk(
    "ingredients/add",
    async ({ name, typeId }: { name: string; typeId: string }) => {
        const res = await axios.post(`${API_URL}/ingredients`, { name, typeId });
        return res.data as Ingredient;
    }
);

export const updateIngredient = createAsyncThunk(
    "ingredients/update",
    async ({ id, ingredient }: { id: string; ingredient: Partial<Ingredient> }) => {
        const res = await axios.put(`${API_URL}/ingredients/${id}`, ingredient);
        return res.data as Ingredient;
    }
);

export const deleteIngredient = createAsyncThunk("ingredients/delete", async (id: string) => {
    await axios.delete(`${API_URL}/ingredients/${id}`);
    return id;
});

// --- Ingredient Types ---
export const fetchIngredientTypes = createAsyncThunk("ingredientTypes/fetchAll", async () => {
    const res = await axios.get(`${API_URL}/ingredient-types`);
    return res.data as IngredientType[];
});

export const getIngredientTypeById = createAsyncThunk("ingredientTypes/fetchById", async (id: string) => {
    const res = await axios.get(`${API_URL}/ingredient-types/${id}`);
    return res.data as IngredientType;
});

export const addIngredientType = createAsyncThunk("ingredientTypes/add", async (name: string) => {
    const res = await axios.post(`${API_URL}/ingredient-types`, { name });
    return res.data as IngredientType;
});

export const updateIngredientType = createAsyncThunk(
    "ingredientTypes/update",
    async ({ id, type }: { id: string; type: Partial<IngredientType> }) => {
        const res = await axios.put(`${API_URL}/ingredient-types/${id}`, type);
        return res.data as IngredientType;
    }
);

export const deleteIngredientType = createAsyncThunk("ingredientTypes/delete", async (id: string) => {
    await axios.delete(`${API_URL}/ingredient-types/${id}`);
    return id;
});

// --- Tags ---
export const fetchTags = createAsyncThunk("tags/fetchAll", async () => {
    const res = await axios.get(`${API_URL}/tags`);
    return res.data as Tag[];
});

export const getTagById = createAsyncThunk("tags/fetchById", async (id: string) => {
    const res = await axios.get(`${API_URL}/tags/${id}`);
    return res.data as Tag;
});

export const addTag = createAsyncThunk("tags/add", async (name: string) => {
    const res = await axios.post(`${API_URL}/tags`, { name });
    return res.data as Tag;
});

export const deleteTag = createAsyncThunk("tags/delete", async (id: string) => {
    await axios.delete(`${API_URL}/tags/${id}`);
    return id;
});

export const updateTag = createAsyncThunk("tags/update", async ({ id, tag }: { id: string; tag: Partial<Tag> }) => {
    const res = await axios.put(`${API_URL}/tags/${id}`, tag);
    return res.data as Tag;
}
);

// --- Cuisines ---
export const fetchCuisines = createAsyncThunk("cuisines/fetchAll", async () => {
    const res = await axios.get(`${API_URL}/cuisines`);
    return res.data as Cuisine[];
});

export const getCuisineById = createAsyncThunk("cuisines/fetchById", async (id: string) => {
    const res = await axios.get(`${API_URL}/cuisines/${id}`);
    return res.data as Cuisine;
});

export const addCuisine = createAsyncThunk("cuisines/add", async (name: string) => {
    const res = await axios.post(`${API_URL}/cuisines`, { name });
    return res.data as Cuisine;
});

export const deleteCuisine = createAsyncThunk("cuisines/delete", async (id: string) => {
    await axios.delete(`${API_URL}/cuisines/${id}`);
    return id;
});

export const updateCuisine = createAsyncThunk("cuisines/update", async ({ id, cuisine }: { id: string; cuisine: Partial<Cuisine> }) => {
    const res = await axios.put(`${API_URL}/cuisines/${id}`, cuisine);
    return res.data as Cuisine;
});

// --- Categories ---
export const fetchCategories = createAsyncThunk("categories/fetchAll", async () => {
    const res = await axios.get(`${API_URL}/categories`);
    return res.data as Category[];
});

export const getCategoryById = createAsyncThunk("categories/fetchById", async (id: string) => {
    const res = await axios.get(`${API_URL}/categories/${id}`);
    return res.data as Category;
});

export const addCategory = createAsyncThunk("categories/add", async (name: string) => {
    const res = await axios.post(`${API_URL}/categories`, { name });
    return res.data as Category;
});

export const deleteCategory = createAsyncThunk("categories/delete", async (id: string) => {
    await axios.delete(`${API_URL}/categories/${id}`);
    return id;
});

export const updateCategory = createAsyncThunk("categories/update", async ({ id, category }: { id: string; category: Partial<Category> }) => {
    const res = await axios.put(`${API_URL}/categories/${id}`, category);
    return res.data as Category;
});

// ==== Slice ====
const recipeSlice = createSlice({
    name: "recipes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Recipes
        builder
            .addCase(fetchRecipes.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
                state.recipes = action.payload;
                state.loading = false;
            })
            .addCase(searchRecipes.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
                state.recipes = action.payload;
                state.loading = false;
            })
            .addCase(searchRecipesByKeyword.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
                state.recipes = action.payload;
                state.loading = false;
            })
            .addCase(getRecipeById.fulfilled, (state, action: PayloadAction<Recipe>) => {
                const existing = state.recipes.find((r) => r._id === action.payload._id);
                if (!existing) state.recipes.push(action.payload);
            })
            .addCase(addRecipe.fulfilled, (state, action: PayloadAction<Recipe>) => {
                state.recipes.push(action.payload);
            })
            .addCase(updateRecipe.fulfilled, (state, action: PayloadAction<Recipe>) => {
                const index = state.recipes.findIndex((r) => r._id === action.payload._id);
                if (index !== -1) state.recipes[index] = action.payload;
            })
            .addCase(deleteRecipe.fulfilled, (state, action: PayloadAction<string>) => {
                state.recipes = state.recipes.filter((r) => r._id !== action.payload);
            });

        // Ingredients
        builder
            .addCase(fetchIngredients.fulfilled, (state, action: PayloadAction<Ingredient[]>) => {
                state.ingredients = action.payload;
            })
            .addCase(getIngredientsByType.fulfilled, (state, action: PayloadAction<Ingredient[]>) => {
                state.ingredients = action.payload;
            })
            .addCase(getIngredientById.fulfilled, (state, action: PayloadAction<Ingredient>) => {
                const existing = state.ingredients.find((i) => i._id === action.payload._id);
                if (!existing) state.ingredients.push(action.payload);
            })
            .addCase(addIngredient.fulfilled, (state, action: PayloadAction<Ingredient>) => {
                state.ingredients.push(action.payload);
            })
            .addCase(updateIngredient.fulfilled, (state, action: PayloadAction<Ingredient>) => {
                const index = state.ingredients.findIndex((i) => i._id === action.payload._id);
                if (index !== -1) state.ingredients[index] = action.payload;
            })
            .addCase(deleteIngredient.fulfilled, (state, action: PayloadAction<string>) => {
                state.ingredients = state.ingredients.filter((i) => i._id !== action.payload);
            });

        // Ingredient Types
        builder
            .addCase(fetchIngredientTypes.fulfilled, (state, action: PayloadAction<IngredientType[]>) => {
                state.ingredientTypes = action.payload;
            })
            .addCase(getIngredientTypeById.fulfilled, (state, action: PayloadAction<IngredientType>) => {
                const existing = state.ingredientTypes.find((t) => t._id === action.payload._id);
                if (!existing) state.ingredientTypes.push(action.payload);
            })
            .addCase(addIngredientType.fulfilled, (state, action: PayloadAction<IngredientType>) => {
                state.ingredientTypes.push(action.payload);
            })
            .addCase(updateIngredientType.fulfilled, (state, action: PayloadAction<IngredientType>) => {
                const index = state.ingredientTypes.findIndex((t) => t._id === action.payload._id);
                if (index !== -1) state.ingredientTypes[index] = action.payload;
            })
            .addCase(deleteIngredientType.fulfilled, (state, action: PayloadAction<string>) => {
                state.ingredientTypes = state.ingredientTypes.filter((t) => t._id !== action.payload);
            });

        // Tags
        builder
            .addCase(fetchTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
                state.tags = action.payload;
            })
            .addCase(getTagById.fulfilled, (state, action: PayloadAction<Tag>) => {
                const existing = state.tags.find((t) => t._id === action.payload._id);
                if (!existing) state.tags.push(action.payload);
            })
            .addCase(addTag.fulfilled, (state, action: PayloadAction<Tag>) => {
                state.tags.push(action.payload);
            })
            .addCase(updateTag.fulfilled, (state, action: PayloadAction<Tag>) => {
                const index = state.tags.findIndex((t) => t._id === action.payload._id);
                if (index !== -1) state.tags[index] = action.payload;
            })
            .addCase(deleteTag.fulfilled, (state, action: PayloadAction<string>) => {
                state.tags = state.tags.filter((t) => t._id !== action.payload);
            });

        // Cuisines
        builder
            .addCase(fetchCuisines.fulfilled, (state, action: PayloadAction<Cuisine[]>) => {
                state.cuisines = action.payload;
            })
            .addCase(getCuisineById.fulfilled, (state, action: PayloadAction<Cuisine>) => {
                const existing = state.cuisines.find((c) => c._id === action.payload._id);
                if (!existing) state.cuisines.push(action.payload);
            })
            .addCase(addCuisine.fulfilled, (state, action: PayloadAction<Cuisine>) => {
                state.cuisines.push(action.payload);
            })
            .addCase(updateCuisine.fulfilled, (state, action: PayloadAction<Cuisine>) => {
                const index = state.cuisines.findIndex((c) => c._id === action.payload._id);
                if (index !== -1) state.cuisines[index] = action.payload;
            })
            .addCase(deleteCuisine.fulfilled, (state, action: PayloadAction<string>) => {
                state.cuisines = state.cuisines.filter((c) => c._id !== action.payload);
            });

        // Categories
        builder
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.categories = action.payload;
            })
            .addCase(getCategoryById.fulfilled, (state, action: PayloadAction<Category>) => {
                const existing = state.categories.find((c) => c._id === action.payload._id);
                if (!existing) state.categories.push(action.payload);
            })
            .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                state.categories.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                const index = state.categories.findIndex((c) => c._id === action.payload._id);
                if (index !== -1) state.categories[index] = action.payload;
            })
            .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
                state.categories = state.categories.filter((c) => c._id !== action.payload);
            });

        // Generic pending/rejected
        builder
            .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action: any) => {
                    state.loading = false;
                    state.error = action.error?.message || "Something went wrong";
                }
            );
    },
});

export default recipeSlice.reducer;
