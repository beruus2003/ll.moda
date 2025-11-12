import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Heart,
  Share2,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const relatedProducts = product
    ? allProducts.filter(
        (p) =>
          p.id !== product.id &&
          p.category === product.category &&
          p.isActive
      ).slice(0, 4)
    : [];

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(price));
  };

  const handleWhatsAppClick = () => {
    if (!product) return;

    const whatsappNumber = "5500000000000"; // Replace with actual number
    const message = `Olá! Tenho interesse no produto:

*${product.name}*
Preço: ${formatPrice(product.price)}
${selectedColor ? `Cor: ${selectedColor}` : ""}
${selectedSize ? `Tamanho: ${selectedSize}` : ""}
Quantidade: ${quantity}

Gostaria de mais informações.`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">Produto não encontrado</h2>
            <p className="text-muted-foreground mb-6">
              O produto que você procura não existe ou foi removido.
            </p>
            <Button asChild>
              <Link href="/products">
                <a>Ver Todos os Produtos</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=800&fit=crop"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/products">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar aos Produtos
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="img-product-main"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-md hover-elevate transition-all ${
                      selectedImageIndex === index ? "ring-2 ring-primary" : ""
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2 capitalize">
                    {product.category}
                  </Badge>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2" data-testid="text-product-name">
                    {product.name}
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" data-testid="button-wishlist">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" data-testid="button-share">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-bold text-primary" data-testid="text-product-price">
                  {formatPrice(product.price)}
                </p>
                {product.stock === 0 && (
                  <Badge variant="destructive">Esgotado</Badge>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <Badge variant="secondary">Últimas {product.stock} unidades</Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">
                  Cor{selectedColor && `: ${selectedColor}`}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`group relative w-10 h-10 rounded-full border-2 transition-all hover-elevate ${
                        selectedColor === color
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                      data-testid={`button-color-${color}`}
                    >
                      <span className="sr-only">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Tamanho</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="min-w-[3rem]"
                      data-testid={`button-size-${size}`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantidade</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="button-quantity-decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 font-medium" data-testid="text-quantity">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    data-testid="button-quantity-increase"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock} disponíveis
                </span>
              </div>
            </div>

            <Separator />

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full text-lg"
                onClick={handleWhatsAppClick}
                disabled={product.stock === 0 || !selectedColor || !selectedSize}
                data-testid="button-whatsapp-buy"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Comprar via WhatsApp
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {!selectedColor || !selectedSize
                  ? "Selecione cor e tamanho para continuar"
                  : "Finalize sua compra pelo WhatsApp"}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
