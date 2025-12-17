import { X, CheckSquare, Square } from "lucide-react"
import { useState, useRef, useEffect, useMemo } from "react"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { fetchIngredientTypes } from "../redux/slices/recipeSlice"
import { getDefaultUnit } from "../locales/ingredientUnits"


interface IngredientSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (ingredients: string[], ingredientDetails: Record<string, { quantity: number; unit: string }>) => void;
    selectedIngredients: string[];
    existingIngredientDetails?: Record<string, { quantity: number; unit: string }>;
}

export default function IngredientSelectorModal({
    isOpen,
    onClose,
    onSelect,
    selectedIngredients = [],
    existingIngredientDetails = {}
}: IngredientSelectorModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { ingredients, ingredientTypes } = useSelector(
        (state: RootState) => state.recipes
    );

    const [localSelectedIngredients, setLocalSelectedIngredients] = useState<string[]>(selectedIngredients);
    const [ingredientQuantities, setIngredientQuantities] = useState<Record<string, { quantity: number; unit: string }>>({});
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
            // Sử dụng existingIngredientDetails nếu có, nếu không thì dùng giá trị mặc định
            const defaultQuantities: Record<string, { quantity: number; unit: string }> = {};
            selectedIngredients.forEach(ingredient => {
                defaultQuantities[ingredient] = existingIngredientDetails[ingredient] || {
                    quantity: 1,
                    unit: getDefaultUnit(ingredient)
                };
            });
            setIngredientQuantities(defaultQuantities);
        }
    }, [isOpen, selectedIngredients, existingIngredientDetails]);

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
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, selectedIngredients]);

    const handleIngredientToggle = (ingredient: string) => {
        setLocalSelectedIngredients(prev => {
            if (prev.includes(ingredient)) {
                // Xóa ingredient và quantity của nó
                const newQuantities = { ...ingredientQuantities };
                delete newQuantities[ingredient];
                setIngredientQuantities(newQuantities);
                return prev.filter(item => item !== ingredient);
            } else {
                // Thêm ingredient và set quantity mặc định
                const defaultUnit = getDefaultUnit(ingredient);
                setIngredientQuantities(prev => ({
                    ...prev,
                    [ingredient]: { quantity: 1, unit: defaultUnit }
                }));
                return [...prev, ingredient];
            }
        });
    };

    const handleQuantityChange = (ingredient: string, quantity: number) => {
        setIngredientQuantities(prev => ({
            ...prev,
            [ingredient]: { ...prev[ingredient], quantity }
        }));
    };

    const handleApply = () => {
        onSelect(localSelectedIngredients, ingredientQuantities);
        onClose();
    };

    const handleClear = () => {
        setLocalSelectedIngredients([]);
        setIngredientQuantities({});
    };

    const handleClose = () => {
        // Reset về trạng thái ban đầu khi đóng mà không apply
        setLocalSelectedIngredients([...selectedIngredients]);
        setIngredientQuantities({});
        onClose();
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
                    onClick={handleClose}
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
                                <div key={ingredient} className="mb-3 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                                    {/* Checkbox và tên nguyên liệu */}
                                    <div className="flex items-center mb-2">
                                        <button
                                            className="flex items-center hover:bg-gray-50 p-1 rounded"
                                            onClick={() => handleIngredientToggle(ingredient)}
                                        >
                                            {localSelectedIngredients.includes(ingredient) ? (
                                                <CheckSquare className="w-5 h-5 text-orange-500 mr-2" />
                                            ) : (
                                                <Square className="w-5 h-5 text-gray-400 mr-2" />
                                            )}
                                            <span className="font-medium">{ingredient}</span>
                                        </button>
                                    </div>
                                    
                                    {/* Số lượng và đơn vị - hiển thị khi được chọn */}
                                    {localSelectedIngredients.includes(ingredient) && (
                                        <div className="flex items-center gap-2 ml-7">
                                            <input
                                                type="number"
                                                min="0.1"
                                                step="0.1"
                                                value={ingredientQuantities[ingredient]?.quantity || 1}
                                                onChange={(e) => handleQuantityChange(ingredient, parseFloat(e.target.value) || 1)}
                                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className="flex-1 px-2 py-1 text-sm text-gray-600 font-medium">
                                                {ingredientQuantities[ingredient]?.unit || getDefaultUnit(ingredient)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center pt-4">Không tìm thấy nguyên liệu nào</p>
                        )}
                    </div>
                </div>

                {/* Selected count with details */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                    <div className="text-sm text-gray-600 mb-3">
                        <div className="font-medium mb-2">Đã chọn {localSelectedIngredients.length} nguyên liệu:</div>
                        {localSelectedIngredients.length > 0 ? (
                            <div className="text-gray-700 bg-gray-50 rounded-lg p-3 max-h-20 overflow-y-auto">
                                {localSelectedIngredients.map((ingredient, index) => {
                                    const qty = ingredientQuantities[ingredient];
                                    return (
                                        <span key={ingredient}>
                                            {ingredient} ({qty?.quantity || 1} {qty?.unit || getDefaultUnit(ingredient)})
                                            {index < localSelectedIngredients.length - 1 ? ', ' : ''}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-gray-400 italic">Chưa có nguyên liệu nào được chọn</div>
                        )}
                    </div>

                    <div className="flex gap-3 justify-end">
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