import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ShoppingBag, TrendingUp, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@shared/schema";
import logoUrl from "@assets/2_1762970835071.png";

export default function Home() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products.filter(p => p.isActive).slice(0, 8);

  const categories = [
    { id: "feminino", name: "Feminino", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop" },
    { id: "masculino", name: "Masculino", image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=500&fit=crop" },
    { id: "conjuntos", name: "Conjuntos", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop" },
  ];

  const whatsappNumber = "5500000000000"; // Replace with actual number
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de saber mais sobre os produtos da Lara Moda.");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Wash */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="flex justify-center mb-6">
            <img
              src={logoUrl}
              alt="Lara Moda"
              className="h-24 w-24 drop-shadow-2xl"
            />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg" data-testid="text-hero-title">
            Bem-vindo à Lara Moda
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Descubra nossa coleção de moda feminina e masculina com estilo e qualidade
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-primary/90 backdrop-blur-sm hover:bg-primary text-lg px-8"
                data-testid="button-hero-products"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ver Produtos
              </Button>
            </Link>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-8"
              data-testid="button-hero-whatsapp"
            >
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Fale Conosco
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Moda Atual</h3>
                <p className="text-sm text-muted-foreground">
                  Produtos sempre atualizados com as últimas tendências
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Qualidade Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Peças selecionadas com cuidado e atenção aos detalhes
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Atendimento Personalizado</h3>
                <p className="text-sm text-muted-foreground">
                  Tire suas dúvidas diretamente pelo WhatsApp
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Compre por Categoria
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore nossa coleção completa de moda feminina e masculina
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="overflow-hidden group hover-elevate transition-all duration-300 cursor-pointer" data-testid={`card-category-${category.id}`}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-heading text-2xl font-semibold text-white mb-2">
                        {category.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="group-hover:bg-white group-hover:text-primary"
                      >
                        Explorar
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                Produtos em Destaque
              </h2>
              <p className="text-lg text-muted-foreground">
                Nossas peças mais populares
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" data-testid="button-view-all">
                Ver Todos
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-muted rounded w-20"></div>
                      <div className="h-8 w-8 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-medium text-muted-foreground mb-2">
                Nenhum produto disponível
              </h3>
              <p className="text-muted-foreground">
                Em breve teremos novidades para você!
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Dúvidas? Fale Conosco!
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a encontrar a peça perfeita.
            Entre em contato pelo WhatsApp e respondemos em minutos.
          </p>
          <Button
            asChild
            size="lg"
            className="text-lg px-8"
            data-testid="button-whatsapp-cta"
          >
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Abrir WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
