import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { 
  addIngredient, 
  fetchIngredientTypes,
  addIngredientType
} from '../redux/slices/recipeSlice';
import type { IngredientType } from '../redux/slices/recipeSlice';
import type { AppDispatch, RootState } from '../redux/store';

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ingredientTypes } = useSelector((state: RootState) => state.recipes);

  const [ingredientName, setIngredientName] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [isAddingType, setIsAddingType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  
  useEffect(() => {
    dispatch(fetchIngredientTypes());
  }, [dispatch]);

  const handleSubmitIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientName.trim() || !selectedTypeId) {
      toast.error('Tên nguyên liệu và loại nguyên liệu không được để trống!');
      return;
    }

    try {
      await dispatch(addIngredient({ 
        name: ingredientName, 
        typeId: selectedTypeId 
      })).unwrap();
      toast.success('Thêm nguyên liệu thành công!');
      setIngredientName('');
      onClose();
    } catch (error: any) {
      const errorMessage = error || 'Thêm nguyên liệu thất bại!';
      toast.error(errorMessage);
    }
  };

  const handleSubmitType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) {
      toast.error('Tên loại nguyên liệu không được để trống!');
      return;
    }

    try {
      const newType = await dispatch(addIngredientType(newTypeName)).unwrap();
      toast.success('Thêm loại nguyên liệu thành công!');
      setSelectedTypeId(newType._id);
      setNewTypeName('');
      setIsAddingType(false);
    } catch (error: any) {
      const errorMessage = error || 'Thêm loại nguyên liệu thất bại!';
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20 p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-orange-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-t-2xl">
          <h2 className="text-lg font-semibold">Thêm nguyên liệu mới</h2>
          <button onClick={onClose} className="hover:scale-110 transition">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {isAddingType ? (
            <form onSubmit={handleSubmitType} className="space-y-4">
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-3">
                  Thêm loại nguyên liệu mới
                </h3>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tên loại nguyên liệu
                </label>
                <input
                  type="text"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                  placeholder="Nhập tên loại nguyên liệu"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingType(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:opacity-90"
                >
                  Lưu loại
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitIngredient} className="space-y-4">
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-3">
                  Thông tin nguyên liệu
                </h3>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tên nguyên liệu
                </label>
                <input
                  type="text"
                  value={ingredientName}
                  onChange={(e) => setIngredientName(e.target.value)}
                  className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                  placeholder="Nhập tên nguyên liệu"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-600">
                    Loại nguyên liệu
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingType(true)}
                    className="text-orange-500 text-sm hover:underline"
                  >
                    + Thêm loại mới
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={selectedTypeId}
                    onChange={(e) => setSelectedTypeId(e.target.value)}
                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none appearance-none"
                    required
                  >
                    <option value="">Chọn loại nguyên liệu</option>
                    {ingredientTypes.map((type: IngredientType) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
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

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:opacity-90"
                >
                  Lưu nguyên liệu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddIngredientModal;