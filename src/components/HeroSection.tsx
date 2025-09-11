import { Plus } from "lucide-react"

export default function HeroSection() {
    const popularIngredients = ["chicken", "rice", "tomatoes", "onion", "garlic", "pasta", "cheese", "eggs"]

    return (
        <section className="bg-gray-50 py-16 px-4">
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

                {/* Search Input */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
                    <input
                        type="text"
                        placeholder="Nhập nguyên liệu (ví dụ: gà, cà chua, mì ống...)"
                        className="flex-1 h-12 px-4 text-base border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 rounded-lg"
                    />
                    <button
                        type="button"
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-white px-6 h-12 rounded-lg whitespace-nowrap flex items-center justify-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Ingredient
                    </button>
                </div>

                {/* Popular Ingredients */}
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Nguyên liệu phổ biến:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {popularIngredients.map((ingredient) => (
                            <button
                                key={ingredient}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-colors"
                            >
                                {ingredient}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
