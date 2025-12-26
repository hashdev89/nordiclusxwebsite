interface SkinConcernCardProps {
  title: string;
  description: string;
  icon: string;
  productCount: number;
}

export function SkinConcernCard({ title, description, icon, productCount }: SkinConcernCardProps) {
  return (
    <div className="group cursor-pointer bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-500">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h3 className="mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
            <span>{productCount} Products</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
