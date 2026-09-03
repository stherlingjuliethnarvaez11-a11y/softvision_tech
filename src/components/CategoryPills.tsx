/**
 * SOFTVISION TECH — Selector de Categorías (Presentacional)
 */

import React from 'react';
import { Category } from '../models/types';
import { 
  UtensilsCrossed, 
  HeartPulse, 
  Wrench, 
  Sparkles, 
  Home, 
  Smartphone, 
  GraduationCap, 
  Store 
} from 'lucide-react';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'HeartPulse':
        return <HeartPulse className="w-4 h-4" />;
      case 'Wrench':
        return <Wrench className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Home':
        return <Home className="w-4 h-4" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Store className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none" id="categories-pills-scroll">
      <div className="flex items-center gap-2 min-w-max">
        <button
          type="button"
          id="cat-pill-all"
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-[#475569] hover:bg-[#F1F5F9] hover:text-blue-600 border border-[#E2E8F0]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Todas las categorías</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              id={`cat-pill-${cat.slug}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-[#475569] hover:bg-[#F1F5F9] hover:text-blue-600 border border-[#E2E8F0]'
              }`}
            >
              {getIcon(cat.iconName)}
              <span>{cat.name}</span>
              {cat.businessCount !== undefined && cat.businessCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {cat.businessCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
