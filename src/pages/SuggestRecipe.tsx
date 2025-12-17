import React, { useEffect, useState, useRef } from "react";
import { X, CheckSquare, Square } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchCategories,
    fetchCuisines,
    fetchIngredients,
    fetchTags,
} from "../redux/slices/recipeSlice";
import { createSubmission } from "../redux/slices/submissionSlice";
import type { RootState, AppDispatch } from "../redux/store";
import AddCategoryModal from "../components/AddCategoryModal";
import AddCuisineModal from "../components/AddCuisineModal";
import AddIngredientModal from "../components/AddIngredientModal";
import AddTagModal from "../components/AddTagModal";
import IngredientSelectorModal from "../components/IngredientSelectorModal";
import toast from "react-hot-toast";

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

    useEffect(() => {
        if (isOpen) {
            setLocalSelectedTags([...selectedTags]);
        }
    }, [isOpen, selectedTags]);

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

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative max-h-[600px] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-4">Chọn thẻ (Tags)</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tìm thẻ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                </div>

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

const SuggestRecipe: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { categories, cuisines, ingredients, tags } = useSelector(
        (state: RootState) => state.recipes
    );

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isCuisineModalOpen, setIsCuisineModalOpen] = useState(false);
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isIngredientSelectorOpen, setIsIngredientSelectorOpen] = useState(false);
    const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [mainImageMode, setMainImageMode] = useState<'file' | 'url'>('file');
    const [stepImageMode, setStepImageMode] = useState<'file' | 'url'>('file');

    const [recipe, setRecipe] = useState({
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

    const initialRecipeState = {
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
    };

    const initialInstructionState = {
        title: "",
        images: [],
        subTitle: [""],
    };

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCuisines());
        dispatch(fetchIngredients());
        dispatch(fetchTags());
    }, [dispatch]);

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
            setCurrentInstruction({ title: "", images: [], subTitle: [""] });
        }
    };

    const removeInstruction = (index: number) =>
        setRecipe((prev) => ({
            ...prev,
            instructions: prev.instructions.filter((_, i) => i !== index),
        }));

    const handleIngredientSelect = (selectedIngredients: string[], ingredientDetails: Record<string, { quantity: number; unit: string }>) => {
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

        setRecipe((prev) => ({
            ...prev,
            ingredients: ingredientIds,
            ingredientsWithDetails: ingredientsWithDetails,
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
        setIsSubmitting(true);
        try {
            // Validate form
            if (!recipe.name.trim()) {
                toast.error('Vui lòng nhập tên món ăn');
                return;
            }
            if (!recipe.category || !recipe.cuisine || !recipe.difficulty) {
                toast.error('Vui lòng chọn đầy đủ thông tin phân loại');
                return;
            }
            if (recipe.ingredients.length === 0) {
                toast.error('Vui lòng chọn ít nhất 1 nguyên liệu');
                return;
            }
            if (recipe.instructions.length === 0) {
                toast.error('Vui lòng thêm ít nhất 1 hướng dẫn');
                return;
            }

            // Transform ingredientsWithDetails to match API format
            const transformedIngredients = recipe.ingredientsWithDetails.map(detail => ({
                id: detail.ingredientId,
                quantity: detail.quantity,
                unit: detail.unit
            }));

            const submissionData = {
                name: recipe.name,
                short: recipe.short,
                difficulty: recipe.difficulty,
                time: recipe.time,
                size: recipe.size,
                calories: recipe.calories,
                image: recipe.image,
                video: recipe.video || undefined,
                ingredients: recipe.ingredients,
                tags: recipe.tags,
                cuisine: recipe.cuisine,
                category: recipe.category,
                ingredientsWithDetails: transformedIngredients,
                instructions: recipe.instructions,
            };

            await dispatch(createSubmission(submissionData)).unwrap();
            toast.success('Đề xuất món ăn đã được gửi! Chúng tôi sẽ xem xét và phê duyệt sớm.', { duration: 4000 });
            
            handleResetForm();
            
            // Navigate to my submissions page
            setTimeout(() => {
                navigate('/my-submissions');
            }, 1500);
        } catch (error: any) {
            const errorMessage = error?.message || error || 'Gửi đề xuất thất bại.';
            toast.error(errorMessage, { duration: 3000 });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetForm = () => {
        setRecipe(initialRecipeState);
        setCurrentInstruction(initialInstructionState);
        setMainImageMode('file');
        setStepImageMode('file');
    };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-orange-200">
      {/* Header với gradient */}
      <div className="px-6 py-5 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-t-2xl">
        <h2 className="text-2xl font-bold">
          Đề Xuất Món Ăn Mới
        </h2>
        <p className="text-orange-50 mt-1 text-sm">
          Chia sẻ công thức món ăn yêu thích của bạn với cộng đồng
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Thông tin cơ bản */}
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
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            required
            className="border rounded-lg p-2 w-full mt-3 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Hình ảnh & Video */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Hình ảnh
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Ảnh minh hoạ
              </label>

              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setMainImageMode('file')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${mainImageMode === 'file'
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                   Upload
                </button>
                <button
                  type="button"
                  onClick={() => setMainImageMode('url')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${mainImageMode === 'url'
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                   URL
                </button>
              </div>

              {mainImageMode === 'file' ? (
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
                          image: reader.result as string, 
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-orange-400 focus:border-transparent p-2"
                />
              ) : (
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={recipe.image}
                  onChange={(e) =>
                    setRecipe((prev) => ({ ...prev, image: e.target.value }))
                  }
                  className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                />
              )}

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
          </div>
        </div>

        {/* Thông số */}
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

        {/* Phân loại */}
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
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Nguyên liệu */}
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
                  setRecipe((prev) => ({ ...prev, ingredients: [], ingredientsWithDetails: [] }));
                }}
                className="text-sm text-gray-500 hover:underline"
              >
                Xóa tất cả
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsIngredientSelectorOpen(true)}
              className="w-full border rounded-lg p-3 text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none transition-colors relative"
            >
              <span className={recipe.ingredients.length > 0 ? "text-gray-800" : "text-gray-400"}>
                {recipe.ingredients.length > 0 && recipe.ingredientsWithDetails.length > 0
                  ? recipe.ingredientsWithDetails.map((ing) => 
                      `${ing.name} (${ing.quantity} ${ing.unit})`
                    ).join(', ')
                  : "Chọn nguyên liệu..."
                }
              </span>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Tags */}
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
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Hướng dẫn */}
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
              
                {ins.images && ins.images.length > 0 && (
                  <div className="flex gap-2 my-2 flex-wrap">
                    {ins.images.map((img, j) => (
                      <img
                        key={j}
                        src={img}
                        alt={`${ins.title}-${j}`}
                        className="w-32 h-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
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

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Ảnh minh hoạ bước nấu (tuỳ chọn, tối đa 4 ảnh)
              </label>

              {/* Chọn mode upload cho step */}
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setStepImageMode('file')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${stepImageMode === 'file'
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                   Upload
                </button>
                <button
                  type="button"
                  onClick={() => setStepImageMode('url')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${stepImageMode === 'url'
                      ? 'bg-orange-500 text-white border-orange-500'
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
                    const remainingSlots = 4 - currentInstruction.images.length;
                    const filesToAdd = files.slice(0, remainingSlots);

                    filesToAdd.forEach((file) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setCurrentInstruction((prev) => ({
                          ...prev,
                          images: [...prev.images, reader.result as string],
                        }));
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-orange-400 focus:border-transparent p-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">
                    💡 Nhấn Enter để thêm URL ảnh
                  </p>
                </div>
              )}

              {/* Preview ảnh */}
              {currentInstruction.images && currentInstruction.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {currentInstruction.images.map((img, index) => (
                    <div key={index} className="relative inline-block">
                      <img
                        src={img}
                        alt={`Preview ${index}`}
                        className="w-32 h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentInstruction((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }))
                        }
                        className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 rounded-full p-1 shadow-md transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thông báo nếu đạt giới hạn 4 ảnh */}
            {currentInstruction.images.length >= 4 && (
              <p className="text-sm text-orange-500 mt-2">
                ⚠️ Đã đạt giới hạn 4 ảnh cho mỗi bước.
              </p>
            )}

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

        {/* Buttons */}
        <div className="flex justify-end gap-3 pb-2">
          <button
            type="button"
            onClick={() => navigate('/my-submissions')}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang gửi...
              </>
            ) : (
              'Gửi đề xuất'
            )}
          </button>
        </div>
      </form>

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
  );
};

export default SuggestRecipe;
