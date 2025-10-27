// import { Filter, Search } from "lucide-react"
// import { useState, useRef } from "react"
// import FilterModal, { type FilterData } from "./FilterModal"

// interface HeroKeywordSearchProps {
//     onSearchKeyword: (params: {
//         keyword: string
//         cuisine?: string
//         category?: string
//         tags?: string[]
//     }) => void
// }

// export default function HeroKeywordSearch({ onSearchKeyword }: HeroKeywordSearchProps) {
//     const [keyword, setKeyword] = useState("")
//     const [isFilterOpen, setIsFilterOpen] = useState(false)

//     const [selectedCategory, setSelectedCategory] = useState("")
//     const [selectedTags, setSelectedTags] = useState<string[]>([])
//     const [selectedCuisine, setSelectedCuisine] = useState("")

//     const searchInputRef = useRef<HTMLInputElement>(null)

//     // Xử lý khi nhấn Enter
//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (e.key === "Enter" && keyword.trim()) {
//             handleSearch()
//         }
//     }

//     // Áp dụng filter
//     const handleApply = (filters: FilterData) => {
//         setSelectedCategory(filters.selectedCategory)
//         setSelectedTags(filters.selectedTags)
//         setSelectedCuisine(filters.selectedCuisine)
//     }

//     // Đếm filter đang chọn
//     const getActiveFilterCount = () => {
//         return (selectedCategory ? 1 : 0) + selectedTags.length + (selectedCuisine ? 1 : 0)
//     }

//     // Trigger search
//     const handleSearch = () => {
//         if (keyword.trim()) {
//             onSearchKeyword({
//                 keyword,
//                 cuisine: selectedCuisine,
//                 category: selectedCategory,
//                 tags: selectedTags,
//             })
//         }
//     }

//     return (
//         <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 px-4">
//             <div className="max-w-7xl mx-auto text-center">
//                 {/* Heading */}
//                 <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//                     Gõ từ khóa, tìm ngay món ăn
//                     <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent font-bold block mx-auto leading-[1.5]">
//                         bạn muốn nấu hôm nay
//                     </span>
//                 </h1>

//                 {/* Subtitle */}
//                 <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
//                     Nhập từ khóa như “phở bò”, “cà ri gà” hoặc “súp cua” để tìm công thức bạn cần
//                 </p>

//                 {/* Search + Filter */}
//                 <div className="max-w-3xl mx-auto mb-8 bg-white rounded-xl shadow-lg p-6">
//                     <div className="flex flex-col sm:flex-row gap-3 relative">
//                         {/* Input */}
//                         <div className="flex-1 relative">
//                             <input
//                                 ref={searchInputRef}
//                                 type="text"
//                                 value={keyword}
//                                 onChange={(e) => setKeyword(e.target.value)}
//                                 onKeyDown={handleKeyDown}
//                                 placeholder="Nhập tên món ăn (ví dụ: phở bò, bún chả...)"
//                                 className="w-full h-12 pl-10 pr-4 text-base border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 rounded-lg"
//                             />
//                             <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
//                         </div>

//                         {/* Search Button */}
//                         <button
//                             type="button"
//                             onClick={handleSearch}
//                             className="h-12 px-6 bg-indigo-500 text-white rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-all duration-200"
//                         >
//                             <Search className="w-5 h-5 mr-2" />
//                             Tìm kiếm
//                         </button>

//                         {/* Filter Button */}
//                         <button
//                             type="button"
//                             onClick={() => setIsFilterOpen(true)}
//                             className="h-12 px-6 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-500 transition-all duration-200 relative"
//                         >
//                             <Filter className="w-4 h-4 mr-2" />
//                             Filter
//                             {getActiveFilterCount() > 0 && (
//                                 <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                                     {getActiveFilterCount()}
//                                 </span>
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Filter Modal */}
//             <FilterModal
//                 isOpen={isFilterOpen}
//                 onClose={() => setIsFilterOpen(false)}
//                 onApply={handleApply}
//                 initialFilters={{
//                     selectedCategory,
//                     selectedTags,
//                     selectedCuisine,
//                 }}
//             />
//         </section>
//     )
// }
