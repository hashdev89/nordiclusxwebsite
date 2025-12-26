import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function FilterSidebar({ onClose, isMobile }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 200]);

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
    'Cleansers',
    'Serums',
    'Moisturizers',
    'Sunscreen',
    'Toners',
    'Masks',
    'Eye Care',
    'Treatments'
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
        <h4 className="mb-4">Skin Concerns</h4>
        <div className="space-y-3">
          {skinConcerns.map((concern) => (
            <div key={concern} className="flex items-center space-x-2">
              <Checkbox id={concern} />
              <Label htmlFor={concern} className="text-sm cursor-pointer">
                {concern}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={200}
          step={5}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-8">
        <h4 className="mb-4">Brands</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox id={brand} />
              <Label htmlFor={brand} className="text-sm cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Product Type */}
      <div className="mb-8">
        <h4 className="mb-4">Product Type</h4>
        <div className="space-y-3">
          {productTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={type} />
              <Label htmlFor={type} className="text-sm cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  );
}
