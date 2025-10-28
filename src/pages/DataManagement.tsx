import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../redux/store';
import {
    fetchCategories,
    fetchCuisines,
    fetchTags,
    fetchIngredients,
    fetchIngredientTypes,
    deleteCategory,
    deleteCuisine,
    deleteTag,
    deleteIngredient,
    deleteIngredientType,
    updateCategory,
    updateCuisine,
    updateTag,
    updateIngredient,
    updateIngredientType,
} from '../redux/slices/recipeSlice';
import { Edit, Trash2, Plus, Search, X, Check, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import AddCategoryModal from '../components/AddCategoryModal';
import AddCuisineModal from '../components/AddCuisineModal';
import AddTagModal from '../components/AddTagModal';
import AddIngredientModal from '../components/AddIngredientModal';

const DataManagement: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { categories, cuisines, tags, ingredients, ingredientTypes } = useSelector(
        (state: RootState) => state.recipes
    );

    const [activeTab, setActiveTab] = useState<'categories' | 'cuisines' | 'tags' | 'ingredients'>('categories');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal states
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isCuisineModalOpen, setIsCuisineModalOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
    
    // Edit states
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    
    // Delete confirm
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string; type: string } | null>(null);
    
    // Expanded ingredient types
    const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCuisines());
        dispatch(fetchTags());
        dispatch(fetchIngredients());
        dispatch(fetchIngredientTypes());
    }, [dispatch]);

    const handleEdit = (id: string, name: string) => {
        setEditingId(id);
        setEditingName(name);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleSaveEdit = async (id: string, type: string) => {
        if (!editingName.trim()) {
            toast.error('Tên không được để trống!');
            return;
        }

        try {
            switch (type) {
                case 'category':
                    await dispatch(updateCategory({ id, category: { name: editingName } })).unwrap();
                    break;
                case 'cuisine':
                    await dispatch(updateCuisine({ id, cuisine: { name: editingName } })).unwrap();
                    break;
                case 'tag':
                    await dispatch(updateTag({ id, tag: { name: editingName } })).unwrap();
                    break;
                case 'ingredient':
                    await dispatch(updateIngredient({ id, ingredient: { name: editingName } })).unwrap();
                    break;
                case 'ingredientType':
                    await dispatch(updateIngredientType({ id, type: { name: editingName } })).unwrap();
                    break;
            }
            toast.success('Cập nhật thành công!');
            setEditingId(null);
            setEditingName('');
        } catch {
            toast.error('Cập nhật thất bại!');
        }
    };

    const handleDelete = (id: string, name: string, type: string) => {
        setDeleteConfirm({ id, name, type });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            const { id, type } = deleteConfirm;
            switch (type) {
                case 'category':
                    await dispatch(deleteCategory(id)).unwrap();
                    break;
                case 'cuisine':
                    await dispatch(deleteCuisine(id)).unwrap();
                    break;
                case 'tag':
                    await dispatch(deleteTag(id)).unwrap();
                    break;
                case 'ingredient':
                    await dispatch(deleteIngredient(id)).unwrap();
                    break;
                case 'ingredientType':
                    await dispatch(deleteIngredientType(id)).unwrap();
                    break;
            }
            toast.success('Xóa thành công!');
            setDeleteConfirm(null);
        } catch {
            toast.error('Xóa thất bại! Có thể dữ liệu đang được sử dụng.');
        }
    };

    const toggleTypeExpansion = (typeId: string) => {
        setExpandedTypes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(typeId)) {
                newSet.delete(typeId);
            } else {
                newSet.add(typeId);
            }
            return newSet;
        });
    };

    const getIngredientsByType = (typeId: string) => {
        return ingredients.filter(ing => ing.typeId === typeId);
    };

    const getFilteredData = () => {
        let data: Array<{ _id: string; name: string }> = [];
        let type = '';

        switch (activeTab) {
            case 'categories':
                data = categories;
                type = 'category';
                break;
            case 'cuisines':
                data = cuisines;
                type = 'cuisine';
                break;
            case 'tags':
                data = tags;
                type = 'tag';
                break;
            case 'ingredients':
                // For ingredients tab, we'll use ingredient types as main data
                return { data: [], type: 'ingredients', isHierarchical: true };
        }

        const filtered = data.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return { data: filtered, type, isHierarchical: false };
    };

    const { data: filteredData, type, isHierarchical } = getFilteredData();
    
    // Filter ingredient types and ingredients for hierarchical view
    const filteredIngredientTypes = ingredientTypes.filter(type =>
        type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ingredients.some(ing => 
            ing.typeId === type._id && 
            ing.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const getTabLabel = (tab: string) => {
        switch (tab) {
            case 'categories':
                return 'Danh mục';
            case 'cuisines':
                return 'Ẩm thực';
            case 'tags':
                return 'Thẻ';
            case 'ingredients':
                return 'Nguyên liệu & Loại';
            default:
                return '';
        }
    };

    const openAddModal = () => {
        switch (activeTab) {
            case 'categories':
                setIsCategoryModalOpen(true);
                break;
            case 'cuisines':
                setIsCuisineModalOpen(true);
                break;
            case 'tags':
                setIsTagModalOpen(true);
                break;
            case 'ingredients':
                setIsIngredientModalOpen(true);
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Quay lại Dashboard</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý dữ liệu</h1>
                    <p className="text-gray-600">
                        Quản lý danh mục, ẩm thực, thẻ, nguyên liệu và loại nguyên liệu
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {['categories', 'cuisines', 'tags', 'ingredients'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab as 'categories' | 'cuisines' | 'tags' | 'ingredients');
                                        setSearchQuery('');
                                    }}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {getTabLabel(tab)}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Search and Add */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder={`Tìm kiếm ${getTabLabel(activeTab).toLowerCase()}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
                        >
                            <Plus size={20} />
                            <span>Thêm mới</span>
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {isHierarchical ? (
                            // Hierarchical view for ingredients
                            <div className="divide-y divide-gray-200">
                                {filteredIngredientTypes.length > 0 ? (
                                    filteredIngredientTypes.map((ingredientType, typeIndex) => {
                                        const typeIngredients = getIngredientsByType(ingredientType._id).filter(ing =>
                                            !searchQuery || ing.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        );
                                        const isExpanded = expandedTypes.has(ingredientType._id);
                                        
                                        return (
                                            <div key={ingredientType._id}>
                                                {/* Ingredient Type Row */}
                                                <div className="bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-colors">
                                                    <div className="px-6 py-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <button
                                                                onClick={() => toggleTypeExpansion(ingredientType._id)}
                                                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                                            >
                                                                <svg
                                                                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </button>
                                                            <span className="text-sm font-bold text-gray-700">
                                                                {typeIndex + 1}.
                                                            </span>
                                                            {editingId === ingredientType._id ? (
                                                                <input
                                                                    type="text"
                                                                    value={editingName}
                                                                    onChange={(e) => setEditingName(e.target.value)}
                                                                    className="border border-orange-500 rounded px-3 py-1 focus:ring-2 focus:ring-orange-500 outline-none flex-1"
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span className="text-base font-bold text-gray-900">
                                                                    {ingredientType.name}
                                                                </span>
                                                            )}
                                                            <span className="ml-2 px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">
                                                                {typeIngredients.length} nguyên liệu
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {editingId === ingredientType._id ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleSaveEdit(ingredientType._id, 'ingredientType')}
                                                                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                                                                        title="Lưu"
                                                                    >
                                                                        <Check size={18} />
                                                                    </button>
                                                                    <button
                                                                        onClick={handleCancelEdit}
                                                                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded transition-colors"
                                                                        title="Hủy"
                                                                    >
                                                                        <X size={18} />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleEdit(ingredientType._id, ingredientType.name)}
                                                                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                                                        title="Sửa loại"
                                                                    >
                                                                        <Edit size={18} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(ingredientType._id, ingredientType.name, 'ingredientType')}
                                                                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                                                        title="Xóa loại"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Ingredients under this type */}
                                                {isExpanded && (
                                                    <div className="bg-white">
                                                        {typeIngredients.length > 0 ? (
                                                            typeIngredients.map((ingredient, ingIndex) => (
                                                                <div
                                                                    key={ingredient._id}
                                                                    className="px-6 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between border-l-4 border-orange-200"
                                                                >
                                                                    <div className="flex items-center gap-3 flex-1 ml-8">
                                                                        <span className="text-sm text-gray-500">
                                                                            {typeIndex + 1}.{ingIndex + 1}
                                                                        </span>
                                                                        {editingId === ingredient._id ? (
                                                                            <input
                                                                                type="text"
                                                                                value={editingName}
                                                                                onChange={(e) => setEditingName(e.target.value)}
                                                                                className="border border-orange-500 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 outline-none flex-1"
                                                                                autoFocus
                                                                            />
                                                                        ) : (
                                                                            <span className="text-sm font-medium text-gray-700">
                                                                                {ingredient.name}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {editingId === ingredient._id ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => handleSaveEdit(ingredient._id, 'ingredient')}
                                                                                    className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                                                                                    title="Lưu"
                                                                                >
                                                                                    <Check size={16} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={handleCancelEdit}
                                                                                    className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded transition-colors"
                                                                                    title="Hủy"
                                                                                >
                                                                                    <X size={16} />
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => handleEdit(ingredient._id, ingredient.name)}
                                                                                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                                                                    title="Sửa nguyên liệu"
                                                                                >
                                                                                    <Edit size={16} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDelete(ingredient._id, ingredient.name, 'ingredient')}
                                                                                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                                                                    title="Xóa nguyên liệu"
                                                                                >
                                                                                    <Trash2 size={16} />
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-6 py-4 text-center text-sm text-gray-500 ml-8">
                                                                Chưa có nguyên liệu nào trong loại này
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="px-6 py-12 text-center text-gray-500">
                                        {searchQuery
                                            ? 'Không tìm thấy kết quả phù hợp'
                                            : 'Chưa có loại nguyên liệu nào'}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Normal table view for other tabs
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tên
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingId === item._id ? (
                                                        <input
                                                            type="text"
                                                            value={editingName}
                                                            onChange={(e) => setEditingName(e.target.value)}
                                                            className="border border-orange-500 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 outline-none"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {item.name}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {editingId === item._id ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleSaveEdit(item._id, type)}
                                                                className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                                                                title="Lưu"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded transition-colors"
                                                                title="Hủy"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(item._id, item.name)}
                                                                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                                                title="Sửa"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item._id, item.name, type)}
                                                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                                                title="Xóa"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                                {searchQuery
                                                    ? 'Không tìm thấy kết quả phù hợp'
                                                    : `Chưa có ${getTabLabel(activeTab).toLowerCase()} nào`}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            {isHierarchical ? (
                                <>
                                    Tổng số: <span className="font-semibold text-gray-900">{filteredIngredientTypes.length}</span> loại nguyên liệu, 
                                    <span className="font-semibold text-gray-900 ml-1">{ingredients.length}</span> nguyên liệu
                                </>
                            ) : (
                                <>
                                    Tổng số: <span className="font-semibold text-gray-900">{filteredData.length}</span>{' '}
                                    {getTabLabel(activeTab).toLowerCase()}
                                </>
                            )}
                            {searchQuery && ` (đã lọc)`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
            <AddCuisineModal
                isOpen={isCuisineModalOpen}
                onClose={() => setIsCuisineModalOpen(false)}
            />
            <AddTagModal
                isOpen={isTagModalOpen}
                onClose={() => setIsTagModalOpen(false)}
            />
            <AddIngredientModal
                isOpen={isIngredientModalOpen}
                onClose={() => setIsIngredientModalOpen(false)}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            Xác nhận xóa
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            Bạn có chắc chắn muốn xóa "<span className="font-semibold">{deleteConfirm.name}</span>"?
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataManagement;
