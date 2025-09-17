import { Plus, Filter, Search, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { fetchIngredients, type Ingredient } from "../redux/slices/recipeSlice"

import FilterModal, { type FilterData } from "./FilterModal"
import IngredientSelectorModal from "./IngredientSelectorModal"

interface HeroSectionProps {
    onSearch: (params: {
        ingredients: string[]
        cuisine?: string
        category?: string
        tags?: string[]
    }) => void
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
    const dispatch = useDispatch<AppDispatch>()

    const ingredients = useSelector((state: RootState) => state.recipes.ingredients)

    useEffect(() => {
        dispatch(fetchIngredients())
    }, [dispatch])

    // State quản lý nguyên liệu đã chọn
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [showNoMatch, setShowNoMatch] = useState(false)
    const [isIngredientSelectorOpen, setIsIngredientSelectorOpen] = useState(false)

    // State quản lý filter
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selectedCuisine, setSelectedCuisine] = useState("") // chỉ chọn 1 cuisine

    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Ref cho dropdown suggestions
    const suggestionsRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Xử lý click outside để đóng suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Xử lý thêm nguyên liệu từ input tìm kiếm
    const handleAddIngredient = (ingredient: string) => {
        if (ingredient && !selectedIngredients.includes(ingredient)) {
            setSelectedIngredients(prev => [...prev, ingredient])
            setSearchTerm("")
            setShowSuggestions(false)
        }
    }

    // Xử lý xóa nguyên liệu
    const handleRemoveIngredient = (ingredient: string) => {
        setSelectedIngredients(prev => prev.filter(item => item !== ingredient))
    }

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

    // Lọc gợi ý dựa trên từ khóa tìm kiếm
    const getFilteredSuggestions = () => {
        if (!searchTerm.trim()) return [];
        const lowercaseSearch = searchTerm.toLowerCase().trim();
        const accentFreeSearch = removeAccents(lowercaseSearch);
        const searchHasAccents = hasAccents(lowercaseSearch);

        return ingredients
            .map((i: Ingredient) => i.name)
            .filter(ingredient => {
                // If search term has accents, only do accent-sensitive search
                if (searchHasAccents) {
                    const ingredientWords = ingredient.toLowerCase().split(/\s+/);

                    // Check if any word in the ingredient starts with the search term
                    const matchesWithAccents = ingredientWords.some(word => word.startsWith(lowercaseSearch));

                    // Also check if the entire ingredient starts with the search term
                    const wholeIngredientMatchesWithAccents = ingredient.toLowerCase().startsWith(lowercaseSearch);

                    return (matchesWithAccents || wholeIngredientMatchesWithAccents) &&
                        !selectedIngredients.includes(ingredient);
                }
                // If search term has no accents, do accent-insensitive search
                else {
                    // Split ingredient into words
                    const accentFreeWords = removeAccents(ingredient.toLowerCase()).split(/\s+/);

                    // Check if any word in the ingredient starts with the search term
                    const matchesWithoutAccents = accentFreeWords.some(word => word.startsWith(accentFreeSearch));

                    // Also check if the entire ingredient starts with the search term
                    const wholeIngredientMatchesWithoutAccents = removeAccents(ingredient.toLowerCase()).startsWith(accentFreeSearch);

                    return (matchesWithoutAccents || wholeIngredientMatchesWithoutAccents) &&
                        !selectedIngredients.includes(ingredient);
                }
            })
            .slice(0, 5); // Giới hạn số lượng gợi ý hiển thị
    }

    // Xử lý khi người dùng nhấn Enter trong ô tìm kiếm
    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            const suggestions = getFilteredSuggestions();
            if (suggestions.length > 0) {
                handleAddIngredient(suggestions[0]);
            } else {
                // Show no match feedback
                setShowNoMatch(true);
                // Auto-hide the error after 3 seconds
                setTimeout(() => {
                    setShowNoMatch(false);
                }, 3000);
            }
        }
    }

    // Xử lý khi chọn nhiều nguyên liệu từ modal
    const handleSelectIngredients = (ingredients: string[]) => {
        setSelectedIngredients(ingredients);
    }

    // Xử lý filter
    const handleApply = (filters: FilterData) => {
        // Update local state with filter values
        setSelectedCategory(filters.selectedCategory)
        setSelectedTags(filters.selectedTags)
        setSelectedCuisine(filters.selectedCuisine)
    }

    // Calculate total active filters
    const getActiveFilterCount = () => {
        return (selectedCategory ? 1 : 0) + selectedTags.length + (selectedCuisine ? 1 : 0)
    }

    const handleSearchRecipes = () => {
        if (selectedIngredients.length > 0) {
            onSearch({
                ingredients: selectedIngredients,
                cuisine: selectedCuisine,
                category: selectedCategory,
                tags: selectedTags,
            })
        }
    }

    return (
        <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
                    Tìm công thức với nguyên liệu
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold block mx-auto leading-[1.5]">
                        bạn đã có sẵn
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto text-pretty">
                    Không còn phải băn khoăn "tôi có thể nấu gì?" Nhập nguyên liệu của bạn và khám phá những công thức tuyệt vời
                    bạn có thể làm ngay bây giờ.
                </p>

                {/* Combined Search, Selected, and Popular Ingredients in a single div */}
                <div className="max-w-3xl mx-auto mb-8 bg-white rounded-xl shadow-lg p-6">
                    {/* Search Input and Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 relative mb-6">
                        <div className="flex-1 relative">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setShowSuggestions(true)
                                    setShowNoMatch(false)
                                }}
                                onKeyDown={handleSearchKeyDown}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Nhập nguyên liệu (trứng, cà chua, thịt bò...)"
                                className={`w-full h-12 pl-10 pr-4 text-base border ${showNoMatch
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-2 focus:ring-orange-500'
                                    } focus:border-transparent outline-none text-gray-700 placeholder-gray-400 rounded-lg`}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />

                            {/* No match message */}
                            {showNoMatch && (
                                <div className="absolute -bottom-8 left-0 text-sm text-red-500">
                                    Không tìm thấy nguyên liệu phù hợp
                                </div>
                            )}

                            {/* Suggestions Dropdown */}
                            {showSuggestions && getFilteredSuggestions().length > 0 && (
                                <div
                                    ref={suggestionsRef}
                                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                                >
                                    {getFilteredSuggestions().map(ingredient => (
                                        <button
                                            key={ingredient}
                                            className="w-full text-left px-4 py-2 hover:bg-orange-50 focus:bg-orange-50 flex items-center"
                                            onClick={() => handleAddIngredient(ingredient)}
                                        >
                                            <Plus className="w-4 h-4 text-orange-500 mr-2" />
                                            {ingredient}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Browse Ingredients Button */}
                        <button
                            type="button"
                            onClick={() => {
                                setIsIngredientSelectorOpen(true)
                                setShowNoMatch(false)
                            }}
                            className="h-12 px-6 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm nguyên liệu
                        </button>

                        {/* Filter Button */}
                        <button
                            type="button"
                            onClick={() => setIsFilterOpen(true)}
                            className="h-12 px-6 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-500 transition-all duration-200 relative"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                            {/* Active filter count badge */}
                            {getActiveFilterCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {getActiveFilterCount()}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Selected Ingredients section */}
                    {selectedIngredients.length > 0 && (
                        <div>
                            <p className="text-gray-700 font-medium mb-4">Nguyên liệu của tôi:</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedIngredients.map(ingredient => (
                                    <div
                                        key={ingredient}
                                        className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-3 py-1 rounded-full flex items-center text-sm space-x-1 group hover:from-orange-200 hover:to-red-200 transition-all duration-200"
                                    >
                                        <span>{ingredient}</span>
                                        <button
                                            onClick={() => handleRemoveIngredient(ingredient)}
                                            className="text-orange-600 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Popular Ingredients - only show when no ingredients are selected */}
                    {selectedIngredients.length === 0 && (
                        <div>
                            <p className="text-gray-700 font-medium mb-4">Nguyên liệu phổ biến:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {ingredients.slice(0, 8).map((ingredient) => (
                                    <div
                                        key={ingredient._id}
                                        className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors"
                                        onClick={() => handleAddIngredient(ingredient.name)}
                                    >
                                        {ingredient.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Recipes Button - Only show when ingredients are selected */}
                {selectedIngredients.length > 0 && (
                    <div className="mt-6">
                        <button
                            onClick={handleSearchRecipes}
                            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-lg shadow-lg hover:shadow-xl mx-auto"
                        >
                            <Search className="w-5 h-5" />
                            <span>Tìm công thức ({selectedIngredients.length} nguyên liệu)</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApply}
                initialFilters={{
                    selectedCategory,
                    selectedTags,
                    selectedCuisine
                }}
            />

            {/* Ingredient Selector Modal */}
            <IngredientSelectorModal
                isOpen={isIngredientSelectorOpen}
                onClose={() => setIsIngredientSelectorOpen(false)}
                onSelect={handleSelectIngredients}
                selectedIngredients={selectedIngredients}
            />
        </section>
    )
}
