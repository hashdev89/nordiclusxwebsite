import { useState, useEffect } from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export interface FilterState {
  priceRange: [number, number];
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSkinConcerns: string[];
}

interface FilterSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply?: () => void;
  onClear?: () => void;
  maxPrice?: number;
}

export function FilterSidebar({ 
  onClose, 
  isMobile, 
  filters, 
  onFiltersChange,
  onApply,
  onClear,
  maxPrice = 200
}: FilterSidebarProps) {
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);

  useEffect(() => {
    setLocalPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number]
    });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter(b => b !== brand)
      : [...filters.selectedBrands, brand];
    onFiltersChange({
      ...filters,
      selectedBrands: newBrands
    });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category];
    onFiltersChange({
      ...filters,
      selectedCategories: newCategories
    });
  };

  const handleSkinConcernToggle = (concern: string) => {
    const newConcerns = filters.selectedSkinConcerns.includes(concern)
      ? filters.selectedSkinConcerns.filter(c => c !== concern)
      : [...filters.selectedSkinConcerns, concern];
    onFiltersChange({
      ...filters,
      selectedSkinConcerns: newConcerns
    });
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {
      priceRange: [0, maxPrice],
      selectedBrands: [],
      selectedCategories: [],
      selectedSkinConcerns: []
    };
    onFiltersChange(clearedFilters);
    setLocalPriceRange([0, maxPrice]);
    if (onClear) onClear();
  };

  const skinConcerns = [
    'Acne & Blemishes',
    'Anti-Aging',
    'Dark Spots',
    'Dry Skin',
    'Oily Skin',
    'Sensitive Skin',
    'Uneven Texture',
    'Pores'
  ];

  const brands = [
    'The Ordinary',
    'CeraVe',
    'La Roche-Posay',
    'Neutrogena',
    'Cetaphil',
    'Paula\'s Choice',
    'First Aid Beauty',
    'Drunk Elephant'
  ];

  const productTypes = [
    'Cleanser',
    'Serum',
    'Moisturizer',
    'Sunscreen',
    'Toner',
    'Mask',
    'Eye Care',
    'Treatment'
  ];

  return (
    <div className={`bg-white ${isMobile ? 'h-full overflow-y-auto' : 'rounded-xl border border-border'} p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3>Filters</h3>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Skin Concerns */}
      <div className="mb-8">
        <h4 className="mb-4 font-semibold">Skin Concerns</h4>
        <div className="space-y-3">
          {skinConcerns.map((concern) => (
            <div key={concern} className="flex items-center space-x-2">
              <Checkbox 
                id={concern} 
                checked={filters.selectedSkinConcerns.includes(concern)}
                onCheckedChange={() => handleSkinConcernToggle(concern)}
              />
              <Label htmlFor={concern} className="text-sm cursor-pointer">
                {concern}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="mb-4 font-semibold">Price Range</h4>
        <Slider
          value={localPriceRange}
          onValueChange={handlePriceChange}
          max={maxPrice}
          step={5}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${localPriceRange[0]}</span>
          <span>${localPriceRange[1]}</span>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-8">
        <h4 className="mb-4 font-semibold">Brands</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox 
                id={brand} 
                checked={filters.selectedBrands.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
              />
              <Label htmlFor={brand} className="text-sm cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Product Type */}
      <div className="mb-8">
        <h4 className="mb-4 font-semibold">Product Type</h4>
        <div className="space-y-3">
          {productTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={type} 
                checked={filters.selectedCategories.includes(type)}
                onCheckedChange={() => handleCategoryToggle(type)}
              />
              <Label htmlFor={type} className="text-sm cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {onApply && (
          <Button 
            onClick={onApply}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Apply Filters
          </Button>
        )}
        <Button variant="outline" className="w-full" onClick={handleClear}>
          Clear All
        </Button>
      </div>
    </div>
  );
}
