import { Link } from "wouter";
import { ShoppingBag, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(price));
  };

  const primaryImage = product.images?.[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop";
  const secondaryImage = product.images?.[1] || primaryImage;

  return (
    <Card className="group overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-product-${product.id}`}>
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted cursor-pointer">
            {/* Primary Image */}
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              loading="lazy"
            />
            {/* Secondary Image (on hover) */}
            <img
              src={secondaryImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              loading="lazy"
            />

            {/* Stock Badge */}
            {product.stock === 0 && (
              <div className="absolute top-2 left-2">
                <Badge variant="destructive">Esgotado</Badge>
              </div>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary">Últimas unidades</Badge>
              </div>
            )}

            {/* Quick View Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
              <Button variant="secondary" size="sm" className="gap-2" data-testid={`button-view-${product.id}`}>
                <Eye className="h-4 w-4" />
                Ver Detalhes
              </Button>
            </div>
          </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-base truncate hover:text-primary transition-colors cursor-pointer" data-testid={`text-name-${product.id}`}>
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground capitalize">
            {product.category}
          </p>
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center space-x-1">
            {product.colors.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full border-2 border-border"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <p className="text-xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-muted-foreground">
              {product.sizes && product.sizes.length > 0
                ? `${product.sizes.length} tamanhos`
                : "Tamanho único"}
            </p>
          </div>

          <Link href={`/product/${product.id}`}>
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0 cursor-pointer"
              disabled={product.stock === 0}
              data-testid={`button-shop-${product.id}`}
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
