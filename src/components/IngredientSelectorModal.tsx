import { X, CheckSquare, Square } from "lucide-react"
import { useState, useRef, useEffect, useMemo } from "react"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { fetchIngredientTypes } from "../redux/slices/recipeSlice"

interface IngredientSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (ingredients: string[]) => void;
    selectedIngredients: string[];
}

export default function IngredientSelectorModal({
    isOpen,
    onClose,
    onSelect,
    selectedIngredients = []
}: IngredientSelectorModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { ingredients, ingredientTypes } = useSelector(
        (state: RootState) => state.recipes
    );

    const [localSelectedIngredients, setLocalSelectedIngredients] = useState<string[]>(selectedIngredients);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Reference to modal content for click outside detection
    const modalRef = useRef<HTMLDivElement>(null);

    // Load dữ liệu từ API khi mở modal
    useEffect(() => {
        if (isOpen) {
            dispatch(fetchIngredientTypes());
        }
    }, [isOpen, dispatch]);

    // Reset local state when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalSelectedIngredients([...selectedIngredients]);
        }
    }, [isOpen, selectedIngredients]);

    // Auto chọn category đầu tiên
    useEffect(() => {
        if (ingredientTypes.length > 0 && !activeCategory) {
            setActiveCategory(ingredientTypes[0]._id);
        }
    }, [ingredientTypes, activeCategory]);

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

    const handleIngredientToggle = (ingredient: string) => {
        setLocalSelectedIngredients(prev =>
            prev.includes(ingredient)
                ? prev.filter(item => item !== ingredient)
                : [...prev, ingredient]
        );
    };

    const handleApply = () => {
        onSelect(localSelectedIngredients);
        onClose();
    };

    const handleClear = () => {
        setLocalSelectedIngredients([]);
    };

    // Helper function to remove accents from Vietnamese text
    const removeAccents = (str: string): string => {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    };

    // Helper function to check if a string has Vietnamese accents
    const hasAccents = (str: string): boolean => {
        // Test for Vietnamese accented characters
        return /[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/i.test(str);
    };

    // Nhóm ingredients theo type
    const groupedIngredients = useMemo(() => {
        const groups: Record<string, string[]> = {};
        ingredientTypes.forEach((type) => {
            groups[type._id] = ingredients
                .filter((ing) => ing.typeId === type._id)
                .map((ing) => ing.name);
        });
        return groups;
    }, [ingredients, ingredientTypes]);

    // Filter ingredient theo search
    const getFilteredIngredients = () => {
        if (!searchTerm.trim()) {
            return activeCategory ? groupedIngredients[activeCategory] || [] : [];
        }

        // If searching, show matches from all categories
        const lowercaseSearch = searchTerm.toLowerCase().trim();
        const searchHasAccents = hasAccents(lowercaseSearch);
        const accentFreeSearch = removeAccents(lowercaseSearch);
        const results: string[] = [];

        Object.values(groupedIngredients).forEach((categoryIngredients) => {
            categoryIngredients.forEach((ingredient) => {
                if (searchHasAccents) {
                    const words = ingredient.toLowerCase().split(/\s+/);
                    if (
                        words.some((w) => w.startsWith(lowercaseSearch)) ||
                        ingredient.toLowerCase().startsWith(lowercaseSearch)
                    ) {
                        results.push(ingredient);
                    }
                } else {
                    const accentFreeWords = removeAccents(
                        ingredient.toLowerCase()
                    ).split(/\s+/);
                    if (
                        accentFreeWords.some((w) => w.startsWith(accentFreeSearch)) ||
                        removeAccents(ingredient.toLowerCase()).startsWith(accentFreeSearch)
                    ) {
                        results.push(ingredient);
                    }
                }
            });
        });

        return results;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative h-[600px] flex flex-col">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-4">Chọn nguyên liệu</h2>

                {/* Search bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tìm nguyên liệu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                </div>

                <div className="flex flex-grow overflow-hidden h-[400px]">
                    {/* Category sidebar - hidden when searching */}
                    {!searchTerm && (
                        <div className="w-1/3 border-r border-gray-200 pr-4 overflow-y-auto h-full">
                            {ingredientTypes.map((type) => (
                                <button
                                    key={type._id}
                                    className={`block w-full text-left px-3 py-2 rounded-lg mb-1 ${activeCategory === type._id
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'hover:bg-gray-100'
                                        }`}
                                    onClick={() => setActiveCategory(type._id)}
                                >
                                    {type.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Ingredients list */}
                    <div className={`${searchTerm ? 'w-full' : 'w-2/3'} pl-4 overflow-y-auto h-full`}>
                        {getFilteredIngredients().length > 0 ? (
                            getFilteredIngredients().map(ingredient => (
                                <div key={ingredient} className="flex items-center mb-2">
                                    <button
                                        className="flex items-center w-full hover:bg-gray-50 p-2 rounded-lg"
                                        onClick={() => handleIngredientToggle(ingredient)}
                                    >
                                        {localSelectedIngredients.includes(ingredient) ? (
                                            <CheckSquare className="w-5 h-5 text-orange-500 mr-2" />
                                        ) : (
                                            <Square className="w-5 h-5 text-gray-400 mr-2" />
                                        )}
                                        <span>{ingredient}</span>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center pt-4">Không tìm thấy nguyên liệu nào</p>
                        )}
                    </div>
                </div>

                {/* Selected count */}
                <div className="pt-4 border-t border-gray-200 mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Đã chọn: <span className="font-medium">{localSelectedIngredients.length}</span> nguyên liệu
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleClear}
                            disabled={localSelectedIngredients.length === 0}
                            className={`px-4 py-2 border rounded-lg ${localSelectedIngredients.length === 0
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
}