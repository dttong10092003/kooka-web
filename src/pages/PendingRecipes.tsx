import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Clock, 
  User, 
  Calendar, 
  ChefHat,
  Search
} from 'lucide-react';

interface PendingRecipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  submittedBy: {
    id: string;
    username: string;
    email: string;
  };
  submittedAt: string;
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  instructions: string[];
  tags: string[];
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
}

const PendingRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<PendingRecipe[]>([
    // Mock data for demo
    {
      id: '1',
      name: 'Phở Bò Hà Nội',
      description: 'Món phở bò truyền thống Hà Nội với nước dùng đậm đà',
      imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400',
      submittedBy: {
        id: 'user1',
        username: 'nguyenvana',
        email: 'nguyenvana@example.com',
      },
      submittedAt: '2024-01-15T10:30:00',
      cookingTime: 120,
      servings: 4,
      difficulty: 'medium',
      ingredients: [
        { name: 'Xương bò', quantity: '1', unit: 'kg' },
        { name: 'Bánh phở', quantity: '500', unit: 'g' },
        { name: 'Thịt bò', quantity: '300', unit: 'g' },
        { name: 'Hành tây', quantity: '2', unit: 'củ' },
      ],
      instructions: [
        'Chần sơ xương bò với nước sôi',
        'Nấu nước dùng với xương, hành tây trong 2-3 tiếng',
        'Luộc bánh phở',
        'Xếp thịt bò thái mỏng vào tô, chan nước dùng nóng',
      ],
      tags: ['Phở', 'Món Việt', 'Bò'],
      notes: 'Công thức này được truyền từ bà của tôi',
      status: 'pending',
    },
    {
      id: '2',
      name: 'Bún Chả Hà Nội',
      description: 'Món bún chả đặc sản Hà Nội với thịt nướng thơm phức',
      imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
      submittedBy: {
        id: 'user2',
        username: 'tranthib',
        email: 'tranthib@example.com',
      },
      submittedAt: '2024-01-16T14:20:00',
      cookingTime: 45,
      servings: 2,
      difficulty: 'easy',
      ingredients: [
        { name: 'Thịt ba chỉ', quantity: '300', unit: 'g' },
        { name: 'Bún tươi', quantity: '200', unit: 'g' },
        { name: 'Nước mắm', quantity: '3', unit: 'thìa' },
        { name: 'Rau sống', quantity: '1', unit: 'bó' },
      ],
      instructions: [
        'Ướp thịt với gia vị trong 30 phút',
        'Nướng thịt trên than hoa',
        'Pha nước chấm chua ngọt',
        'Bày bún, rau và thịt ra đĩa',
      ],
      tags: ['Bún Chả', 'Món Việt', 'Nướng'],
      notes: 'Ngon nhất khi ăn nóng',
      status: 'pending',
    },
  ]);

  const [selectedRecipe, setSelectedRecipe] = useState<PendingRecipe | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter(recipe => {
    const matchesFilter = filter === 'all' || recipe.status === filter;
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.submittedBy.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (recipeId: string) => {
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id === recipeId ? { ...recipe, status: 'approved' as const } : recipe
      )
    );
    setSelectedRecipe(null);
    // TODO: Call API to approve recipe
  };

  const handleReject = (recipeId: string) => {
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id === recipeId ? { ...recipe, status: 'rejected' as const } : recipe
      )
    );
    setSelectedRecipe(null);
    // TODO: Call API to reject recipe
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quản lý món ăn đề xuất
          </h1>
          <p className="text-gray-600">
            Duyệt và quản lý các món ăn được người dùng đề xuất
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên món hoặc người đề xuất..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tất cả ({recipes.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'pending'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Chờ duyệt ({recipes.filter(r => r.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'approved'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Đã duyệt ({recipes.filter(r => r.status === 'approved').length})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'rejected'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Từ chối ({recipes.filter(r => r.status === 'rejected').length})
              </button>
            </div>
          </div>
        </div>

        {/* Recipe List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="relative">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                />
                <span
                  className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    recipe.status
                  )}`}
                >
                  {recipe.status === 'pending' ? 'Chờ duyệt' : recipe.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {recipe.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <User size={16} />
                  <span>{recipe.submittedBy.username}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Calendar size={16} />
                  <span>{formatDate(recipe.submittedAt)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{recipe.cookingTime} phút</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat size={16} />
                    <span className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty === 'easy' ? 'Dễ' : recipe.difficulty === 'medium' ? 'TB' : 'Khó'}
                    </span>
                  </div>
                  <div>
                    <span>{recipe.servings} người</span>
                  </div>
                </div>

                {recipe.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(recipe.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check size={18} />
                      Duyệt
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(recipe.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={18} />
                      Từ chối
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ChefHat size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không có món ăn nào
            </h3>
            <p className="text-gray-500">
              Chưa có món ăn đề xuất nào trong danh mục này
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chi tiết món ăn
                </h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <img
                  src={selectedRecipe.imageUrl}
                  alt={selectedRecipe.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-bold text-gray-800">
                      {selectedRecipe.name}
                    </h3>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                        selectedRecipe.status
                      )}`}
                    >
                      {selectedRecipe.status === 'pending' ? 'Chờ duyệt' : selectedRecipe.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="text-orange-500" size={20} />
                      <span>
                        <strong>Người đề xuất:</strong> {selectedRecipe.submittedBy.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-orange-500" size={20} />
                      <span>
                        <strong>Ngày gửi:</strong> {formatDate(selectedRecipe.submittedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Clock className="mx-auto text-orange-500 mb-2" size={24} />
                      <p className="text-sm text-gray-600">Thời gian</p>
                      <p className="font-bold">{selectedRecipe.cookingTime} phút</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <User className="mx-auto text-orange-500 mb-2" size={24} />
                      <p className="text-sm text-gray-600">Khẩu phần</p>
                      <p className="font-bold">{selectedRecipe.servings} người</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <ChefHat className="mx-auto text-orange-500 mb-2" size={24} />
                      <p className="text-sm text-gray-600">Độ khó</p>
                      <p className={`font-bold ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                        {selectedRecipe.difficulty === 'easy' ? 'Dễ' : selectedRecipe.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-3">Nguyên liệu</h4>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span>
                          {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-3">Các bước thực hiện</h4>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <p className="flex-1 pt-1">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tags */}
                {selectedRecipe.tags.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipe.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedRecipe.notes && (
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-3">Ghi chú</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {selectedRecipe.notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedRecipe.status === 'pending' && (
                  <div className="flex gap-4 pt-4 border-t">
                    <button
                      onClick={() => handleReject(selectedRecipe.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors"
                    >
                      <X size={20} />
                      Từ chối
                    </button>
                    <button
                      onClick={() => handleApprove(selectedRecipe.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors"
                    >
                      <Check size={20} />
                      Duyệt món ăn
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRecipes;
