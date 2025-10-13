import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    dispatch(fetchIngredientTypes());
  }, [dispatch]);

  const handleSubmitIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientName.trim() || !selectedTypeId) {
      setError('Ingredient name and type are required');
      return;
    }

    setError(null);

    try {
      await dispatch(addIngredient({ 
        name: ingredientName, 
        typeId: selectedTypeId 
      }));
      setIngredientName('');
      onClose();
    } catch (err) {
      setError('Failed to add ingredient. Please try again.');
    }
  };

  const handleSubmitType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) {
      setError('Type name is required');
      return;
    }

    setError(null);

    try {
      const resultAction = await dispatch(addIngredientType(newTypeName));
      if (addIngredientType.fulfilled.match(resultAction)) {
        // If we successfully added the type, select it
        const newType = resultAction.payload;
        setSelectedTypeId(newType._id);
        setNewTypeName('');
        setIsAddingType(false);
      }
    } catch (err) {
      setError('Failed to add ingredient type. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add New Ingredient</h3>
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

        {isAddingType ? (
          <form onSubmit={handleSubmitType}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                New Ingredient Type Name
              </label>
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter type name"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddingType(false)}
                className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Type
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitIngredient}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Ingredient Name
              </label>
              <input
                type="text"
                value={ingredientName}
                onChange={(e) => setIngredientName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter ingredient name"
                required
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">
                  Ingredient Type
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingType(true)}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  + Add New Type
                </button>
              </div>
              <select
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Type</option>
                {ingredientTypes.map((type: IngredientType) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
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
                Save Ingredient
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddIngredientModal;