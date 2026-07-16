import React from 'react';
import { CATEGORIES, LUXURY_BRANDS, SIZES, COLORS } from '../data/products';
import { FilterState } from '../types';
import { SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';

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
  const [isOpen, setIsOpen] = React.useState(true);

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
      sortBy: 'featured'
    });
  };

  const hasActiveFilters =
    filters.brand !== '' ||
    filters.category !== 'All Collections' ||
    filters.size !== '' ||
    filters.color !== '' ||
    filters.priceRange[1] < 50000 ||
    filters.searchQuery !== '';

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
              <span>{isOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            <span className="text-xs text-neutral-500 font-medium tracking-wider">
              Showing {filteredCount} of {totalProductsCount} sneakers
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
                <span>Reset</span>
              </button>
            )}

            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="sort-select" className="text-xs text-neutral-400 uppercase tracking-wider font-medium hidden sm:inline">
                Sort By:
              </label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="bg-neutral-50 border border-neutral-200 focus:border-black text-xs uppercase tracking-widest font-semibold py-2 pl-3 pr-8 rounded-none outline-none cursor-pointer appearance-none text-black"
                >
                  <option value="featured">Featured</option>
                  <option value="bestselling">Best Selling</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Filters Board */}
        {isOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pt-6 border-t border-neutral-100">
            {/* 1. Category */}
            <div className="space-y-3" id="filter-category-section">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black pb-1 border-b border-neutral-100">
                Collections
              </h4>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`text-left text-xs tracking-wider transition-colors py-0.5 ${
                      filters.category === category || (category === 'All Collections' && filters.category === 'All Collections')
                        ? 'text-black font-semibold pl-2 border-l-2 border-black'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Brand */}
            <div className="space-y-3" id="filter-brand-section">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black pb-1 border-b border-neutral-100">
                Sneaker Brands
              </h4>
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-2">
                {LUXURY_BRANDS.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandChange(brand)}
                    className={`text-left text-xs tracking-wider transition-colors py-0.5 ${
                      filters.brand === brand
                        ? 'text-black font-semibold pl-2 border-l-2 border-black'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Sizes */}
            <div className="space-y-3" id="filter-sizes-section">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black pb-1 border-b border-neutral-100">
                Sizing Grid
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`py-2 text-[10px] uppercase font-semibold text-center border transition-all ${
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

            {/* 4. Colors */}
            <div className="space-y-3" id="filter-colors-section">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black pb-1 border-b border-neutral-100">
                Aesthetic Color
              </h4>
              <div className="flex flex-wrap gap-2.5">
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
                        className="w-7 h-7 rounded-full border border-neutral-300 block transition-transform group-hover:scale-105"
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
                <div className="text-[10px] text-neutral-400 tracking-wider">
                  Selected: <span className="text-black font-semibold">{filters.color}</span>
                </div>
              )}
            </div>

            {/* 5. Price Slider */}
            <div className="space-y-3" id="filter-price-section">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black pb-1 border-b border-neutral-100">
                Price Ceiling
              </h4>
              <div className="space-y-4 pt-1">
                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="500"
                  value={filters.priceRange[1]}
                  onChange={handlePriceChange}
                  className="w-full h-1 bg-neutral-200 appearance-none cursor-pointer accent-black"
                />
                <div className="flex items-center justify-between text-xs tracking-wider">
                  <span className="text-neutral-400">Min: 2,000 EGP</span>
                  <span className="text-black font-bold font-serif">Max: {filters.priceRange[1].toLocaleString()} EGP</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
