import { ShoppingCart, Heart, Eye, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating?: number;
  brand?: string;
  country?: string;
  reviews?: number;
  onWhatsAppClick?: (product: { name: string; brand?: string; price: number }) => void;
}

export function ProductCard({
  name,
  category,
  price,
  originalPrice,
  image,
  badge,
  rating = 5,
  brand,
  country,
  reviews = 0,
  onWhatsAppClick
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div 
      className="group relative bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Overlay Actions */}
        <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-4 left-0 right-0 px-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Button className="w-full bg-white hover:bg-primary text-foreground hover:text-white border-0 shadow-lg h-11">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        {/* Badge */}
        {badge && (
          <Badge className="absolute top-3 left-3 bg-primary text-white border-0 shadow-md">
            {badge}
          </Badge>
        )}
        
        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 shadow-md">
            -{discount}%
          </Badge>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-md hover:scale-110"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </button>
          {onWhatsAppClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWhatsAppClick({ name, brand, price });
              }}
              className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all shadow-md hover:scale-110 opacity-0 group-hover:opacity-100"
              title="Chat about this product"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          )}
          <button
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-md hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        {brand && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-primary">
              {brand}
            </span>
            {country && (
              <span className="text-xs text-muted-foreground">{country}</span>
            )}
          </div>
        )}

        {/* Product Name */}
        <h3 className="text-sm text-foreground line-clamp-2 mb-1 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Category */}
        <p className="text-xs text-muted-foreground mb-3">{category}</p>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {reviews > 0 && (
            <span className="text-xs text-muted-foreground">({reviews})</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-foreground">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
