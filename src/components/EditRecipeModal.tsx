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
    type Recipe
} from '../redux/slices/recipeSlice';
import AddCategoryModal from './AddCategoryModal';
import AddCuisineModal from './AddCuisineModal';
import AddIngredientModal from './AddIngredientModal';
import AddTagModal from './AddTagModal';
import IngredientSelectorModal from './IngredientSelectorModal';

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

    const [editedRecipe, setEditedRecipe] = useState({
        name: "",
        ingredients: [] as string[],
        tags: [] as string[],
        short: "",
        instructions: [] as Instruction[],
        image: "",
        video: "",
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
            setEditedRecipe({
                name: recipe.name || "",
                ingredients: recipe.ingredients?.map(ing => ing._id) || [],
                tags: recipe.tags?.map(tag => tag._id) || [],
                short: recipe.short || "",
                instructions: recipe.instructions || [],
                image: recipe.image || "",
                video: recipe.video || "",
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

    const handleIngredientSelect = (selectedIngredients: string[]) => {
        // Convert ingredient names to IDs
        const ingredientIds = selectedIngredients.map(ingredientName => {
            const ingredient = ingredients.find(ing => ing.name === ingredientName);
            return ingredient ? ingredient._id : null;
        }).filter(Boolean) as string[];

        setEditedRecipe((prev) => ({
            ...prev,
            ingredients: ingredientIds,
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
        setUpdateConfirmOpen(true);
    };

    const handleUpdateConfirm = async () => {
        if (!recipe) return;

        try {
            console.log("Updating recipe with data:", editedRecipe);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await dispatch(updateRecipe({ id: recipe._id, recipe: editedRecipe as any })).unwrap();
            toast.success("Cập nhật công thức thành công!", { duration: 2500 });
            setUpdateConfirmOpen(false);
            onClose();
        } catch (error) {
            console.error("Failed to update recipe:", error);
            console.error("Error details:", error);
            toast.error("Cập nhật công thức thất bại. Vui lòng thử lại.", { duration: 2500 });
            setUpdateConfirmOpen(false);
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

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Video (tuỳ chọn)
                                    </label>
                                    <input
                                        name="video"
                                        placeholder="URL video (tuỳ chọn)"
                                        value={editedRecipe.video}
                                        onChange={handleInputChange}
                                        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ==== Thông số dinh dưỡng ==== */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">Thông số</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <input
                                    name="calories"
                                    type="number"
                                    placeholder="Calories"
                                    value={editedRecipe.calories}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                <input
                                    name="time"
                                    type="number"
                                    placeholder="Thời gian (phút)"
                                    value={editedRecipe.time}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                <input
                                    name="size"
                                    type="number"
                                    placeholder="Khẩu phần"
                                    value={editedRecipe.size}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                                />
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
                            <div className="flex flex-wrap gap-2 mb-3">
                                {editedRecipe.ingredients.map((ingredientId) => {
                                    const ingredient = ingredients.find(ing => ing._id === ingredientId);
                                    return ingredient ? (
                                        <span
                                            key={ingredientId}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {ingredient.name}
                                        </span>
                                    ) : null;
                                })}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsIngredientSelectorOpen(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Chọn nguyên liệu
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
                                        Hình ảnh bước (tùy chọn)
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
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
                                        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent p-2"
                                    />


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
                <IngredientSelectorModal
                    isOpen={isIngredientSelectorOpen}
                    onClose={() => setIsIngredientSelectorOpen(false)}
                    onSelect={handleIngredientSelect}
                    selectedIngredients={editedRecipe.ingredients.map(ingredientId => {
                        const ingredient = ingredients.find(ing => ing._id === ingredientId);
                        return ingredient ? ingredient.name : '';
                    }).filter(Boolean)}
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
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleUpdateConfirm}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Cập nhật
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