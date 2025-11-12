import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Filter, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Read category from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  const categories = [
    { id: "all", name: "Todos os Produtos" },
    { id: "feminino", name: "Feminino" },
    { id: "masculino", name: "Masculino" },
    { id: "conjuntos", name: "Conjuntos" },
    { id: "acessorios", name: "Acessórios" },
  ];

  const sortOptions = [
    { value: "name", label: "Nome A-Z" },
    { value: "price-asc", label: "Menor Preço" },
    { value: "price-desc", label: "Maior Preço" },
    { value: "newest", label: "Mais Novos" },
  ];

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      if (!product) return false;

      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory && product.isActive;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-asc":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-desc":
          return parseFloat(b.price) - parseFloat(a.price);
        case "newest":
          return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
        default:
          return 0;
      }
    });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Erro ao carregar produtos</h2>
            <p className="text-muted-foreground">
              Não foi possível carregar os produtos. Tente novamente mais tarde.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2" data-testid="text-page-title">
                Nossos Produtos
              </h1>
              <p className="text-muted-foreground">
                Descubra nossa coleção completa de moda feminina e masculina
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:w-1/4">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Categorias
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setSelectedCategory(category.id)}
                          data-testid={`button-category-${category.id}`}
                        >
                          {category.name}
                          <Badge
                            variant="secondary"
                            className="ml-auto"
                          >
                            {category.id === "all"
                              ? products.filter(p => p.isActive).length
                              : products.filter(p => p.category === category.id && p.isActive).length
                            }
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h3 className="font-semibold mb-3">Ordenar por</h3>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger data-testid="select-sort">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main - Products Grid */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground" data-testid="text-results-count">
                {isLoading ? (
                  "Carregando produtos..."
                ) : (
                  `${filteredAndSortedProducts.length} produto${filteredAndSortedProducts.length !== 1 ? 's' : ''} encontrado${filteredAndSortedProducts.length !== 1 ? 's' : ''}`
                )}
                {searchTerm && ` para "${searchTerm}"`}
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Grid className="h-3 w-3" />
                  Grade 4x4
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-muted rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-3"></div>
                      <div className="flex space-x-2 mb-3">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="w-6 h-6 bg-muted rounded-full"></div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-muted rounded w-20"></div>
                        <div className="h-8 w-8 bg-muted rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="text-muted-foreground/50 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm
                    ? `Não encontramos produtos para "${searchTerm}"`
                    : "Não há produtos disponíveis nesta categoria"
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm("")}
                      data-testid="button-clear-search"
                    >
                      Limpar busca
                    </Button>
                  )}
                  <Button onClick={() => setSelectedCategory("all")} data-testid="button-view-all">
                    Ver todos os produtos
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
