import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, Trash2, Edit } from 'lucide-react';
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from '../redux/store';
import {
    fetchCategories,
    fetchCuisines,
    fetchIngredients,
    fetchTags,
    updateRecipe,
    getRecipeById,
    type Recipe
} from '../redux/slices/recipeSlice';
import AddCategoryModal from './AddCategoryModal';
import AddCuisineModal from './AddCuisineModal';
import AddIngredientModal from './AddIngredientModal';
import AddTagModal from './AddTagModal';
import IngredientSelectorUnitModal from './IngredientSelectorUnitModal';

interface EditRecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipe: Recipe | null;
}

interface Instruction {
    title: string;
    images: string[];
    subTitle: string[];
}

interface IngredientWithDetails {
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
}

interface TagSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (tags: string[]) => void;
    selectedTags: string[];
    tags: Array<{ _id: string; name: string }>;
}

const TagSelectorModal: React.FC<TagSelectorModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    selectedTags = [],
    tags
}) => {
    const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags);
    const [searchTerm, setSearchTerm] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);

    // Reset local state when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalSelectedTags([...selectedTags]);
        }
    }, [isOpen, selectedTags]);

    // Effect for clicking outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleTagToggle = (tagId: string) => {
        setLocalSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(item => item !== tagId)
                : [...prev, tagId]
        );
    };

    const handleApply = () => {
        onSelect(localSelectedTags);
        onClose();
    };

    const handleClear = () => {
        setLocalSelectedTags([]);
    };

    // Filter tags by search term
    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative max-h-[600px] flex flex-col">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-4">Chọn thẻ (Tags)</h2>

                {/* Search bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tìm thẻ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                </div>

                {/* Tags list */}
                <div className="flex-grow overflow-y-auto mb-4 max-h-[300px]">
                    {filteredTags.length > 0 ? (
                        <div className="space-y-2">
                            {filteredTags.map(tag => (
                                <div key={tag._id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`tag-${tag._id}`}
                                        checked={localSelectedTags.includes(tag._id)}
                                        onChange={() => handleTagToggle(tag._id)}
                                        className="mr-3 rounded focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                                    />
                                    <label htmlFor={`tag-${tag._id}`} className="text-sm text-gray-700 cursor-pointer">
                                        {tag.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center pt-4">Không tìm thấy thẻ nào</p>
                    )}
                </div>

                {/* Selected count and actions */}
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Đã chọn: <span className="font-medium">{localSelectedTags.length}</span> thẻ
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleClear}
                            disabled={localSelectedTags.length === 0}
                            className={`px-4 py-2 border rounded-lg ${localSelectedTags.length === 0
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Xóa tất cả
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EditRecipeModal: React.FC<EditRecipeModalProps> = ({ isOpen, onClose, recipe }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { categories, cuisines, ingredients, tags } = useSelector(
        (state: RootState) => state.recipes
    );

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isCuisineModalOpen, setIsCuisineModalOpen] = useState(false);
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isIngredientSelectorOpen, setIsIngredientSelectorOpen] = useState(false);
    const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);
    const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Upload mode states
    const [mainImageMode, setMainImageMode] = useState<'file' | 'url'>('file');
    const [stepImageMode, setStepImageMode] = useState<'file' | 'url'>('file');

    const [editedRecipe, setEditedRecipe] = useState({
        name: "",
        ingredients: [] as string[],
        ingredientsWithDetails: [] as IngredientWithDetails[],
        tags: [] as string[],
        short: "",
        instructions: [] as Instruction[],
        image: "",
        video: "video.mp4",
        calories: 1,
        time: 1,
        size: 1,
        difficulty: "",
        cuisine: "",
        category: "",
        rate: 0,
        numberOfRate: 0,
    });

    const [currentInstruction, setCurrentInstruction] = useState<Instruction>({
        title: "",
        images: [],
        subTitle: [""],
    });

    // Initialize form data when recipe changes
    useEffect(() => {
        if (recipe && isOpen) {
            // Sử dụng ingredientsWithDetails từ backend nếu có, nếu không thì tạo mới với giá trị mặc định
            const ingredientsWithDetails = recipe.ingredientsWithDetails && recipe.ingredientsWithDetails.length > 0
                ? recipe.ingredientsWithDetails
                : recipe.ingredients?.map(ing => ({
                    ingredientId: ing._id,
                    name: ing.name,
                    quantity: 1,
                    unit: 'gram'
                })) || [];
            
            setEditedRecipe({
                name: recipe.name || "",
                ingredients: recipe.ingredients?.map(ing => ing._id) || [],
                ingredientsWithDetails: ingredientsWithDetails,
                tags: recipe.tags?.map(tag => tag._id) || [],
                short: recipe.short || "",
                instructions: recipe.instructions || [],
                image: recipe.image || "",
                video: "video.mp4",
                calories: recipe.calories || 1,
                time: recipe.time || 1,
                size: recipe.size || 1,
                difficulty: recipe.difficulty || "",
                cuisine: recipe.cuisine?._id || "",
                category: recipe.category?._id || "",
                rate: recipe.rate || 0,
                numberOfRate: recipe.numberOfRate || 0,
            });
        }
    }, [recipe, isOpen]);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchCategories());
            dispatch(fetchCuisines());
            dispatch(fetchIngredients());
            dispatch(fetchTags());
        }
    }, [dispatch, isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setEditedRecipe((prev) => ({
            ...prev,
            [name]: ["calories", "time", "size"].includes(name)
                ? Number(value)
                : value,
        }));
    };

    const handleSubtitleChange = (index: number, value: string) => {
        const updated = [...currentInstruction.subTitle];
        updated[index] = value;
        setCurrentInstruction({ ...currentInstruction, subTitle: updated });
    };

    const addSubtitle = () =>
        setCurrentInstruction((prev) => ({
            ...prev,
            subTitle: [...prev.subTitle, ""],
        }));

    const removeSubtitle = (index: number) =>
        setCurrentInstruction((prev) => ({
            ...prev,
            subTitle: prev.subTitle.filter((_, i) => i !== index),
        }));

    const addInstruction = () => {
        if (
            currentInstruction.title &&
            currentInstruction.subTitle.some((s) => s.trim() !== "")
        ) {
            setEditedRecipe((prev) => ({
                ...prev,
                instructions: [...prev.instructions, { ...currentInstruction }],
            }));
            setCurrentInstruction({ title: "", images: [], subTitle: [""] });
        }
    };

    const removeInstruction = (index: number) =>
        setEditedRecipe((prev) => ({
            ...prev,
            instructions: prev.instructions.filter((_, i) => i !== index),
        }));

    const editInstruction = (index: number) => {
        const instruction = editedRecipe.instructions[index];
        setCurrentInstruction({ ...instruction });
        removeInstruction(index);
    };

    const handleIngredientSelect = (selectedIngredients: string[], ingredientDetails: Record<string, { quantity: number; unit: string }>) => {
        // Convert ingredient names to IDs and create details array
        const ingredientIds: string[] = [];
        const ingredientsWithDetails: IngredientWithDetails[] = [];
        
        selectedIngredients.forEach(ingredientName => {
            const ingredient = ingredients.find(ing => ing.name === ingredientName);
            if (ingredient) {
                ingredientIds.push(ingredient._id);
                ingredientsWithDetails.push({
                    ingredientId: ingredient._id,
                    name: ingredient.name,
                    quantity: ingredientDetails[ingredientName]?.quantity || 1,
                    unit: ingredientDetails[ingredientName]?.unit || 'gram'
                });
            }
        });

        setEditedRecipe((prev) => ({
            ...prev,
            ingredients: ingredientIds,
            ingredientsWithDetails: ingredientsWithDetails,
        }));
    };

    const handleTagSelect = (selectedTags: string[]) => {
        setEditedRecipe((prev) => ({
            ...prev,
            tags: selectedTags,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipe) return;

        // Validation checks
        if (editedRecipe.calories <= 0) {
            toast.error("Calo phải lớn hơn 0", { duration: 3000 });
            return;
        }
        
        if (editedRecipe.time <= 0) {
            toast.error("Thời gian nấu phải lớn hơn 0", { duration: 3000 });
            return;
        }
        
        if (!Number.isInteger(editedRecipe.size) || editedRecipe.size <= 0) {
            toast.error("Khẩu phần phải là số nguyên và lớn hơn 0", { duration: 3000 });
            return;
        }
        
        if (editedRecipe.ingredients.length === 0) {
            toast.error("Vui lòng chọn tối thiểu 1 nguyên liệu", { duration: 3000 });
            return;
        }
        
        if (editedRecipe.tags.length === 0) {
            toast.error("Vui lòng chọn tối thiểu 1 thẻ", { duration: 3000 });
            return;
        }
        
        if (editedRecipe.instructions.length === 0) {
            toast.error("Hướng dẫn nấu ăn phải có tối thiểu 1 bước", { duration: 3000 });
            return;
        }
        
        if (!editedRecipe.difficulty) {
            toast.error("Vui lòng chọn độ khó", { duration: 3000 });
            return;
        }
        
        if (!editedRecipe.category) {
            toast.error("Vui lòng chọn danh mục", { duration: 3000 });
            return;
        }
        
        if (!editedRecipe.cuisine) {
            toast.error("Vui lòng chọn ẩm thực", { duration: 3000 });
            return;
        }

        setUpdateConfirmOpen(true);
    };

    const handleUpdateConfirm = async () => {
        if (!recipe) return;

        setIsSubmitting(true);
        try {
            const recipeData = {
                ...editedRecipe,
                video: "video.mp4",
            };
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await dispatch(updateRecipe({ id: recipe._id, recipe: recipeData as any })).unwrap();
            toast.success("Cập nhật công thức thành công!", { duration: 2500 });
            
            // Fetch lại recipe vừa cập nhật để có đầy đủ thông tin (cuisine, category populated)
            await dispatch(getRecipeById(recipe._id));
            
            setUpdateConfirmOpen(false);
            onClose();
        } catch (error: any) {
            console.error("Failed to update recipe:", error);
            const errorMessage = error?.message || error || 'Cập nhật công thức thất bại. Vui lòng thử lại.';
            toast.error(errorMessage, { duration: 3000 });
            setUpdateConfirmOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateCancel = () => {
        setUpdateConfirmOpen(false);
    };

    if (!isOpen || !recipe) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20 p-4">
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-orange-200 flex flex-col max-h-[90vh]">

                {/* Header cố định */}
                <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-t-2xl sticky top-0 z-10">
                    <h2 className="text-lg font-semibold">Chỉnh sửa công thức: {recipe.name}</h2>
                    <button onClick={onClose} className="hover:scale-110 transition">
                        <X size={22} />
                    </button>
                </div>

                {/* Nội dung có thể cuộn */}
                <div className="overflow-y-auto p-6 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ==== Thông tin cơ bản ==== */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">
                                Thông tin cơ bản
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    name="name"
                                    placeholder="Tên món ăn"
                                    value={editedRecipe.name}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                <select
                                    name="difficulty"
                                    value={editedRecipe.difficulty}
                                    onChange={handleInputChange}
                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                >
                                    <option value="">Chọn độ khó</option>
                                    <option value="Dễ">Dễ</option>
                                    <option value="Trung bình">Trung bình</option>
                                    <option value="Khó">Khó</option>
                                </select>
                            </div>
                            <textarea
                                name="short"
                                placeholder="Mô tả ngắn..."
                                value={editedRecipe.short}
                                onChange={handleInputChange}
                                className="border rounded-lg p-2 w-full mt-3 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* ==== Hình ảnh & Video ==== */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">
                                Hình ảnh & Video
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Upload ảnh */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Ảnh minh hoạ
                                    </label>

                                    {/* Chọn mode upload */}
                                    <div className="flex gap-2 mb-2">
                                        <button
                                            type="button"
                                            onClick={() => setMainImageMode('file')}
                                            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                                                mainImageMode === 'file'
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                             Upload
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMainImageMode('url')}
                                            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                                                mainImageMode === 'url'
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                             URL
                                        </button>
                                    </div>

                                    {/* Upload file hoặc nhập URL */}
                                    {mainImageMode === 'file' ? (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        const result = event.target?.result as string;
                                                        setEditedRecipe(prev => ({ ...prev, image: result }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent p-2"
                                        />
                                    ) : (
                                        <input
                                            type="url"
                                            placeholder="https://example.com/image.jpg"
                                            value={editedRecipe.image}
                                            onChange={(e) =>
                                                setEditedRecipe(prev => ({ ...prev, image: e.target.value }))
                                            }
                                            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                        />
                                    )}

                                    {/* Preview ảnh */}
                                    {editedRecipe.image && (
                                        <div className="mt-3 relative">
                                            <img
                                                src={editedRecipe.image}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setEditedRecipe(prev => ({ ...prev, image: '' }))}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ==== Thông số dinh dưỡng ==== */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">Thông số (Số)</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Calories
                                    </label>
                                    <input
                                        name="calories"
                                        type="number"
                                        value={editedRecipe.calories}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Thời gian (phút)
                                    </label>
                                    <input
                                        name="time"
                                        type="number"
                                        value={editedRecipe.time}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Khẩu phần
                                    </label>
                                    <input
                                        name="size"
                                        type="number"
                                        value={editedRecipe.size}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ==== Danh mục & Ẩm thực ==== */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-md font-semibold text-gray-700 mb-2">Danh mục</h3>
                                <div className="flex gap-2">
                                    <select
                                        name="category"
                                        value={editedRecipe.category}
                                        onChange={handleInputChange}
                                        className="border rounded-lg p-2 flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryModalOpen(true)}
                                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-md font-semibold text-gray-700 mb-2">Ẩm thực</h3>
                                <div className="flex gap-2">
                                    <select
                                        name="cuisine"
                                        value={editedRecipe.cuisine}
                                        onChange={handleInputChange}
                                        className="border rounded-lg p-2 flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
                                    >
                                        <option value="">Chọn ẩm thực</option>
                                        {cuisines.map((cuisine) => (
                                            <option key={cuisine._id} value={cuisine._id}>
                                                {cuisine.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsCuisineModalOpen(true)}
                                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ==== Nguyên liệu ==== */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">
                                Nguyên liệu ({editedRecipe.ingredients.length})
                            </h3>

                            <div>
                                <button
                                    type="button"
                                    onClick={() => setIsIngredientSelectorOpen(true)}
                                    className="w-full border rounded-lg p-3 text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none transition-colors relative mb-2"
                                >
                                    <span className={editedRecipe.ingredients.length > 0 ? "text-gray-800" : "text-gray-400"}>
                                        {editedRecipe.ingredients.length > 0 && editedRecipe.ingredientsWithDetails.length > 0
                                            ? editedRecipe.ingredientsWithDetails.map((ing) => 
                                                `${ing.name} (${ing.quantity} ${ing.unit})`
                                              ).join(', ')
                                            : "Chọn nguyên liệu..."
                                        }
                                    </span>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsIngredientModalOpen(true)}
                                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                                >
                                    Thêm nguyên liệu mới
                                </button>
                            </div>
                        </div>

                        {/* ==== Tags ==== */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">
                                Thẻ ({editedRecipe.tags.length})
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {editedRecipe.tags.map((tagId) => {
                                    const tag = tags.find(t => t._id === tagId);
                                    return tag ? (
                                        <span
                                            key={tagId}
                                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {tag.name}
                                        </span>
                                    ) : null;
                                })}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsTagSelectorOpen(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Chọn thẻ
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsTagModalOpen(true)}
                                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                                >
                                    Thêm thẻ mới
                                </button>
                            </div>
                        </div>

                        {/* ==== Hướng dẫn nấu ăn ==== */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">
                                Hướng dẫn nấu ăn
                            </h3>

                            {/* Danh sách các bước đã thêm */}
                            {editedRecipe.instructions.map((instruction, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg p-3 mb-3 bg-gray-50 flex justify-between items-start"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">Bước {index + 1}: {instruction.title}</p>
                                        {instruction.images && instruction.images.length > 0 && (
                                            <div className="flex flex-wrap gap-2 my-2">
                                                {instruction.images.map((img, imgIndex) => (
                                                    <div key={imgIndex} className="relative w-32 h-24">
                                                        <img
                                                            src={img}
                                                            alt={`Instruction ${index + 1} - ${imgIndex + 1}`}
                                                            className="w-full h-full object-cover rounded-lg border"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <ul className="list-disc ml-5 text-sm text-gray-600">
                                            {instruction.subTitle.map((sub, subIndex) => (
                                                <li key={subIndex}>{sub}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex gap-2 ml-3">
                                        <button
                                            type="button"
                                            onClick={() => editInstruction(index)}
                                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeInstruction(index)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Form thêm/chỉnh sửa bước */}
                            <div className="border rounded-lg p-4 bg-blue-50">
                                <input
                                    type="text"
                                    placeholder="Tiêu đề bước..."
                                    value={currentInstruction.title}
                                    onChange={(e) =>
                                        setCurrentInstruction({
                                            ...currentInstruction,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Hình ảnh bước (tùy chọn, tối đa 4 ảnh)
                                    </label>

                                    {/* Chọn mode upload cho step */}
                                    <div className="flex gap-2 mb-2">
                                        <button
                                            type="button"
                                            onClick={() => setStepImageMode('file')}
                                            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                                                stepImageMode === 'file'
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                             Upload từ máy
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStepImageMode('url')}
                                            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                                                stepImageMode === 'url'
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                             URL
                                        </button>
                                    </div>

                                    {/* Upload file hoặc nhập URL */}
                                    {stepImageMode === 'file' ? (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            disabled={currentInstruction.images.length >= 4}
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                if (files.length + currentInstruction.images.length > 4) {
                                                    toast.error("Chỉ được chọn tối đa 4 ảnh mỗi bước!");
                                                    return;
                                                }

                                                Promise.all(
                                                    files.map(file => {
                                                        return new Promise<string>((resolve) => {
                                                            const reader = new FileReader();
                                                            reader.onload = (event) => resolve(event.target?.result as string);
                                                            reader.readAsDataURL(file);
                                                        });
                                                    })
                                                ).then((newImages) => {
                                                    setCurrentInstruction(prev => ({
                                                        ...prev,
                                                        images: [...prev.images, ...newImages],
                                                    }));
                                                });
                                            }}
                                            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    ) : (
                                        <div className="space-y-2">
                                            <input
                                                type="url"
                                                placeholder="https://example.com/step-image.jpg"
                                                disabled={currentInstruction.images.length >= 4}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const input = e.currentTarget;
                                                        const url = input.value.trim();
                                                        if (url && currentInstruction.images.length < 4) {
                                                            setCurrentInstruction((prev) => ({
                                                                ...prev,
                                                                images: [...prev.images, url],
                                                            }));
                                                            input.value = '';
                                                        }
                                                    }
                                                }}
                                                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                            <p className="text-xs text-gray-500">
                                                💡 Nhấn Enter để thêm URL ảnh
                                            </p>
                                        </div>
                                    )}

                                    {/* Preview ảnh instruction */}
                                    {currentInstruction.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {currentInstruction.images.map((img, index) => (
                                                <div key={index} className="relative w-32 h-24">
                                                    <img
                                                        src={img}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setCurrentInstruction(prev => ({
                                                                ...prev,
                                                                images: prev.images.filter((_, i) => i !== index),
                                                            }))
                                                        }
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Thông báo nếu đạt giới hạn 4 ảnh */}
                                    {currentInstruction.images.length >= 4 && (
                                        <p className="text-sm text-orange-500 mt-2">
                                            ⚠️ Đã đạt giới hạn 4 ảnh cho mỗi bước.
                                        </p>
                                    )}

                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Chi tiết các bước:
                                    </label>
                                    {currentInstruction.subTitle.map((sub, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={`Chi tiết ${index + 1}...`}
                                                value={sub}
                                                onChange={(e) =>
                                                    handleSubtitleChange(index, e.target.value)
                                                }
                                                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
                                            />
                                            {currentInstruction.subTitle.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSubtitle(index)}
                                                    className="px-3 py-2 text-red-600 hover:bg-red-100 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    <div className="flex gap-2 mt-3">
                                        <button
                                            type="button"
                                            onClick={addSubtitle}
                                            className="px-3 py-2 text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                                        >
                                            + Thêm chi tiết
                                        </button>
                                        <button
                                            type="button"
                                            onClick={addInstruction}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            {currentInstruction.title ? "Cập nhật bước" : "Thêm bước"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ==== Submit buttons ==== */}
                        <div className="flex justify-end gap-3 pb-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg"
                            >
                                Cập nhật công thức
                            </button>
                        </div>
                    </form>
                </div>

                {/* Modal phụ */}
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
                <IngredientSelectorUnitModal
                    isOpen={isIngredientSelectorOpen}
                    onClose={() => setIsIngredientSelectorOpen(false)}
                    onSelect={handleIngredientSelect}
                    selectedIngredients={editedRecipe.ingredients.map(ingredientId => {
                        const ingredient = ingredients.find(ing => ing._id === ingredientId);
                        return ingredient ? ingredient.name : '';
                    }).filter(Boolean)}
                    existingIngredientDetails={editedRecipe.ingredientsWithDetails.reduce((acc, ing) => {
                        acc[ing.name] = { quantity: ing.quantity, unit: ing.unit };
                        return acc;
                    }, {} as Record<string, { quantity: number; unit: string }>)}
                />
                <TagSelectorModal
                    isOpen={isTagSelectorOpen}
                    onClose={() => setIsTagSelectorOpen(false)}
                    onSelect={handleTagSelect}
                    selectedTags={editedRecipe.tags}
                    tags={tags}
                />

                {/* Update Confirmation Modal */}
                {updateConfirmOpen && (
                    <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
                                <Edit className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Xác nhận cập nhật công thức
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                                Bạn có chắc chắn muốn cập nhật công thức "{recipe?.name}"?
                                Tất cả thay đổi sẽ được lưu lại.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleUpdateCancel}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleUpdateConfirm}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang cập nhật...
                                        </>
                                    ) : (
                                        'Cập nhật'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditRecipeModal;