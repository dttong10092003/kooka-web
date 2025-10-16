import React, { useEffect, useState, useRef, useCallback } from "react";
import { X, CheckSquare, Square } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    addRecipe,
    updateRecipe,
    fetchCategories,
    fetchCuisines,
    fetchIngredients,
    fetchTags,
} from "../redux/slices/recipeSlice";
import type { Recipe } from "../redux/slices/recipeSlice";
import type { RootState, AppDispatch } from "../redux/store";
import AddCategoryModal from "./AddCategoryModal";
import AddCuisineModal from "./AddCuisineModal";
import AddIngredientModal from "./AddIngredientModal";
import AddTagModal from "./AddTagModal";
import IngredientSelectorModal from "./IngredientSelectorModal";
import toast from "react-hot-toast";

interface AddRecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    editRecipe?: Recipe | null; // Recipe để edit, null/undefined = add mode
}

interface Instruction {
    title: string;
    image: string;
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
                                    <button
                                        className="flex items-center w-full hover:bg-gray-50 p-2 rounded-lg"
                                        onClick={() => handleTagToggle(tag._id)}
                                    >
                                        {localSelectedTags.includes(tag._id) ? (
                                            <CheckSquare className="w-5 h-5 text-blue-500 mr-2" />
                                        ) : (
                                            <Square className="w-5 h-5 text-gray-400 mr-2" />
                                        )}
                                        <span>{tag.name}</span>
                                    </button>
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

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ isOpen, onClose, editRecipe }) => {
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

    const getInitialRecipe = useCallback(() => {
        if (editRecipe) {
            return {
                name: editRecipe.name,
                ingredients: editRecipe.ingredients.map(ing => ing._id),
                tags: editRecipe.tags.map(tag => tag._id),
                short: editRecipe.short,
                instructions: editRecipe.instructions,
                image: editRecipe.image,
                video: editRecipe.video,
                calories: editRecipe.calories,
                time: editRecipe.time,
                size: editRecipe.size,
                difficulty: editRecipe.difficulty,
                cuisine: editRecipe.cuisine?._id || "",
                category: editRecipe.category?._id || "",
                rate: editRecipe.rate,
                numberOfRate: editRecipe.numberOfRate,
            };
        }
        return {
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
        };
    }, [editRecipe]);

    const [recipe, setRecipe] = useState(getInitialRecipe());

    const [currentInstruction, setCurrentInstruction] = useState<Instruction>({
        title: "",
        image: "",
        subTitle: [""],
    });

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCuisines());
        dispatch(fetchIngredients());
        dispatch(fetchTags());
    }, [dispatch]);

    // Reset recipe khi editRecipe hoặc isOpen thay đổi
    useEffect(() => {
        if (isOpen) {
            setRecipe(getInitialRecipe());
        }
    }, [getInitialRecipe, isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({
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
            setRecipe((prev) => ({
                ...prev,
                instructions: [...prev.instructions, { ...currentInstruction }],
            }));
            setCurrentInstruction({ title: "", image: "", subTitle: [""] });
        }
    };

    const removeInstruction = (index: number) =>
        setRecipe((prev) => ({
            ...prev,
            instructions: prev.instructions.filter((_, i) => i !== index),
        }));

    const handleIngredientSelect = (selectedIngredients: string[]) => {
        // Convert ingredient names to IDs
        const ingredientIds = selectedIngredients.map(ingredientName => {
            const ingredient = ingredients.find(ing => ing.name === ingredientName);
            return ingredient ? ingredient._id : null;
        }).filter(Boolean) as string[];

        setRecipe((prev) => ({
            ...prev,
            ingredients: ingredientIds,
        }));
    };

    const handleTagSelect = (selectedTags: string[]) => {
        setRecipe((prev) => ({
            ...prev,
            tags: selectedTags,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editRecipe) {
                // Edit mode - Use original recipe structure for update
                await dispatch(updateRecipe({ 
                    id: editRecipe._id, 
                    recipe: recipe as any // Backend expects the current recipe format
                })).unwrap();
                toast.success("Cập nhật công thức thành công!", { duration: 2500 });
            } else {
                // Add mode - Use recipe as is for new creation
                await dispatch(addRecipe(recipe as any)).unwrap();
                toast.success("Thêm công thức thành công!", { duration: 2500 });
            }
            onClose();
        } catch (error) {
            console.error("Failed to save recipe:", error);
            toast.error(
                editRecipe 
                    ? "Cập nhật công thức thất bại. Vui lòng thử lại." 
                    : "Thêm công thức thất bại. Vui lòng thử lại.", 
                { duration: 2500 }
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20 p-4">
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-orange-200 flex flex-col max-h-[90vh]">

                {/* Header cố định */}
                <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-t-2xl sticky top-0 z-10">
                    <h2 className="text-lg font-semibold">
                        {editRecipe ? "Chỉnh sửa công thức" : "Thêm công thức mới"}
                    </h2>
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
                                    value={recipe.name}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                                />
                                <div className="relative">
                                    <select
                                        name="difficulty"
                                        value={recipe.difficulty}
                                        onChange={handleInputChange}
                                        required
                                        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none appearance-none"
                                    >
                                        <option value="">Độ khó</option>
                                        <option value="Dễ">Dễ</option>
                                        <option value="Trung bình">Trung bình</option>
                                        <option value="Khó">Khó</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <textarea
                                name="short"
                                placeholder="Mô tả ngắn..."
                                value={recipe.short}
                                onChange={handleInputChange}
                                className="border rounded-lg p-2 w-full mt-3 focus:ring-2 focus:ring-orange-400 outline-none"
                            />
                        </div>

                        {/* ==== Hình ảnh & Video ==== */}
                        {/* <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">
                                Hình ảnh & Video
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    name="image"
                                    placeholder="URL hình ảnh"
                                    value={recipe.image}
                                    onChange={handleInputChange}
                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                                />
                                <input
                                    name="video"
                                    placeholder="URL video (tuỳ chọn)"
                                    value={recipe.video}
                                    onChange={handleInputChange}
                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                                />
                            </div>
                        </div> */}

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

                                    {/* Ô chọn file */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setRecipe((prev) => ({
                                                        ...prev,
                                                        image: reader.result as string, // base64 string
                                                    }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-orange-400 focus:border-transparent p-2"
                                    />

                                    {/* Hiển thị preview ảnh */}
                                    {recipe.image && (
                                        <div className="mt-3 relative">
                                            <img
                                                src={recipe.image}
                                                alt="Preview"
                                                className="w-full h-40 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setRecipe((prev) => ({ ...prev, image: "" }))
                                                }
                                                className="absolute top-2 right-2 bg-white/70 hover:bg-white text-red-500 rounded-full p-1 shadow"
                                            >
                                                <X size={16} />
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
                                        value={recipe.video}
                                        onChange={handleInputChange}
                                        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* ==== Calories / Time / Size ==== */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">
                                Thông số (Số)
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Calories
                                    </label>
                                    <input
                                        type="number"
                                        name="calories"
                                        value={recipe.calories}
                                        onChange={handleInputChange}
                                        min={0}
                                        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Thời gian (phút)
                                    </label>
                                    <input
                                        type="number"
                                        name="time"
                                        value={recipe.time}
                                        onChange={handleInputChange}
                                        min={0}
                                        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Khẩu phần
                                    </label>
                                    <input
                                        type="number"
                                        name="size"
                                        value={recipe.size}
                                        onChange={handleInputChange}
                                        min={1}
                                        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ==== Phân loại ==== */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="font-medium text-gray-700">Danh mục</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryModalOpen(true)}
                                        className="text-orange-500 text-sm hover:underline"
                                    >
                                        + Thêm mới
                                    </button>
                                </div>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={recipe.category}
                                        onChange={handleInputChange}
                                        required
                                        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none appearance-none"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="font-medium text-gray-700">Ẩm thực</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsCuisineModalOpen(true)}
                                        className="text-orange-500 text-sm hover:underline"
                                    >
                                        + Thêm mới
                                    </button>
                                </div>
                                <div className="relative">
                                    <select
                                        name="cuisine"
                                        value={recipe.cuisine}
                                        onChange={handleInputChange}
                                        required
                                        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none appearance-none"
                                    >
                                        <option value="">Chọn ẩm thực</option>
                                        {cuisines.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ==== Nguyên liệu ==== */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="font-medium text-gray-700">Nguyên liệu</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsIngredientModalOpen(true)}
                                        className="text-orange-500 text-sm hover:underline"
                                    >
                                        + Thêm mới
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRecipe((prev) => ({ ...prev, ingredients: [] }));
                                        }}
                                        className="text-sm text-gray-500 hover:underline"
                                    >
                                        Xóa tất cả
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsIngredientSelectorOpen(true)}
                                className="w-full border rounded-lg p-3 text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none transition-colors relative"
                            >
                                <div className="flex justify-between items-center">
                                    <span className={recipe.ingredients.length > 0 ? "text-gray-800" : "text-gray-400"}>
                                        {recipe.ingredients.length > 0
                                            ? (() => {
                                                const ingredientNames = recipe.ingredients.map(ingredientId => {
                                                    const ingredient = ingredients.find(ing => ing._id === ingredientId);
                                                    return ingredient ? ingredient.name : '';
                                                }).filter(Boolean);

                                                return ingredientNames.length > 0 ? ingredientNames.join(', ') : `Đã chọn ${recipe.ingredients.length} nguyên liệu`;
                                            })()
                                            : "Chọn nguyên liệu..."
                                        }
                                    </span>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        {/* ==== Tags ==== */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="font-medium text-gray-700">Thẻ (Tags)</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsTagModalOpen(true)}
                                        className="text-orange-500 text-sm hover:underline"
                                    >
                                        + Thêm mới
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRecipe((prev) => ({ ...prev, tags: [] }))}
                                        className="text-sm text-gray-500 hover:underline"
                                    >
                                        Xóa tất cả
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsTagSelectorOpen(true)}
                                className="w-full border rounded-lg p-3 text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none transition-colors relative"
                            >
                                <div className="flex justify-between items-center">
                                    <span className={recipe.tags.length > 0 ? "text-gray-800" : "text-gray-400"}>
                                        {recipe.tags.length > 0
                                            ? recipe.tags.map(tagId => {
                                                const tag = tags.find(t => t._id === tagId);
                                                return tag ? tag.name : '';
                                            }).filter(Boolean).join(', ')
                                            : "Chọn thẻ..."
                                        }
                                    </span>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        {/* ==== Hướng dẫn ==== */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">
                                Hướng dẫn nấu ăn
                            </h3>

                            {/* Danh sách hướng dẫn đã thêm */}
                            {recipe.instructions.map((ins, i) => (
                                <div
                                    key={i}
                                    className="border rounded-lg p-3 mb-3 bg-gray-50 flex justify-between items-start"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{ins.title}</p>
                                        {ins.image && (
                                            <img
                                                src={ins.image}
                                                alt={ins.title}
                                                className="w-40 h-28 object-cover rounded-lg my-2 border"
                                            />
                                        )}
                                        <ul className="list-disc ml-5 text-sm text-gray-600">
                                            {ins.subTitle.map((s, j) => (
                                                <li key={j}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeInstruction(i)}
                                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition ml-3"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}

                            {/* Form thêm hướng dẫn mới */}
                            <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                                <input
                                    placeholder="Tên bước"
                                    value={currentInstruction.title}
                                    onChange={(e) =>
                                        setCurrentInstruction({
                                            ...currentInstruction,
                                            title: e.target.value,
                                        })
                                    }
                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                                />

                                {/* <input
                                    placeholder="URL hình ảnh minh họa"
                                    value={currentInstruction.image}
                                    onChange={(e) =>
                                        setCurrentInstruction({
                                            ...currentInstruction,
                                            image: e.target.value,
                                        })
                                    }
                                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                                /> */}

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Ảnh minh hoạ bước nấu (tuỳ chọn)
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setCurrentInstruction((prev) => ({
                                                        ...prev,
                                                        image: reader.result as string, // base64
                                                    }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-orange-400 focus:border-transparent p-2"
                                    />

                                    {currentInstruction.image && (
                                        <div className="mt-3 relative inline-block">
                                            <img
                                                src={currentInstruction.image}
                                                alt="Preview step"
                                                className="w-40 h-28 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentInstruction((prev) => ({ ...prev, image: "" }))
                                                }
                                                className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 rounded-full p-1 shadow-md transition"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>


                                {currentInstruction.subTitle.map((sub, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            value={sub}
                                            placeholder={`Bước ${idx + 1}`}
                                            onChange={(e) => handleSubtitleChange(idx, e.target.value)}
                                            className="border rounded-lg p-2 flex-1 focus:ring-2 focus:ring-orange-400 outline-none"
                                        />
                                        {idx > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSubtitle(idx)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <div className="flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={addSubtitle}
                                        className="text-orange-500 text-sm hover:underline"
                                    >
                                        + Thêm bước phụ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addInstruction}
                                        className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-1 rounded-lg hover:opacity-90"
                                    >
                                        Lưu hướng dẫn
                                    </button>
                                </div>
                            </div>
                        </div>


                        {/* ==== Submit ==== */}
                        <div className="flex justify-end gap-3 pb-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                Huỷ
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:opacity-90"
                            >
                                {editRecipe ? "Cập nhật" : "Lưu công thức"}
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
                    selectedIngredients={recipe.ingredients.map(ingredientId => {
                        const ingredient = ingredients.find(ing => ing._id === ingredientId);
                        return ingredient ? ingredient.name : '';
                    }).filter(Boolean)}
                />
                <TagSelectorModal
                    isOpen={isTagSelectorOpen}
                    onClose={() => setIsTagSelectorOpen(false)}
                    onSelect={handleTagSelect}
                    selectedTags={recipe.tags}
                    tags={tags}
                />
            </div>
        </div>
    );
};

export default AddRecipeModal;