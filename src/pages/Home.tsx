import { useState, useEffect } from 'react';
import { Heart, Info, Play, ChevronLeft, ChevronRight, Star, Clock, ChefHat, TrendingUp, Sparkles, MessageSquare, Flame, ThumbsUp, TrendingDown } from 'lucide-react';

interface Recipe {
  id: number;
  title: string;
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
  const [canScrollLeft, setCanScrollLeft] = useState<{ [key: string]: boolean }>({});
  const [canScrollRight, setCanScrollRight] = useState<{ [key: string]: boolean }>({});
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-rotate featured recipes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedRecipeIndex((prevIndex) => (prevIndex + 1) % 6);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const featuredRecipes: Recipe[] = [
    {
      id: 0,
      title: 'Phở Bò Hà Nội',
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
      image: 'https://daivietourist.vn/wp-content/uploads/2025/04/quan-bun-bo-hue-1.jpg?w=1200&h=600&fit=crop',
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
      image: 'https://daivietourist.vn/wp-content/uploads/2025/04/quan-bun-bo-hue-1.jpg?w=1200&h=600&fit=crop',
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
      image: 'https://daivietourist.vn/wp-content/uploads/2025/04/quan-bun-bo-hue-1.jpg?w=1200&h=600&fit=crop',
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
      image: 'https://daivietourist.vn/wp-content/uploads/2025/04/quan-bun-bo-hue-1.jpg?w=1200&h=600&fit=crop',
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


  const popularRecipes: Recipe[] = [
    {
      id: 6,
      title: 'Cà Ri Gà',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=600&fit=crop',
      duration: '1h',
      difficulty: 'Trung bình',
      rating: 4.7,
      reviews: 234,
      servings: 5,
      cuisine: 'Việt Nam',
      ingredients: ['gà', 'cà rốt', 'khoai tây', 'cà ri']
    },
    {
      id: 7,
      title: 'Bánh Xèo',
      image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=600&fit=crop',
      duration: '45 phút',
      difficulty: 'Trung bình',
      rating: 4.6,
      reviews: 198,
      servings: 4,
      cuisine: 'Việt Nam',
      ingredients: ['bột', 'tôm', 'thịt', 'giá']
    },
    {
      id: 8,
      title: 'Chả Giò',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=600&fit=crop',
      duration: '40 phút',
      difficulty: 'Dễ',
      rating: 4.8,
      reviews: 267,
      servings: 6,
      cuisine: 'Việt Nam',
      ingredients: ['bánh tráng', 'thịt', 'miến', 'nấm']
    },
    {
      id: 9,
      title: 'Hủ Tiếu Nam Vang',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=600&fit=crop',
      duration: '55 phút',
      difficulty: 'Trung bình',
      rating: 4.5,
      reviews: 156,
      servings: 4,
      cuisine: 'Việt Nam',
      ingredients: ['hủ tiếu', 'tôm', 'thịt', 'giá']
    },
    {
      id: 10,
      title: 'Canh Chua',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=600&fit=crop',
      duration: '35 phút',
      difficulty: 'Dễ',
      rating: 4.4,
      reviews: 143,
      servings: 4,
      cuisine: 'Việt Nam',
      ingredients: ['cá', 'me', 'thơm', 'rau']
    }
  ];

  // Check scroll position to show/hide arrows
  const checkScrollPosition = (containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      const canLeft = container.scrollLeft > 0;
      const canRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 10;

      setCanScrollLeft(prev => ({ ...prev, [containerId]: canLeft }));
      setCanScrollRight(prev => ({ ...prev, [containerId]: canRight }));
    }
  };

  // Initialize scroll position check
  useEffect(() => {
    const containers = ['new-recipes', 'popular-recipes'];
    containers.forEach(id => {
      checkScrollPosition(id);
      const container = document.getElementById(id);
      if (container) {
        container.addEventListener('scroll', () => checkScrollPosition(id));
      }
    });

    return () => {
      containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
          container.removeEventListener('scroll', () => checkScrollPosition(id));
        }
      });
    };
  }, []);

  const scrollContainer = (direction: 'left' | 'right', containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(() => checkScrollPosition(containerId), 300);
    }
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent, containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      setIsDragging(true);
      setStartX(e.pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
      container.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent, containerId: string) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = document.getElementById(containerId);
    if (container) {
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = (containerId: string) => {
    setIsDragging(false);
    const container = document.getElementById(containerId);
    if (container) {
      container.style.cursor = 'grab';
      checkScrollPosition(containerId);
    }
  };

  const handleMouseLeave = (containerId: string) => {
    if (isDragging) {
      setIsDragging(false);
      const container = document.getElementById(containerId);
      if (container) {
        container.style.cursor = 'grab';
      }
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
        <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${recipe.difficulty === 'Dễ'
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

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{recipe.duration}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span>{recipe.servings} người</span>
        </div>

        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {ingredient}
              </span>
            ))}
            {recipe.ingredients.length > 4 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                +{recipe.ingredients.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Rating and Action button */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-gray-600">
            {recipe.reviews ? `${recipe.reviews} đánh giá` : '0 đánh giá'}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('View recipe:', recipe.id);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            View Recipe
          </button>
        </div>
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
      <div className="relative h-[660px] mb-16 overflow-hidden">
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

              {/* Ingredients Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {featuredRecipe.ingredients?.slice(0, 4).map((ingredient, index) => (
                  <span key={index} className="px-3 py-1.5 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white border border-white/20">
                    {ingredient}
                  </span>
                ))}
                {(featuredRecipe.ingredients?.length || 0) > 4 && (
                  <span className="px-3 py-1.5 rounded-md text-sm bg-white/10 backdrop-blur-sm text-white border border-white/20">
                    +{(featuredRecipe.ingredients?.length || 0) - 4}
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
              className={`w-20 h-14 rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-black/20 backdrop-blur-sm ${selectedRecipeIndex === index
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-orange-500" size={28} />
            <h2 className="text-gray-900 text-3xl font-bold">
              Món Ăn Mới
            </h2>
          </div>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft['new-recipes'] && (
            <button
              onClick={() => scrollContainer('left', 'new-recipes')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            id="new-recipes"
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={(e) => handleMouseDown(e, 'new-recipes')}
            onMouseMove={(e) => handleMouseMove(e, 'new-recipes')}
            onMouseUp={() => handleMouseUp('new-recipes')}
            onMouseLeave={() => handleMouseLeave('new-recipes')}
          >
            {newRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight['new-recipes'] && (
            <button
              onClick={() => scrollContainer('right', 'new-recipes')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Popular Recipes Section */}
      <div className="relative px-12 mb-20">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-pink-600" size={28} />
            <h2 className="text-gray-900 text-3xl font-bold">
              Món Ăn Phổ Biến
            </h2>
          </div>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft['popular-recipes'] && (
            <button
              onClick={() => scrollContainer('left', 'popular-recipes')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            id="popular-recipes"
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={(e) => handleMouseDown(e, 'popular-recipes')}
            onMouseMove={(e) => handleMouseMove(e, 'popular-recipes')}
            onMouseUp={() => handleMouseUp('popular-recipes')}
            onMouseLeave={() => handleMouseLeave('popular-recipes')}
          >
            {popularRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight['popular-recipes'] && (
            <button
              onClick={() => scrollContainer('right', 'popular-recipes')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* TOP BÌNH LUẬN Section - Full Width Scrollable */}
      <div className="relative px-12 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="text-green-500" size={28} />
          <h3 className="text-gray-900 text-2xl font-bold">TOP BÌNH LUẬN</h3>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft['top-comments'] && (
            <button
              onClick={() => scrollContainer('left', 'top-comments')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            id="top-comments"
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={(e) => handleMouseDown(e, 'top-comments')}
            onMouseMove={(e) => handleMouseMove(e, 'top-comments')}
            onMouseUp={() => handleMouseUp('top-comments')}
            onMouseLeave={() => handleMouseLeave('top-comments')}
          >
            {[
              {
                user: { name: 'Minh Anh', avatar: 'https://i.pravatar.cc/150?img=1' },
                recipe: { title: 'Phở Bò Hà Nội', thumbnail: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200&h=280&fit=crop' },
                comment: 'Nước dùng thanh ngọt, thịt bò mềm tan. Công thức này hay quá!',
                likes: 5,
                views: 120,
                replies: 3
              },
              {
                user: { name: 'Quốc Huy', avatar: 'https://i.pravatar.cc/150?img=5' },
                recipe: { title: 'Bún Chả Hà Nội', thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=280&fit=crop' },
                comment: 'Chả nướng thơm phức, nước mắm pha vừa miệng. Gia đình mình rất thích!',
                likes: 7,
                views: 95,
                replies: 1
              },
              {
                user: { name: 'Thu Hà', avatar: 'https://i.pravatar.cc/150?img=9' },
                recipe: { title: 'Gỏi Cuốn Tôm Thịt', thumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=280&fit=crop' },
                comment: 'Cuốn đẹp mắt, rau tươi ngon. Nước chấm đậm đà cực kỳ!',
                likes: 2,
                views: 78,
                replies: 0
              },
              {
                user: { name: 'Văn Long', avatar: 'https://i.pravatar.cc/150?img=10' },
                recipe: { title: 'Cơm Tấm Sườn', thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=280&fit=crop' },
                comment: 'Sườn nướng mềm thơm, cơm tấm dẻo vừa phải. Rất ngon!',
                likes: 4,
                views: 156,
                replies: 10
              },
              {
                user: { name: 'Thanh Tùng', avatar: 'https://i.pravatar.cc/150?img=12' },
                recipe: { title: 'Bánh Xèo Miền Tây', thumbnail: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=280&fit=crop' },
                comment: 'Bánh giòn rụm, nhân đầy đặn. Ăn kèm rau sống tuyệt vời!',
                likes: 1,
                views: 89,
                replies: 2
              }
            ].map((item, index) => (
              <div key={index} className="flex-shrink-0 w-[300px] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200">
                <div className="relative h-[180px]">
                  <img src={item.recipe.thumbnail} alt={item.recipe.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="relative">
                        <img src={item.user.avatar} alt={item.user.name} className="w-10 h-10 rounded-full border-2 border-white" />
                      </div>
                      <span className="text-white font-semibold">{item.user.name}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-sm line-clamp-2 mb-3">{item.comment}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400" />
                      {item.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      {item.replies}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight['top-comments'] && (
            <button
              onClick={() => scrollContainer('right', 'top-comments')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Three Columns Section */}
      <div className="relative px-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SỐI NỔI NHẤT */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="text-green-500" size={24} />
              <h3 className="text-gray-900 text-xl font-bold">SỐI NỔI NHẤT</h3>
            </div>

            <div className="space-y-3">
              {[
                { rank: 1, title: 'Phở Bò Hà Nội', thumbnail: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=60&h=80&fit=crop', trending: 'up' },
                { rank: 2, title: 'Bún Chả Hà Nội', thumbnail: 'https://cdn.tgdd.vn/2022/01/CookRecipe/Avatar/bun-cha-ha-noi-cong-thuc-chia-se-tu-nguoi-dung-thumbnail.jpg?w=60&h=80&fit=crop', trending: 'up' },
                { rank: 3, title: 'Cơm Tấm Sườn Nướng', thumbnail: 'https://i.ytimg.com/vi/cJu6tFJe_Gc/maxresdefault.jpg?w=60&h=80&fit=crop', trending: 'same' },
                { rank: 4, title: 'Bánh Mì Việt Nam', thumbnail: 'https://cdn-i2.congthuong.vn/stores/news_dataimages/2024/032024/16/09/top-1-mon-sandwich-ngon-nhat-the-gioi-goi-ten-banh-my-viet-nam1710498007-182420240316092132.jpg?w=60&h=80&fit=crop', trending: 'down' },
                { rank: 5, title: 'Gỏi Cuốn Tôm Thịt', thumbnail: 'https://i.ytimg.com/vi/w34Qnc-9KBU/hq720.jpg?w=60&h=80&fit=crop', trending: 'down' }
              ].map((item) => (
                <div key={item.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <span className="text-xl font-bold text-gray-500 w-6">{item.rank}.</span>
                  {item.trending === 'up' ? (
                    <TrendingUp size={18} className="text-green-500" />
                  ) : item.trending === 'down' ? (
                    <TrendingDown size={18} className="text-red-500" />
                  ) : (
                    <div className="w-[18px] h-[18px] flex items-center justify-center">
                      <div className="w-3 h-0.5 bg-gray-500"></div>
                    </div>
                  )}
                  <img src={item.thumbnail} alt={item.title} className="w-10 h-14 rounded-md object-cover flex-shrink-0" />
                  <span className="text-gray-900 text-sm flex-1 line-clamp-2">{item.title}</span>
                </div>
              ))}
              <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium py-2">
                Xem thêm
              </button>
            </div>
          </div>

          {/* YÊU THÍCH NHẤT */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <ThumbsUp className="text-blue-500" size={24} />
              <h3 className="text-gray-900 text-xl font-bold">YÊU THÍCH NHẤT</h3>
            </div>

            <div className="space-y-3">
              {[
                { rank: 1, title: 'Bún Bò Huế', thumbnail: 'https://daivietourist.vn/wp-content/uploads/2025/04/quan-bun-bo-hue-1.jpg?w=60&h=80&fit=crop', trending: 'up' },
                { rank: 2, title: 'Phở Bò Hà Nội', thumbnail: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=60&h=80&fit=crop', trending: 'down' },
                { rank: 3, title: 'Cà Ri Gà', thumbnail: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=60&h=80&fit=crop', trending: 'up' },
                { rank: 4, title: 'Bánh Xèo Miền Tây', thumbnail: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=60&h=80&fit=crop', trending: 'up' },
                { rank: 5, title: 'Chả Giò Rán', thumbnail: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=60&h=80&fit=crop', trending: 'down' }
              ].map((item) => (
                <div key={item.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <span className="text-xl font-bold text-gray-500 w-6">{item.rank}.</span>
                  {item.trending === 'up' ? (
                    <TrendingUp size={18} className="text-green-500" />
                  ) : item.trending === 'down' ? (
                    <TrendingDown size={18} className="text-red-500" />
                  ) : (
                    <div className="w-[18px] h-[18px] flex items-center justify-center">
                      <div className="w-3 h-0.5 bg-gray-500"></div>
                    </div>
                  )}
                  <img src={item.thumbnail} alt={item.title} className="w-10 h-14 rounded-md object-cover flex-shrink-0" />
                  <span className="text-gray-900 text-sm flex-1 line-clamp-2">{item.title}</span>
                </div>
              ))}
              <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium py-2">
                Xem thêm
              </button>
            </div>
          </div>

          {/* BÌNH LUẬN MỚI */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-purple-500" size={24} />
              <h3 className="text-gray-900 text-xl font-bold">BÌNH LUẬN MỚI</h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  user: { name: 'Hương Giang', avatar: 'https://i.pravatar.cc/150?img=33' },
                  recipe: 'Phở Bò Hà Nội',
                  comment: 'Mới thử làm lần đầu mà ngon không tưởng! Cảm ơn công thức hay này!'
                },
                {
                  user: { name: 'Minh Tuấn', avatar: 'https://i.pravatar.cc/150?img=25' },
                  recipe: 'Bún Chả Hà Nội',
                  comment: 'Chả nướng thơm phức, nước mắm pha chuẩn vị. Gia đình rất thích!'
                },
                {
                  user: { name: 'Lan Anh', avatar: 'https://i.pravatar.cc/150?img=47' },
                  recipe: 'Gỏi Cuốn Tôm Thịt',
                  comment: 'Cuốn đẹp mắt lắm, ăn nhẹ nhàng mà ngon miệng'
                },
                {
                  user: { name: 'Đức Anh', avatar: 'https://i.pravatar.cc/150?img=56' },
                  recipe: 'Cơm Tấm Sườn Nướng',
                  comment: 'Sườn nướng mềm thơm, cơm dẻo vừa ý. Tuyệt vời!'
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="relative flex-shrink-0">
                    <img src={item.user.avatar} alt={item.user.name} className="w-10 h-10 rounded-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-gray-900">{item.user.name}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Play size={10} className="text-orange-500" />
                      <span className="text-xs text-gray-600 line-clamp-1">{item.recipe}</span>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2">{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer decoration */}
      <div className="h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
};

export default Home;