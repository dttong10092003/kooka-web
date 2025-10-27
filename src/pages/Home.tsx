import { useState } from 'react';
import { Heart, Info, Play, ChevronLeft, ChevronRight, Star, Clock, ChefHat, TrendingUp, Sparkles } from 'lucide-react';

interface Recipe {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  duration: string;
  difficulty: string;
  rating?: number;
  reviews?: number;
  servings?: number;
  cuisine?: string;
  ingredients?: string[];
}

const Home = () => {
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);

  const featuredRecipes: Recipe[] = [
    {
      id: 0,
      title: 'Phở Bò Hà Nội',
      subtitle: 'Vietnamese Beef Noodle Soup',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1200&h=600&fit=crop',
      duration: '45 phút',
      difficulty: 'Trung bình',
      rating: 4.8,
      reviews: 256,
      servings: 4,
      cuisine: 'Việt Nam',
      ingredients: ['thịt heo', 'nước mắm', 'bún', 'hành lá', 'ớt', 'chanh']
    },
    {
      id: 1,
      title: 'Bánh Mì Việt Nam',
      subtitle: 'Vietnamese Baguette',
      image: 'https://cdn-i2.congthuong.vn/stores/news_dataimages/2024/032024/16/09/top-1-mon-sandwich-ngon-nhat-the-gioi-goi-ten-banh-my-viet-nam1710498007-182420240316092132.jpg?rt=20240316092204?w=1200&h=600&fit=crop',
      duration: '30 phút',
      difficulty: 'Dễ',
      rating: 4.6,
      reviews: 189,
      servings: 2,
      cuisine: 'Việt Nam',
      ingredients: ['bánh mì', 'thịt', 'pate', 'rau']
    },
    {
      id: 2,
      title: 'Bún Chả Hà Nội',
      subtitle: 'Grilled Pork with Vermicelli',
      image: 'https://cdn.tgdd.vn/2022/01/CookRecipe/Avatar/bun-cha-ha-noi-cong-thuc-chia-se-tu-nguoi-dung-thumbnail.jpg?w=1200&h=600&fit=crop',
      duration: '1h 15p',
      difficulty: 'Trung bình',
      rating: 4.9,
      reviews: 342,
      servings: 4,
      cuisine: 'Việt Nam',
      ingredients: ['thịt heo', 'bún', 'nước mắm', 'rau']
    },
    {
      id: 3,
      title: 'Gỏi Cuốn Tôm Thịt',
      subtitle: 'Fresh Spring Rolls',
      image: 'https://i.ytimg.com/vi/w34Qnc-9KBU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAzXE6ASDMpVme1qsjbkQx4v-KaYA?w=1200&h=600&fit=crop',
      duration: '25 phút',
      difficulty: 'Dễ',
      rating: 4.7,
      reviews: 215,
      servings: 6,
      cuisine: 'Việt Nam',
      ingredients: ['bánh tráng', 'tôm', 'thịt', 'rau']
    },
    {
      id: 4,
      title: 'Cơm Tấm Sườn Nướng',
      subtitle: 'Broken Rice with Grilled Pork',
      image: 'https://i.ytimg.com/vi/cJu6tFJe_Gc/maxresdefault.jpg?w=1200&h=600&fit=crop',
      duration: '50 phút',
      difficulty: 'Trung bình',
      rating: 4.5,
      reviews: 178,
      servings: 3,
      cuisine: 'Việt Nam',
      ingredients: ['cơm', 'sườn', 'nước mắm', 'dưa leo']
    },
    {
      id: 5,
      title: 'Bún Bò Huế',
      subtitle: 'Spicy Beef Noodle Soup',
      image: 'https://daivietourist.vn/wp-content/uploads/2025/04/quan-bun-bo-hue-1.jpg?w=1200&h=600&fit=crop',
      duration: '1h 30p',
      difficulty: 'Khó',
      rating: 4.8,
      reviews: 298,
      servings: 4,
      cuisine: 'Việt Nam',
      ingredients: ['bún', 'thịt bò', 'sả', 'mắm ruốc', 'ớt']
    }
  ];

  const featuredRecipe = featuredRecipes[selectedRecipeIndex];

  const newRecipes: Recipe[] = [
  {
    id: 1,
    title: 'Bánh Mì Việt Nam',
    subtitle: 'Vietnamese Baguette',
    image: 'https://daivietourist.vn/wp-content/uploads/2025/04/quan-bun-bo-hue-1.jpg?w=1200&h=600&fit=crop',
    duration: '30 phút',
    difficulty: 'Dễ',
    rating: 4.6,
    servings: 2,
    cuisine: 'Việt Nam',
    ingredients: ['bánh mì', 'thịt', 'pate', 'rau']
  },
  {
    id: 2,
    title: 'Bún Chả Hà Nội',
    subtitle: 'Grilled Pork with Vermicelli',
    image: 'https://daivietourist.vn/wp-content/uploads/2025/04/quan-bun-bo-hue-1.jpg?w=1200&h=600&fit=crop',
    duration: '1h 15p',
    difficulty: 'Trung bình',
    rating: 4.9,
    servings: 4,
    cuisine: 'Việt Nam',
    ingredients: ['thịt heo', 'bún', 'nước mắm', 'rau']
  },
  {
    id: 3,
    title: 'Gỏi Cuốn Tôm Thịt',
    subtitle: 'Fresh Spring Rolls',
    image: 'https://daivietourist.vn/wp-content/uploads/2025/04/quan-bun-bo-hue-1.jpg?w=1200&h=600&fit=crop',
    duration: '25 phút',
    difficulty: 'Dễ',
    rating: 4.7,
    servings: 6,
    cuisine: 'Việt Nam',
    ingredients: ['bánh tráng', 'tôm', 'thịt', 'rau']
  },
  {
    id: 4,
    title: 'Cơm Tấm Sườn Nướng',
    subtitle: 'Broken Rice with Grilled Pork',
    image: 'https://daivietourist.vn/wp-content/uploads/2025/04/quan-bun-bo-hue-1.jpg?w=1200&h=600&fit=crop',
    duration: '50 phút',
    difficulty: 'Trung bình',
    rating: 4.5,
    servings: 3,
    cuisine: 'Việt Nam',
    ingredients: ['cơm', 'sườn', 'nước mắm', 'dưa leo']
  },
  {
    id: 5,
    title: 'Bún Bò Huế',
    subtitle: 'Spicy Beef Noodle Soup',
    image: 'https://daivietourist.vn/wp-content/uploads/2025/04/quan-bun-bo-hue-1.jpg?w=1200&h=600&fit=crop',
    duration: '1h 30p',
    difficulty: 'Khó',
    rating: 4.8,
    servings: 4,
    cuisine: 'Việt Nam',
    ingredients: ['bún', 'thịt bò', 'sả', 'mắm ruốc', 'ớt']
  }
];


  const popularRecipes: Recipe[] = [
    {
      id: 6,
      title: 'Cà Ri Gà',
      subtitle: 'Vietnamese Chicken Curry',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=600&fit=crop',
      duration: '1h',
      difficulty: 'Trung bình',
      rating: 4.7,
      servings: 5,
      cuisine: 'Việt Nam',
      ingredients: ['gà', 'cà rốt', 'khoai tây', 'cà ri']
    },
    {
      id: 7,
      title: 'Bánh Xèo',
      subtitle: 'Vietnamese Crispy Pancake',
      image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=600&fit=crop',
      duration: '45 phút',
      difficulty: 'Trung bình',
      rating: 4.6,
      servings: 4,
      cuisine: 'Việt Nam',
      ingredients: ['bột', 'tôm', 'thịt', 'giá']
    },
    {
      id: 8,
      title: 'Chả Giò',
      subtitle: 'Vietnamese Fried Spring Rolls',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=600&fit=crop',
      duration: '40 phút',
      difficulty: 'Dễ',
      rating: 4.8,
      servings: 6,
      cuisine: 'Việt Nam',
      ingredients: ['bánh tráng', 'thịt', 'miến', 'nấm']
    },
    {
      id: 9,
      title: 'Hủ Tiếu Nam Vang',
      subtitle: 'Cambodian-Vietnamese Noodle Soup',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=600&fit=crop',
      duration: '55 phút',
      difficulty: 'Trung bình',
      rating: 4.5,
      servings: 4,
      cuisine: 'Việt Nam',
      ingredients: ['hủ tiếu', 'tôm', 'thịt', 'giá']
    },
    {
      id: 10,
      title: 'Canh Chua',
      subtitle: 'Vietnamese Sweet and Sour Soup',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=600&fit=crop',
      duration: '35 phút',
      difficulty: 'Dễ',
      rating: 4.4,
      servings: 4,
      cuisine: 'Việt Nam',
      ingredients: ['cá', 'me', 'thơm', 'rau']
    }
  ];

  const scrollContainer = (direction: 'left' | 'right', containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <div
      className="relative group flex-shrink-0 w-[280px] cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
      onClick={() => console.log('Navigate to recipe:', recipe.id)}
    >
      {/* Image */}
      <div className="relative h-[180px]">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Rating badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star size={14} fill="#fbbf24" className="text-amber-400" />
          <span className="text-sm font-medium">{recipe.rating}</span>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Toggle favorite:', recipe.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart size={18} className="text-gray-600 hover:text-red-500 transition-colors" />
        </button>

        {/* Difficulty badge */}
        <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
          recipe.difficulty === 'Dễ' 
            ? 'bg-green-100 text-green-800' 
            : recipe.difficulty === 'Khó' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {recipe.difficulty}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
          {recipe.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.subtitle}</p>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{recipe.duration}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span>{recipe.servings} người</span>
        </div>

        {/* Action button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('View recipe:', recipe.id);
          }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Xem Công Thức
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-100/40 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section - Redesigned */}
      <div className="relative h-[700px] mb-16 overflow-hidden">
        {/* Background image with parallax effect */}
        <div className="absolute inset-0">
          <img
            src={featuredRecipe.image}
            alt={featuredRecipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/50"></div>
        </div>
        
        {/* Content - Full width */}
        <div className="relative h-full flex items-center">
          <div className="w-full px-12 py-16">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-5 py-2 rounded-full font-bold text-sm mb-6">
                <Sparkles size={18} />
                CÔNG THỨC NỔI BẬT
              </div>

              <h1 className="text-white text-5xl font-bold mb-4 leading-tight">
                {featuredRecipe.title}
              </h1>
              <p className="text-gray-200 text-lg mb-6">{featuredRecipe.subtitle}</p>
              
              {/* Ingredients Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {featuredRecipe.ingredients?.slice(0, 4).map((ingredient, index) => (
                  <span key={index} className="px-3 py-1.5 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white border border-white/20">
                    {ingredient}
                  </span>
                ))}
                {(featuredRecipe.ingredients?.length || 0) > 4 && (
                  <span className="px-3 py-1.5 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white border border-white/20">
                    +{(featuredRecipe.ingredients?.length || 0) - 4} more
                  </span>
                )}
              </div>

              <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-2xl">
                Tô phở nóng hổi với nước dùng trong vắt, thịt bò tươi ngon và bánh phở dai ngon. 
                Hương vị đậm đà của quê hương trong từng thìa nước dùng.
              </p>

              {/* Meta info */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-white">
                  <Star size={20} fill="#fbbf24" className="text-amber-400" />
                  <span className="font-bold">{featuredRecipe.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Clock size={20} />
                  <span>{featuredRecipe.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <ChefHat size={20} />
                  <span>{featuredRecipe.difficulty}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white pl-6 pr-8 py-3.5 rounded-full flex items-center gap-3 font-bold text-base transition-all duration-300 shadow-lg">
                  <Play size={20} fill="white" />
                  Xem Công Thức
                </button>
                <button className="bg-gray-800/60 backdrop-blur-sm hover:bg-gray-800/80 text-white p-3.5 rounded-full transition-all duration-300 border border-white/20">
                  <Heart size={20} />
                </button>
                <button className="bg-gray-800/60 backdrop-blur-sm hover:bg-gray-800/80 text-white p-3.5 rounded-full transition-all duration-300 border border-white/20">
                  <Info size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail gallery at bottom right */}
        <div className="absolute bottom-6 right-6 flex gap-2 z-10">
          {featuredRecipes.map((recipe, index) => (
            <div 
              key={recipe.id}
              onClick={() => setSelectedRecipeIndex(index)}
              className={`w-20 h-14 rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-black/20 backdrop-blur-sm ${
                selectedRecipeIndex === index 
                  ? 'border-2 border-yellow-400 scale-105' 
                  : 'border-2 border-white/30'
              }`}
            >
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>

      {/* New Recipes Section */}
      <div className="relative px-12 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-orange-500" size={28} />
              <h2 className="text-gray-900 text-3xl font-bold">
                Món Ăn Mới
              </h2>
            </div>
            <p className="text-gray-600">Khám phá những công thức nấu ăn mới nhất</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scrollContainer('left', 'new-recipes')}
              className="bg-white text-gray-800 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 transform hover:scale-110"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={() => scrollContainer('right', 'new-recipes')}
              className="bg-white text-gray-800 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 transform hover:scale-110"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
        
        <div
          id="new-recipes"
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>

      {/* Popular Recipes Section */}
      <div className="relative px-12 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-pink-600" size={28} />
              <h2 className="text-gray-900 text-3xl font-bold">
                Món Ăn Phổ Biến
              </h2>
            </div>
            <p className="text-gray-600">Những món ăn được yêu thích nhất</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scrollContainer('left', 'popular-recipes')}
              className="bg-white text-gray-800 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 transform hover:scale-110"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={() => scrollContainer('right', 'popular-recipes')}
              className="bg-white text-gray-800 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 transform hover:scale-110"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
        
        <div
          id="popular-recipes"
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {popularRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>

      {/* Footer decoration */}
      <div className="h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
};

export default Home;