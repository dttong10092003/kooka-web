import { X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../redux/store"
import { fetchCategories, fetchTags, fetchCuisines } from "../redux/slices/recipeSlice"

interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
    onApply: (filters: FilterData) => void
    initialFilters?: FilterData
    colorScheme?: "orange" | "indigo"
}

export interface FilterData {
    selectedCategory: string
    selectedCategoryName: string
    selectedTags: string[]
    selectedTagNames: string[]
    selectedCuisine: string
    selectedCuisineName: string
}

export default function FilterModal({ isOpen, onClose, onApply, initialFilters, colorScheme = "orange" }: FilterModalProps) {
    const dispatch = useDispatch<AppDispatch>()
    
    // Get data from Redux
    const { categories, tags, cuisines } = useSelector((state: RootState) => state.recipes)
    
    // State for filters with initial values from props or defaults
    const [selectedCategory, setSelectedCategory] = useState(initialFilters?.selectedCategory || "")
    const [selectedCategoryName, setSelectedCategoryName] = useState(initialFilters?.selectedCategoryName || "")
    const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.selectedTags || [])
    const [selectedTagNames, setSelectedTagNames] = useState<string[]>(initialFilters?.selectedTagNames || [])
    const [selectedCuisine, setSelectedCuisine] = useState(initialFilters?.selectedCuisine || "")
    const [selectedCuisineName, setSelectedCuisineName] = useState(initialFilters?.selectedCuisineName || "")

    // Fetch data when component mounts if not already loaded
    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategories())
        }
        if (tags.length === 0) {
            dispatch(fetchTags())
        }
        if (cuisines.length === 0) {
            dispatch(fetchCuisines())
        }
    }, [dispatch, categories, tags, cuisines])

    // Color classes based on colorScheme
    const colors = {
        orange: {
            tagActive: "bg-orange-500 text-white border-orange-500 shadow-md",
            tagHover: "hover:border-orange-400 hover:text-orange-600 hover:shadow-sm",
            focusRing: "focus:ring-2 focus:ring-orange-400 focus:border-orange-500",
            buttonGradient: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg",
            clearButton: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        },
        indigo: {
            tagActive: "bg-indigo-500 text-white border-indigo-500 shadow-md",
            tagHover: "hover:border-indigo-400 hover:text-indigo-600 hover:shadow-sm",
            focusRing: "focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500",
            buttonGradient: "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-md hover:shadow-lg",
            clearButton: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        }
    }

    const currentColors = colors[colorScheme]

    // Function to clear all filters
    const handleClearFilters = () => {
        setSelectedCategory("")
        setSelectedCategoryName("")
        setSelectedTags([])
        setSelectedTagNames([])
        setSelectedCuisine("")
        setSelectedCuisineName("")

        onApply({
            selectedCategory: "",
            selectedCategoryName: "",
            selectedTags: [],
            selectedTagNames: [],
            selectedCuisine: "",
            selectedCuisineName: ""
        })
    }

    // Reference to modal content for click outside detection
    const modalRef = useRef<HTMLDivElement>(null)

    // Effect for clicking outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    const handleTagToggle = (tagId: string, tagName: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
        )
        setSelectedTagNames((prev) =>
            prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
        )
    }

    const handleApply = () => {
        onApply({
            selectedCategory,
            selectedCategoryName,
            selectedTags,
            selectedTagNames,
            selectedCuisine,
            selectedCuisineName
        })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
            >
                {/* Header với gradient */}
                <div className={`${currentColors.buttonGradient} text-white px-5 py-3.5 rounded-t-2xl relative`}>
                    <h2 className="text-xl font-bold pr-8">Bộ lọc tìm kiếm</h2>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1.5 transition-all duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-5 space-y-4 overflow-y-auto flex-1">

                    {/* Tags Section */}
                    <div className="text-left">
                        <p className="font-bold text-base text-gray-900 mb-2.5">Nhãn món ăn</p>
                        <div className="flex flex-wrap gap-2">
                            {tags.length > 0 ? (
                                tags.map((tag) => (
                                    <button
                                        key={tag._id}
                                        className={`px-3.5 py-1.5 rounded-full border-2 transition-all duration-200 font-semibold text-sm ${
                                            selectedTags.includes(tag._id)
                                                ? currentColors.tagActive
                                                : `bg-white text-gray-800 border-gray-300 ${currentColors.tagHover}`
                                        }`}
                                        onClick={() => handleTagToggle(tag._id, tag.name)}
                                    >
                                        {tag.name}
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">Không có nhãn nào</p>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Category Section */}
                    <div className="text-left">
                        <p className="font-bold text-base text-gray-900 mb-2.5">Danh mục</p>
                        <div className="relative">
                            <select 
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value)
                                    const selectedCat = categories.find(cat => cat._id === e.target.value)
                                    setSelectedCategoryName(selectedCat?.name || "")
                                }}
                                className={`w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl appearance-none focus:outline-none ${currentColors.focusRing} text-gray-900 cursor-pointer hover:border-gray-400 transition-all duration-200 font-medium`}
                            >
                                <option value="">Tất cả danh mục</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Cuisine Section */}
                    <div className="text-left">
                        <p className="font-bold text-base text-gray-900 mb-2.5">Ẩm thực</p>
                        <div className="relative">
                            <select 
                                value={selectedCuisine}
                                onChange={(e) => {
                                    setSelectedCuisine(e.target.value)
                                    const selectedCuis = cuisines.find(cuis => cuis._id === e.target.value)
                                    setSelectedCuisineName(selectedCuis?.name || "")
                                }}
                                className={`w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl appearance-none focus:outline-none ${currentColors.focusRing} text-gray-900 cursor-pointer hover:border-gray-400 transition-all duration-200 font-medium`}
                            >
                                <option value="">Tất cả ẩm thực</option>
                                {cuisines.map((cuisine) => (
                                    <option key={cuisine._id} value={cuisine._id}>
                                        {cuisine.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button Group */}
                <div className="flex gap-3 px-5 pb-5 pt-2 border-t border-gray-100">
                    <button
                        onClick={handleClearFilters}
                        className={`flex-1 ${currentColors.clearButton} py-2.5 rounded-xl font-bold transition-all duration-200 text-sm`}
                    >
                        Xóa bộ lọc
                    </button>
                    <button
                        onClick={handleApply}
                        className={`flex-[2] ${currentColors.buttonGradient} text-white py-2.5 rounded-xl font-bold transition-all duration-200 text-sm`}
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>
    )
}