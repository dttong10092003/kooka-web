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
    selectedTags: string[]
    selectedCuisine: string
}

export default function FilterModal({ isOpen, onClose, onApply, initialFilters, colorScheme = "orange" }: FilterModalProps) {
    const dispatch = useDispatch<AppDispatch>()
    
    // Get data from Redux
    const { categories, tags, cuisines } = useSelector((state: RootState) => state.recipes)
    
    // State for filters with initial values from props or defaults
    const [selectedCategory, setSelectedCategory] = useState(initialFilters?.selectedCategory || "")
    const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.selectedTags || [])
    const [selectedCuisine, setSelectedCuisine] = useState(initialFilters?.selectedCuisine || "")

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
            tagActive: "bg-orange-500 text-white border-orange-500",
            tagHover: "hover:border-orange-500 hover:text-orange-500",
            focusRing: "focus:ring-orange-500 focus:border-orange-500",
            buttonGradient: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        },
        indigo: {
            tagActive: "bg-indigo-500 text-white border-indigo-500",
            tagHover: "hover:border-indigo-500 hover:text-indigo-500",
            focusRing: "focus:ring-indigo-500 focus:border-indigo-500",
            buttonGradient: "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
        }
    }

    const currentColors = colors[colorScheme]

    // Function to clear all filters
    const handleClearFilters = () => {
        setSelectedCategory("")
        setSelectedTags([])
        setSelectedCuisine("")

        // Notify parent component about cleared filters
        onApply({
            selectedCategory: "",
            selectedTags: [],
            selectedCuisine: ""
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

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        )
    }

    const handleApply = () => {
        onApply({
            selectedCategory,
            selectedTags,
            selectedCuisine
        })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-gray-800/20 bg-opacity-75 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-4">Bộ lọc tìm kiếm</h2>

                {/* Tags - Moved to the top */}
                <div className="mb-4 text-left">
                    <p className="font-semibold mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                        {tags.length > 0 ? (
                            tags.map((tag) => (
                                <button
                                    key={tag._id}
                                    className={`px-4 py-2 rounded-md border transition-colors ${selectedTags.includes(tag._id)
                                            ? currentColors.tagActive
                                            : `bg-white text-gray-700 border-gray-300 ${currentColors.tagHover}`
                                        }`}
                                    onClick={() => handleTagToggle(tag._id)}
                                >
                                    {tag.name}
                                </button>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No tags available</p>
                        )}
                    </div>
                </div>

                {/* Category - Changed to stylish select/combobox */}
                <div className="mb-4 text-left">
                    <p className="font-semibold mb-2">Category</p>
                    <div className="relative">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 ${currentColors.focusRing} text-gray-700 cursor-pointer shadow-sm`}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
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

                {/* Cuisine - Changed to stylish select/combobox */}
                <div className="mb-4 text-left">
                    <p className="font-semibold mb-2">Cuisine</p>
                    <div className="relative">
                        <select 
                            value={selectedCuisine}
                            onChange={(e) => setSelectedCuisine(e.target.value)}
                            className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 ${currentColors.focusRing} text-gray-700 cursor-pointer shadow-sm`}
                        >
                            <option value="">All Cuisines</option>
                            {cuisines.map((cuisine) => (
                                <option key={cuisine._id} value={cuisine._id}>
                                    {cuisine.name}
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

                {/* Button Group for Apply and Clear */}
                <div className="flex gap-3">
                    <button
                        onClick={handleClearFilters}
                        className="w-1/3 border border-gray-300 text-gray-700 hover:bg-gray-100 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Clear Filters
                    </button>
                    <button
                        onClick={handleApply}
                        className={`w-2/3 ${currentColors.buttonGradient} text-white py-3 rounded-lg font-semibold`}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    )
}