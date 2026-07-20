import React from 'react';
import { CATEGORIES, LUXURY_BRANDS, SIZES, COLORS } from '../data/products';
import { FilterState } from '../types';
import { SlidersHorizontal, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface FiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalProductsCount: number;
  filteredCount: number;
}

export default function Filters({
  filters,
  setFilters,
  totalProductsCount,
  filteredCount
}: FiltersProps) {
  const { t, lang } = useI18n();
  const [isOpen, setIsOpen] = React.useState(true);

  const handleGenderChange = (gender: 'all' | 'men' | 'women') => {
    setFilters((prev) => ({
      ...prev,
      gender
    }));
  };

  const handleAvailabilityChange = (availability: 'all' | 'in-stock') => {
    setFilters((prev) => ({
      ...prev,
      availability
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? 'All Collections' : category
    }));
  };

  const handleBrandChange = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brand: prev.brand === brand ? '' : brand
    }));
  };

  const handleSizeChange = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      size: prev.size === size ? '' : size
    }));
  };

  const handleColorChange = (colorName: string) => {
    setFilters((prev) => ({
      ...prev,
      color: prev.color === colorName ? '' : colorName
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], value]
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: e.target.value as any
    }));
  };

  const handleReset = () => {
    setFilters({
      brand: '',
      category: 'All Collections',
      size: '',
      color: '',
      priceRange: [0, 50000],
      searchQuery: '',
      sortBy: 'featured',
      gender: 'all',
      availability: 'all'
    });
  };

  const hasActiveFilters =
    filters.brand !== '' ||
    filters.category !== 'All Collections' ||
    filters.size !== '' ||
    filters.color !== '' ||
    filters.priceRange[1] < 50000 ||
    filters.searchQuery !== '' ||
    (filters.gender && filters.gender !== 'all') ||
    (filters.availability && filters.availability !== 'all');

  return (
    <div className="bg-white border-y border-neutral-100 py-6" id="catalog-filters">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filter Toggle and Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-none cursor-pointer"
              id="filter-toggle-button"
            >
              <SlidersHorizontal size={14} />
              <span>{isOpen ? t('Hide Filters') : t('Show Filters')}</span>
            </button>
            <span className="text-xs text-neutral-500 font-medium tracking-wider">
              {t("Showing")} {filteredCount} {t("of")} {totalProductsCount} {t("sneakers")}
            </span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black uppercase tracking-wider font-semibold transition-colors"
                id="reset-filters-btn"
              >
                <RotateCcw size={12} />
                <span>{t("Reset")}</span>
              </button>
            )}

            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="sort-select" className="text-xs text-neutral-400 uppercase tracking-wider font-medium hidden sm:inline">
                {t("Sort By:")}
              </label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="bg-neutral-50 border border-neutral-200 focus:border-black text-xs uppercase tracking-widest font-semibold py-2 pl-3 pr-8 rounded-none outline-none cursor-pointer appearance-none text-black"
                >
                  <option value="featured">{t("Featured")}</option>
                  <option value="newest">{t("Newest")}</option>
                  <option value="low-high">{t("Price Low to High")}</option>
                  <option value="high-low">{t("Price High to Low")}</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Filters Board */}
        {isOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-6 border-t border-neutral-100">
            
            {/* 1. Gender Filter */}
            <div className="space-y-3" id="filter-gender-section">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black pb-1 border-b border-neutral-100">
                {t("Gender")}
              </h4>
              <div className="flex flex-col gap-2">
                {[
                  { value: 'all', label: 'All Genders' },
                  { value: 'men', label: 'Men' },
                  { value: 'women', label: 'Women' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleGenderChange(item.value as any)}
                    className={`text-left text-xs tracking-wider transition-all py-0.5 flex items-center gap-2 ${
                      (filters.gender || 'all') === item.value
                        ? 'text-black font-semibold'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 border rounded-full flex items-center justify-center ${
                      (filters.gender || 'all') === item.value ? 'border-black' : 'border-neutral-300'
                    }`}>
                      {(filters.gender || 'all') === item.value && (
                        <span className="w-1.5 h-1.5 bg-black rounded-full" />
                      )}
                    </span>
                    <span>{t(item.label)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Brand Filter */}
            <div className="space-y-3" id="filter-brand-section">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black pb-1 border-b border-neutral-100">
                {t("Brand")}
              </h4>
              <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-2">
                {LUXURY_BRANDS.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandChange(brand)}
                    className={`text-left text-xs tracking-wider transition-colors py-0.5 flex items-center justify-between ${
                      filters.brand === brand
                        ? 'text-black font-semibold'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    <span>{t(brand)}</span>
                    {filters.brand === brand && <Check size={11} className="text-black" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Price Filter */}
            <div className="space-y-3" id="filter-price-section">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black pb-1 border-b border-neutral-100">
                {t("Price")}
              </h4>
              <div className="space-y-3 pt-1">
                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="500"
                  value={filters.priceRange[1]}
                  onChange={handlePriceChange}
                  aria-label="Maximum price filter"
                  className="w-full h-1 bg-neutral-200 appearance-none cursor-pointer accent-black"
                />
                <div className="flex flex-col gap-1 text-[11px] tracking-wider">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">{t("Min: 2,000 EGP")}</span>
                    <span className="text-neutral-400">{t("Max: 50K EGP")}</span>
                  </div>
                  <span className="text-black font-bold font-serif text-xs mt-1">
                    {t("Up to:")} {filters.priceRange[1].toLocaleString()} {t("EGP")}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Color Filter */}
            <div className="space-y-3" id="filter-colors-section">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black pb-1 border-b border-neutral-100">
                {t("Color")}
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {COLORS.map((color) => {
                  const isSelected = filters.color === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => handleColorChange(color.name)}
                      className="group flex items-center justify-center relative cursor-pointer"
                      title={color.name}
                    >
                      <span
                        className="w-6.5 h-6.5 rounded-full border border-neutral-300 block transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: color.hex,
                          boxShadow: color.hex === '#FFFFFF' ? 'inset 0 0 4px rgba(0,0,0,0.1)' : 'none'
                        }}
                      />
                      {isSelected && (
                        <span className="absolute inset-0 border-2 border-black rounded-full scale-110" />
                      )}
                    </button>
                  );
                })}
              </div>
              {filters.color && (
                <div className="text-[9.5px] text-neutral-400 tracking-wider">
                  {t("Selected:")} <span className="text-black font-semibold">{t(filters.color)}</span>
                </div>
              )}
            </div>

            {/* 5. Size Filter */}
            <div className="space-y-3" id="filter-sizes-section">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black pb-1 border-b border-neutral-100">
                {t("Size")}
              </h4>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`py-1.5 text-[10px] uppercase font-semibold text-center border transition-all ${
                      filters.size === size
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black hover:text-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Availability Filter */}
            <div className="space-y-3" id="filter-availability-section">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black pb-1 border-b border-neutral-100">
                {t("Availability")}
              </h4>
              <div className="flex flex-col gap-2">
                {[
                  { value: 'all', label: 'All Sneakers' },
                  { value: 'in-stock', label: 'In Stock Only' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleAvailabilityChange(item.value as any)}
                    className={`text-left text-xs tracking-wider transition-all py-0.5 flex items-center gap-2 ${
                      (filters.availability || 'all') === item.value
                        ? 'text-black font-semibold'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 border flex items-center justify-center ${
                      (filters.availability || 'all') === item.value ? 'border-black bg-black text-white' : 'border-neutral-300'
                    }`}>
                      {(filters.availability || 'all') === item.value && (
                        <Check size={10} strokeWidth={3} />
                      )}
                    </span>
                    <span>{t(item.label)}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
