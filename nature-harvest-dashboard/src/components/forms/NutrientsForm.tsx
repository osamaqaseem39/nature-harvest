import React from 'react';

interface Nutrients {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitaminC?: number;
  vitaminA?: number;
  calcium?: number;
  iron?: number;
}

interface NutrientsFormProps {
  nutrients: Nutrients;
  onChange: (nutrients: Nutrients) => void;
  className?: string;
}

const NutrientsForm: React.FC<NutrientsFormProps> = ({
  nutrients,
  onChange,
  className = ''
}) => {
  const handleChange = (field: keyof Nutrients, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onChange({
      ...nutrients,
      [field]: numValue
    });
  };

  const nutrientFields = [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbohydrates', label: 'Carbohydrates', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' },
    { key: 'fiber', label: 'Fiber', unit: 'g' },
    { key: 'sugar', label: 'Sugar', unit: 'g' },
    { key: 'sodium', label: 'Sodium', unit: 'mg' },
    { key: 'vitaminC', label: 'Vitamin C', unit: 'mg' },
    { key: 'vitaminA', label: 'Vitamin A', unit: 'IU' },
    { key: 'calcium', label: 'Calcium', unit: 'mg' },
    { key: 'iron', label: 'Iron', unit: 'mg' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Nutritional Information</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter nutritional values per serving. All fields are optional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nutrientFields.map(({ key, label, unit }) => (
          <div key={key} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label} ({unit})
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={nutrients[key as keyof Nutrients] || ''}
              onChange={(e) => handleChange(key as keyof Nutrients, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`0.0`}
            />
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500">
        <p>* All values are per serving</p>
        <p>* Leave fields empty if nutritional information is not available</p>
      </div>
    </div>
  );
};

export default NutrientsForm; 