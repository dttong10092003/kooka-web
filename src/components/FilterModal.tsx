import { X } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
    onApply: (filters: FilterData) => void
    initialFilters?: FilterData
}

export interface FilterData {
    selectedCategory: string
    selectedTags: string[]
    selectedCuisine: string
}

export default function FilterModal({ isOpen, onClose, onApply, initialFilters }: FilterModalProps) {
    // State for filters with initial values from props or defaults
    const [selectedCategory, setSelectedCategory] = useState(initialFilters?.selectedCategory || "")
    const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.selectedTags || [])
    const [selectedCuisine, setSelectedCuisine] = useState(initialFilters?.selectedCuisine || "")

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

    const categories = ["Buổi sáng", "Buổi trưa", "Ăn nhẹ", "Buổi tối"]
    const tags = ["Món nước", "Món chay", "Món cay", "Món tráng miệng"]
    const cuisines = ["Việt Nam", "Ý", "Nhật Bản", "Hàn Quốc", "Mỹ"]

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
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                className={`px-4 py-2 rounded-md border transition-colors ${selectedTags.includes(tag)
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-500"
                                    }`}
                                onClick={() => handleTagToggle(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category - Changed to stylish select/combobox */}
                <div className="mb-4 text-left">
                    <p className="font-semibold mb-2">Category</p>
                    <div className="relative">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 cursor-pointer shadow-sm"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
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
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 cursor-pointer shadow-sm"
                        >
                            <option value="">All Cuisines</option>
                            {cuisines.map((cuisine) => (
                                <option key={cuisine} value={cuisine}>
                                    {cuisine}
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
                        className="w-2/3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg font-semibold"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    )
}