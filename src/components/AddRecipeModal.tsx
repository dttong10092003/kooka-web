import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addRecipe,
    fetchCategories,
    fetchCuisines,
    fetchIngredients,
    fetchTags
} from '../redux/slices/recipeSlice';
import type {
    Category,
    Cuisine,
    Ingredient,
    Tag
} from '../redux/slices/recipeSlice';
import type { RootState, AppDispatch } from '../redux/store';
import AddCategoryModal from './AddCategoryModal';
import AddCuisineModal from './AddCuisineModal';
import AddIngredientModal from './AddIngredientModal';
import AddTagModal from './AddTagModal';

interface AddRecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Instruction {
    title: string;
    image: string;
    subTitle: string[];
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();

    // Get data from Redux store
    const { categories, cuisines, ingredients, tags } = useSelector(
        (state: RootState) => state.recipes
    );

    // Local states for sub-modals
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isCuisineModalOpen, setIsCuisineModalOpen] = useState(false);
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    // State for recipe form
    const [recipe, setRecipe] = useState({
        name: '',
        ingredients: [] as string[],
        tags: [] as string[],
        short: '',
        instructions: [] as Instruction[],
        image: '',
        video: '',
        calories: 0,
        time: 0,
        size: 0,
        difficulty: '',
        cuisine: '',
        category: '',
        rate: 0,        // Default values for required fields
        numberOfRate: 0 // Default values for required fields
    });

    // State for current instruction being added
    const [currentInstruction, setCurrentInstruction] = useState<Instruction>({
        title: '',
        image: '',
        subTitle: ['']
    });

    // Fetch all necessary data when component mounts
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCuisines());
        dispatch(fetchIngredients());
        dispatch(fetchTags());
    }, [dispatch]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'calories' || name === 'time' || name === 'size') {
            setRecipe({ ...recipe, [name]: Number(value) });
        } else {
            setRecipe({ ...recipe, [name]: value });
        }
    };

    // Handle select changes for multi-select (ingredients, tags)
    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: 'ingredients' | 'tags') => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setRecipe({ ...recipe, [field]: selectedOptions });
    };

    // Handle instruction subtitle changes
    const handleSubtitleChange = (index: number, value: string) => {
        const updatedSubtitles = [...currentInstruction.subTitle];
        updatedSubtitles[index] = value;
        setCurrentInstruction({
            ...currentInstruction,
            subTitle: updatedSubtitles
        });
    };

    // Add a new subtitle field
    const addSubtitle = () => {
        setCurrentInstruction({
            ...currentInstruction,
            subTitle: [...currentInstruction.subTitle, '']
        });
    };

    // Remove a subtitle field
    const removeSubtitle = (index: number) => {
        const updatedSubtitles = currentInstruction.subTitle.filter((_, i) => i !== index);
        setCurrentInstruction({
            ...currentInstruction,
            subTitle: updatedSubtitles
        });
    };

    // Add current instruction to recipe instructions
    const addInstruction = () => {
        if (currentInstruction.title && currentInstruction.subTitle.some(subtitle => subtitle.trim() !== '')) {
            setRecipe({
                ...recipe,
                instructions: [...recipe.instructions, { ...currentInstruction }]
            });
            setCurrentInstruction({
                title: '',
                image: '',
                subTitle: ['']
            });
        }
    };

    // Remove an instruction
    const removeInstruction = (index: number) => {
        const updatedInstructions = recipe.instructions.filter((_, i) => i !== index);
        setRecipe({
            ...recipe,
            instructions: updatedInstructions
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Transform the data to match the expected format for the API
            // The backend expects ingredient IDs, not Ingredient objects
            // We need to use type assertion to match the expected interface
            const recipeData = {
                name: recipe.name,
                ingredients: recipe.ingredients, // Already string IDs
                tags: recipe.tags, // Already string IDs
                short: recipe.short,
                instructions: recipe.instructions,
                image: recipe.image,
                video: recipe.video,
                calories: recipe.calories,
                time: recipe.time,
                size: recipe.size,
                difficulty: recipe.difficulty,
                cuisine: recipe.cuisine, // Already a string ID
                category: recipe.category, // Already a string ID
                rate: recipe.rate,
                numberOfRate: recipe.numberOfRate,
            };

            await dispatch(addRecipe(recipeData as any)); // Using any as a temporary workaround for type issues
            onClose();
        } catch (error) {
            console.error('Failed to add recipe:', error);
            // You could add error handling UI here
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New Recipe</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Recipe Name</label>
                        <input
                            type="text"
                            name="name"
                            value={recipe.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Short Description</label>
                        <textarea
                            name="short"
                            value={recipe.short}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            rows={2}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <input
                                type="text"
                                name="image"
                                value={recipe.image}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Video URL</label>
                            <input
                                type="text"
                                name="video"
                                value={recipe.video}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Calories</label>
                            <input
                                type="number"
                                name="calories"
                                value={recipe.calories}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Preparation Time (minutes)</label>
                            <input
                                type="number"
                                name="time"
                                value={recipe.time}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Serving Size</label>
                            <input
                                type="number"
                                name="size"
                                value={recipe.size}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Difficulty</label>
                        <select
                            name="difficulty"
                            value={recipe.difficulty}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Difficulty</option>
                            <option value="Dễ">Dễ</option>
                            <option value="Trung bình">Trung bình</option>
                            <option value="Khó">Khó</option>
                        </select>
                    </div>

                    {/* Category Selection with Add New option */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium">Category</label>
                            <button
                                type="button"
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="text-sm text-blue-500 hover:text-blue-700"
                            >
                                + Add New Category
                            </button>
                        </div>
                        <select
                            name="category"
                            value={recipe.category}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category: Category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Cuisine Selection with Add New option */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium">Cuisine</label>
                            <button
                                type="button"
                                onClick={() => setIsCuisineModalOpen(true)}
                                className="text-sm text-blue-500 hover:text-blue-700"
                            >
                                + Add New Cuisine
                            </button>
                        </div>
                        <select
                            name="cuisine"
                            value={recipe.cuisine}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Cuisine</option>
                            {cuisines.map((cuisine: Cuisine) => (
                                <option key={cuisine._id} value={cuisine._id}>
                                    {cuisine.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ingredients Selection with Add New option */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium">Ingredients</label>
                            <button
                                type="button"
                                onClick={() => setIsIngredientModalOpen(true)}
                                className="text-sm text-blue-500 hover:text-blue-700"
                            >
                                + Add New Ingredient
                            </button>
                        </div>
                        <select
                            multiple
                            name="ingredients"
                            value={recipe.ingredients}
                            onChange={(e) => handleMultiSelectChange(e, 'ingredients')}
                            className="w-full p-2 border rounded h-32"
                            required
                        >
                            {ingredients.map((ingredient: Ingredient) => (
                                <option key={ingredient._id} value={ingredient._id}>
                                    {ingredient.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple ingredients</p>
                    </div>

                    {/* Tags Selection with Add New option */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium">Tags</label>
                            <button
                                type="button"
                                onClick={() => setIsTagModalOpen(true)}
                                className="text-sm text-blue-500 hover:text-blue-700"
                            >
                                + Add New Tag
                            </button>
                        </div>
                        <select
                            multiple
                            name="tags"
                            value={recipe.tags}
                            onChange={(e) => handleMultiSelectChange(e, 'tags')}
                            className="w-full p-2 border rounded h-32"
                        >
                            {tags.map((tag: Tag) => (
                                <option key={tag._id} value={tag._id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple tags</p>
                    </div>

                    {/* Instructions Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Instructions</h3>

                        {/* Existing Instructions */}
                        {recipe.instructions.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {recipe.instructions.map((instruction, idx) => (
                                    <div key={idx} className="p-3 border rounded bg-gray-50">
                                        <div className="flex justify-between mb-2">
                                            <h4 className="font-medium">{instruction.title}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeInstruction(idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">Image: {instruction.image || 'N/A'}</p>
                                        <ul className="list-disc list-inside">
                                            {instruction.subTitle.map((sub, subIdx) => (
                                                <li key={subIdx} className="text-sm">{sub}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add New Instruction Form */}
                        <div className="p-4 border rounded bg-gray-50">
                            <h4 className="font-medium mb-2">Add New Instruction</h4>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={currentInstruction.title}
                                    onChange={(e) => setCurrentInstruction({ ...currentInstruction, title: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Image</label>
                                <input
                                    type="text"
                                    value={currentInstruction.image}
                                    onChange={(e) => setCurrentInstruction({ ...currentInstruction, image: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium">Sub-steps</label>
                                    <button
                                        type="button"
                                        onClick={addSubtitle}
                                        className="text-sm text-blue-500 hover:text-blue-700"
                                    >
                                        + Add Step
                                    </button>
                                </div>

                                {currentInstruction.subTitle.map((subtitle, idx) => (
                                    <div key={idx} className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={subtitle}
                                            onChange={(e) => handleSubtitleChange(idx, e.target.value)}
                                            className="w-full p-2 border rounded"
                                            placeholder={`Step ${idx + 1}`}
                                        />
                                        {idx > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSubtitle(idx)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addInstruction}
                                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                            >
                                Add Instruction
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Save Recipe
                        </button>
                    </div>
                </form>
            </div>

            {/* Sub-Modals */}
            <AddCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />

            <AddCuisineModal
                isOpen={isCuisineModalOpen}
                onClose={() => setIsCuisineModalOpen(false)}
            />

            <AddIngredientModal
                isOpen={isIngredientModalOpen}
                onClose={() => setIsIngredientModalOpen(false)}
            />

            <AddTagModal
                isOpen={isTagModalOpen}
                onClose={() => setIsTagModalOpen(false)}
            />
        </div>
    );
};

export default AddRecipeModal;