import React from 'react';

interface Nutrients {
  calories?: number | string;
  protein?: number | string;
  carbohydrates?: number | string;
  fat?: number | string;
  saturatedFat?: number | string;
  fiber?: number | string;
  sugar?: number | string;
  sodium?: number | string;
  vitaminC?: number | string;
  vitaminA?: number | string;
  calcium?: number | string;
  iron?: number | string;
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
    // Allow both text and numbers
    // If empty, set to undefined
    // If it's a valid number, try to parse it (but keep as string if user wants text)
    // Otherwise, keep as string
    const processedValue = value === '' ? undefined : value;
    onChange({
      ...nutrients,
      [field]: processedValue
    });
  };

  const nutrientFields = [
    { key: 'calories', label: 'Calories', unit: 'kcal', category: 'Energy' },
    { key: 'protein', label: 'Protein', unit: 'g', category: 'Macronutrients' },
    { key: 'carbohydrates', label: 'Carbohydrates', unit: 'g', category: 'Macronutrients' },
    { key: 'fat', label: 'Fat', unit: 'g', category: 'Macronutrients' },
    { key: 'saturatedFat', label: 'Saturated Fat (of which Saturates)', unit: 'g', category: 'Macronutrients' },
    { key: 'fiber', label: 'Fiber', unit: 'g', category: 'Macronutrients' },
    { key: 'sugar', label: 'Sugar (of which Sugars)', unit: 'g', category: 'Macronutrients' },
    { key: 'sodium', label: 'Sodium', unit: 'mg', category: 'Minerals' },
    { key: 'vitaminC', label: 'Vitamin C', unit: 'mg', category: 'Vitamins' },
    { key: 'vitaminA', label: 'Vitamin A', unit: 'IU', category: 'Vitamins' },
    { key: 'calcium', label: 'Calcium', unit: 'mg', category: 'Minerals' },
    { key: 'iron', label: 'Iron', unit: 'mg', category: 'Minerals' }
  ];

  // Group nutrients by category
  const groupedNutrients = nutrientFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof nutrientFields>);

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nutritional Information</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter nutritional values per serving. All fields are optional.
        </p>
      </div>

      {Object.entries(groupedNutrients).map(([category, fields]) => (
        <div key={category} className="space-y-4">
          <h4 className="text-md font-medium text-gray-800 border-b border-gray-200 pb-2">
            {category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map(({ key, label, unit }) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {label} ({unit})
                </label>
                <input
                  type="text"
                  value={nutrients[key as keyof Nutrients] || ''}
                  onChange={(e) => handleChange(key as keyof Nutrients, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter value or text"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">💡 Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• All values are per serving</li>
            <li>• Leave fields empty if nutritional information is not available</li>
            <li>• You can enter numeric values (e.g., 2.5g) or text descriptions</li>
            <li>• Vitamin A is measured in International Units (IU)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NutrientsForm; 