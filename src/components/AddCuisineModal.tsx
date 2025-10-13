import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCuisine } from '../redux/slices/recipeSlice';
import type { AppDispatch } from '../redux/store';

interface AddCuisineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCuisineModal: React.FC<AddCuisineModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [cuisineName, setCuisineName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cuisineName.trim()) {
      setError('Cuisine name is required');
      return;
    }

    setError(null);

    try {
      await dispatch(addCuisine(cuisineName));
      setCuisineName('');
      onClose();
    } catch (err) {
      setError('Failed to add cuisine. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add New Cuisine</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Cuisine Name
            </label>
            <input
              type="text"
              value={cuisineName}
              onChange={(e) => setCuisineName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter cuisine name"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Cuisine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCuisineModal;