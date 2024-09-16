import React from 'react';

interface Props {
  onSelect: (type: string) => void;
}

const PropertyTypeSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center mb-6 w-full max-w-4xl mx-auto">
      <label className="block text-lg font-semibold mb-2 text-gold text-center">
        בחר סוג נכס:
      </label>
      <div className="flex flex-wrap gap-4 justify-center w-full">
        {['דירות', 'בתי עסק', 'קרקעות', 'פרויקט קבלן'].map((type) => (
          <button
            key={type}
            onClick={() => {
              onSelect(type);
            }}
            className="flex-1 min-w-[120px] py-2 px-4 text-center rounded-lg border border-gold bg-black text-gold shadow-lg hover:bg-gray-800 transition-colors duration-300"
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertyTypeSelector;
