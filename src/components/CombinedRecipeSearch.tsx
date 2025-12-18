import { useState, useRef, useEffect } from "react"
import { Search, Filter, Plus, X } from "lucide-react"
import FilterModal  from "./FilterModal"
import IngredientSelectorModal from "./IngredientSelectorModal"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../redux/store"
import { fetchIngredients, type Ingredient } from "../redux/slices/recipeSlice"

interface CombinedRecipeSearchProps {
    onSearch: (params: {
        keyword?: string
        ingredients?: string[]
        cuisine?: string
        category?: string
        tags?: string[]
    } | null) => void
}

export default function CombinedRecipeSearch({ onSearch }: CombinedRecipeSearchProps) {
    const dispatch = useDispatch<AppDispatch>()
    const ingredients = useSelector((state: RootState) => state.recipes.ingredients)

    useEffect(() => {
        dispatch(fetchIngredients())
    }, [dispatch])

    const [searchMode, setSearchMode] = useState<"keyword" | "ingredient">("keyword")
    const [keyword, setKeyword] = useState("")
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
    const [ingredientSearchTerm, setIngredientSearchTerm] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [showNoMatch, setShowNoMatch] = useState(false)

    const [filters, setFilters] = useState({
        selectedCategory: "",
        selectedCategoryName: "",
        selectedTags: [] as string[],
        selectedTagNames: [] as string[],
        selectedCuisine: "",
        selectedCuisineName: "",
    })

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false)

    const suggestionsRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

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
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const removeAccents = (str: string): string => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")
    }

    const hasAccents = (str: string): boolean => {
        return /[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/i.test(str)
    }

    const getFilteredSuggestions = () => {
        if (!ingredientSearchTerm.trim()) return []
        const lowercaseSearch = ingredientSearchTerm.toLowerCase().trim()
        const accentFreeSearch = removeAccents(lowercaseSearch)
        const searchHasAccents = hasAccents(lowercaseSearch)

        return ingredients
            .map((i: Ingredient) => i.name)
            .filter((ingredient) => {
                if (searchHasAccents) {
                    const ingredientWords = ingredient.toLowerCase().split(/\s+/)
                    const matchesWithAccents = ingredientWords.some((word) => word.startsWith(lowercaseSearch))
                    const wholeIngredientMatchesWithAccents = ingredient.toLowerCase().startsWith(lowercaseSearch)
                    return (matchesWithAccents || wholeIngredientMatchesWithAccents) && !selectedIngredients.includes(ingredient)
                } else {
                    const accentFreeWords = removeAccents(ingredient.toLowerCase()).split(/\s+/)
                    const matchesWithoutAccents = accentFreeWords.some((word) => word.startsWith(accentFreeSearch))
                    const wholeIngredientMatchesWithoutAccents = removeAccents(ingredient.toLowerCase()).startsWith(accentFreeSearch)
                    return (matchesWithoutAccents || wholeIngredientMatchesWithoutAccents) && !selectedIngredients.includes(ingredient)
                }
            })
            .slice(0, 5)
    }

    const handleAddIngredient = (ingredient: string) => {
        if (ingredient && !selectedIngredients.includes(ingredient)) {
            setSelectedIngredients((prev) => [...prev, ingredient])
            setIngredientSearchTerm("")
            setShowSuggestions(false)
        }
    }

    const handleRemoveIngredient = (ingredient: string) => {
        setSelectedIngredients(prev => prev.filter(item => item !== ingredient))
    }

    const handleIngredientSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && ingredientSearchTerm.trim()) {
            const suggestions = getFilteredSuggestions()
            if (suggestions.length > 0) {
                handleAddIngredient(suggestions[0])
            } else {
                setShowNoMatch(true)
                setTimeout(() => setShowNoMatch(false), 3000)
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleKeywordSearch()
        }
    }

    const handleKeywordSearch = () => {
        if (keyword.trim()) {
            onSearch({
                keyword,
                cuisine: filters.selectedCuisineName,
                category: filters.selectedCategoryName,
                tags: filters.selectedTagNames,
            })
        }
    }

    const handleIngredientSearch = () => {
        if (selectedIngredients.length > 0) {
            onSearch({
                ingredients: selectedIngredients,
                cuisine: filters.selectedCuisineName,
                category: filters.selectedCategoryName,
                tags: filters.selectedTagNames,
            })
        }
    }

    const handleIngredientsSelected = (ingredients: string[]) => {
        setSelectedIngredients(ingredients)
        setIsIngredientModalOpen(false)
    }

    const getFilterCount = () => {
        return (filters.selectedCategory ? 1 : 0) + filters.selectedTags.length + (filters.selectedCuisine ? 1 : 0)
    }

    return (
        <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    {searchMode === "keyword" ? (
                        <>
                            Gõ từ khóa, tìm ngay món ăn
                            <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent font-bold block mx-auto leading-[1.5]">
                                bạn muốn nấu hôm nay
                            </span>
                        </>
                    ) : (
                        <>
                            Tìm công thức với nguyên liệu
                            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold block mx-auto leading-[1.5]">
                                bạn đã có sẵn
                            </span>
                        </>
                    )}
                </h1>

                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    {searchMode === "keyword"
                        ? 'Nhập từ khóa như "phở bò", "cà ri gà" hoặc "súp cua" để tìm công thức bạn cần'
                        : 'Không còn phải băn khoăn "tôi có thể nấu gì?" Nhập nguyên liệu của bạn và khám phá những công thức tuyệt vời bạn có thể làm ngay bây giờ.'}
                </p>

                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setSearchMode("keyword")}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${searchMode === "keyword"
                                ? "bg-indigo-500 text-white shadow-lg"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                            }`}
                    >
                        Tìm theo từ khóa
                    </button>
                    <button
                        onClick={() => setSearchMode("ingredient")}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${searchMode === "ingredient"
                                ? "bg-orange-500 text-white shadow-lg"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                            }`}
                    >
                        Tìm theo nguyên liệu
                    </button>
                </div>

                <div className="max-w-3xl mx-auto mb-8 bg-white rounded-xl shadow-lg p-6">
                    {searchMode === "keyword" ? (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Nhập tên món ăn (ví dụ: phở bò, bún chả...)"
                                    className="w-full h-12 pl-10 pr-4 text-base border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 rounded-lg"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                            <button
                                type="button"
                                onClick={handleKeywordSearch}
                                className="h-12 px-6 bg-indigo-500 text-white rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-all duration-200"
                            >
                                <Search className="w-5 h-5 mr-2" />
                                Tìm kiếm
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFilterOpen(true)}
                                className="h-12 px-6 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-500 transition-all duration-200 relative"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                                {getFilterCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {getFilterCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3 relative">
                                <div className="flex-1 relative">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={ingredientSearchTerm}
                                        onChange={(e) => {
                                            setIngredientSearchTerm(e.target.value)
                                            setShowSuggestions(true)
                                            setShowNoMatch(false)
                                        }}
                                        onKeyDown={handleIngredientSearchKeyDown}
                                        onFocus={() => setShowSuggestions(true)}
                                        placeholder="Nhập nguyên liệu (trứng, cà chua, thịt bò...)"
                                        className={`w-full h-12 pl-10 pr-4 text-base border ${showNoMatch ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-gray-300 focus:ring-2 focus:ring-orange-500"
                                            } focus:border-transparent outline-none text-gray-700 placeholder-gray-400 rounded-lg`}
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />

                                    {showNoMatch && (
                                        <div className="absolute -bottom-[4.5] left-0 text-sm text-red-500">
                                            Không tìm thấy nguyên liệu phù hợp
                                        </div>
                                    )}

                                    {showSuggestions && getFilteredSuggestions().length > 0 && (
                                        <div
                                            ref={suggestionsRef}
                                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                                        >
                                            {getFilteredSuggestions().map((ingredient) => (
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

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsIngredientModalOpen(true)
                                        setShowNoMatch(false)
                                    }}
                                    className="h-12 px-6 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-all duration-200"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm nguyên liệu
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsFilterOpen(true)}
                                    className="h-12 px-6 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-500 transition-all duration-200 relative"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                    {getFilterCount() > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {getFilterCount()}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {selectedIngredients.length > 0 && (
                                <div>
                                    <p className="text-gray-700 font-medium mb-4 text-left">Nguyên liệu của tôi:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedIngredients.map((ingredient) => (
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

                            {selectedIngredients.length === 0 && (
                                <div>
                                    <p className="text-gray-700 font-medium mb-4 text-left">Nguyên liệu phổ biến:</p>
                                    <div className="flex flex-wrap gap-2">
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
                    )}
                </div>

                {searchMode === "ingredient" && selectedIngredients.length > 0 && (
                    <div className="mt-6">
                        <button
                            onClick={handleIngredientSearch}
                            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-lg shadow-lg hover:shadow-xl mx-auto"
                        >
                            <Search className="w-5 h-5" />
                            <span>Tìm công thức ({selectedIngredients.length} nguyên liệu)</span>
                        </button>
                    </div>
                )}
            </div>

            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={(newFilters) => {
                    setFilters({
                        selectedCategory: newFilters.selectedCategory,
                        selectedCategoryName: newFilters.selectedCategoryName,
                        selectedTags: newFilters.selectedTags,
                        selectedTagNames: newFilters.selectedTagNames,
                        selectedCuisine: newFilters.selectedCuisine,
                        selectedCuisineName: newFilters.selectedCuisineName
                    })
                    setIsFilterOpen(false)
                }}
                initialFilters={filters}
                colorScheme={searchMode === "keyword" ? "indigo" : "orange"}
            />

            <IngredientSelectorModal
                isOpen={isIngredientModalOpen}
                onClose={() => setIsIngredientModalOpen(false)}
                onSelect={handleIngredientsSelected}
                selectedIngredients={selectedIngredients}
            />
        </section>
    )
}
