import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addTag } from '../redux/slices/recipeSlice';
import type { AppDispatch } from '../redux/store';

interface AddTagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTagModal: React.FC<AddTagModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [tagName, setTagName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) {
      toast.error('Tên thẻ không được để trống!');
      return;
    }

    try {
      await dispatch(addTag(tagName)).unwrap();
      toast.success('Thêm thẻ thành công!');
      setTagName('');
      onClose();
    } catch (error: any) {
      const errorMessage = error || 'Thêm thẻ thất bại!';
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20 p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-orange-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-t-2xl">
          <h2 className="text-lg font-semibold">Thêm thẻ mới</h2>
          <button onClick={onClose} className="hover:scale-110 transition">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-3">
                Thông tin thẻ
              </h3>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tên thẻ
              </label>
              <input
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="Nhập tên thẻ"
                required
              />
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
                Lưu thẻ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTagModal;