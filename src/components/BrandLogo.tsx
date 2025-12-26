interface BrandLogoProps {
  name: string;
}

export function BrandLogo({ name }: BrandLogoProps) {
  return (
    <div className="bg-white rounded-xl p-8 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer group flex items-center justify-center min-h-[140px]">
      <div className="text-center">
        <div className="text-lg text-foreground group-hover:text-primary transition-colors">
          {name}
        </div>
      </div>
    </div>
  );
}
