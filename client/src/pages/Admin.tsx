import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Eye,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, Order } from "@shared/schema";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Preço deve ser maior que zero"),
  category: z.string().min(1, "Categoria é obrigatória"),
  colors: z.array(z.string()).min(1, "Pelo menos uma cor deve ser selecionada"),
  sizes: z.array(z.string()).min(1, "Pelo menos um tamanho deve ser selecionado"),
  stock: z.number().min(0, "Estoque não pode ser negativo"),
  isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  // Queries
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAdmin,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAdmin,
  });

  // Mutation for create product with FormData
  const createProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao criar produto");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setProductModalOpen(false);
      resetForm();
      toast({ title: "Produto criado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar produto",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductFormData> }) => {
      return await apiRequest("PATCH", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setProductModalOpen(false);
      setEditingProduct(null);
      resetForm();
      toast({ title: "Produto atualizado com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar produto",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produto removido com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao remover produto",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Status do pedido atualizado!" });
    },
  });

  // Form
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      colors: [],
      sizes: [],
      stock: 0,
      isActive: true,
    },
  });

  // Cleanup image URLs
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviewUrls]);

  // Auth Protection
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      });
    }
  }, [isAdmin, authLoading, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Você precisa ter permissões de administrador para acessar esta página.
            </p>
            <Button asChild className="mt-4">
              <a href="/">Voltar para Início</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(price));
  };

  const getOrderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "default" as const },
      confirmed: { label: "Confirmado", variant: "secondary" as const },
      shipped: { label: "Enviado", variant: "outline" as const },
      delivered: { label: "Entregue", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      price: "",
      category: "",
      colors: [],
      sizes: [],
      stock: 0,
      isActive: true,
    });
    setImagePreviewUrls([]);
    setImageFiles([]);
    setColorInput("");
    setSizeInput("");
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setImagePreviewUrls(product.images || []);
      setImageFiles([]);
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        colors: product.colors || [],
        sizes: product.sizes || [],
        stock: product.stock,
        isActive: product.isActive,
      });
    } else {
      setEditingProduct(null);
      resetForm();
    }
    setProductModalOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));

    setImageFiles(prevFiles => [...prevFiles, ...newFiles]);
    setImagePreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
  };

  const removeImage = (indexToRemove: number) => {
    const urlToRemove = imagePreviewUrls[indexToRemove];

    if (urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
      const blobUrls = imagePreviewUrls.filter(url => url.startsWith('blob:'));
      const fileIndex = blobUrls.indexOf(urlToRemove);
      if (fileIndex !== -1) {
        setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== fileIndex));
      }
    }
    setImagePreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== indexToRemove));
  };

  const addColor = () => {
    if (colorInput.trim()) {
      const currentColors = form.getValues("colors");
      if (!currentColors.includes(colorInput.trim())) {
        form.setValue("colors", [...currentColors, colorInput.trim()]);
      }
      setColorInput("");
    }
  };

  const removeColor = (color: string) => {
    const currentColors = form.getValues("colors");
    form.setValue("colors", currentColors.filter(c => c !== color));
  };

  const addSize = () => {
    if (sizeInput.trim()) {
      const currentSizes = form.getValues("sizes");
      if (!currentSizes.includes(sizeInput.trim())) {
        form.setValue("sizes", [...currentSizes, sizeInput.trim()]);
      }
      setSizeInput("");
    }
  };

  const removeSize = (size: string) => {
    const currentSizes = form.getValues("sizes");
    form.setValue("sizes", currentSizes.filter(s => s !== size));
  };

  const handleSubmitProduct = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      if (imageFiles.length === 0) {
        toast({
          title: "Erro",
          description: "Por favor, adicione pelo menos uma imagem.",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('category', data.category);
      formData.append('stock', data.stock.toString());
      formData.append('isActive', data.isActive.toString());

      data.colors.forEach(color => formData.append('colors', color));
      data.sizes.forEach(size => formData.append('sizes', size));

      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      createProductMutation.mutate(formData);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const totalRevenue = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, order) => sum + parseFloat(order.total), 0);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary">Painel Administrativo</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie produtos, pedidos e visualize estatísticas
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Logado como: <span className="font-medium">{user.firstName || user.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Produtos</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                  <p className="text-xs text-muted-foreground">{activeProducts} ativos</p>
                </div>
                <Package className="h-8 w-8 text-primary/70" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Pedidos</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                  <p className="text-xs text-muted-foreground">{pendingOrders} pendentes</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-primary/70" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold">{formatPrice(totalRevenue.toString())}</p>
                  <p className="text-xs text-muted-foreground">Vendas confirmadas</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary/70" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Produtos Ativos</p>
                  <p className="text-2xl font-bold">{activeProducts}</p>
                  <p className="text-xs text-muted-foreground">
                    {((activeProducts / totalProducts) * 100 || 0).toFixed(1)}% do total
                  </p>
                </div>
                <Eye className="h-8 w-8 text-primary/70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products" data-testid="tab-products">Produtos</TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">Pedidos</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Gerenciar Produtos</h2>
                <p className="text-muted-foreground text-sm">
                  Adicione, edite ou remova produtos da sua loja
                </p>
              </div>
              <Button onClick={() => openProductModal()} data-testid="button-add-product">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsLoading ? (
                [...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-3"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-muted rounded w-20"></div>
                        <div className="h-8 w-8 bg-muted rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                products.map((product) => (
                  <Card key={product.id} className="group hover-elevate transition-all" data-testid={`card-admin-product-${product.id}`}>
                    <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                      <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-card/90 capitalize">
                          {product.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          <Badge
                            variant={product.stock > 5 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                          >
                            {product.stock} un.
                          </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {(product.colors || []).length} cores • {(product.sizes || []).length} tamanhos
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openProductModal(product)}
                            className="flex-1"
                            data-testid={`button-edit-${product.id}`}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="shrink-0"
                            data-testid={`button-delete-${product.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-semibold">Gerenciar Pedidos</h2>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersLoading ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><div className="h-4 bg-muted rounded w-20 animate-pulse"></div></TableCell>
                          <TableCell><div className="h-4 bg-muted rounded w-24 animate-pulse"></div></TableCell>
                          <TableCell><div className="h-4 bg-muted rounded w-16 animate-pulse"></div></TableCell>
                          <TableCell><div className="h-4 bg-muted rounded w-16 animate-pulse"></div></TableCell>
                          <TableCell><div className="h-4 bg-muted rounded w-12 animate-pulse"></div></TableCell>
                          <TableCell><div className="h-6 bg-muted rounded-full w-20 animate-pulse"></div></TableCell>
                          <TableCell><div className="h-8 bg-muted rounded w-24 animate-pulse"></div></TableCell>
                        </TableRow>
                      ))
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-muted-foreground">
                            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Nenhum pedido encontrado</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                          <TableCell>
                            <div className="font-medium">#{order.id.slice(0, 8)}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{order.customerInfo.name}</div>
                            <div className="text-sm text-muted-foreground">{order.customerInfo.email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(order.createdAt!).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(order.createdAt!).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatPrice(order.total)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {order.paymentMethod}
                          </TableCell>
                          <TableCell>
                            {getOrderStatusBadge(order.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Select
                              value={order.status}
                              onValueChange={(status) =>
                                updateOrderStatusMutation.mutate({ id: order.id, status })
                              }
                            >
                              <SelectTrigger className="w-[140px]" data-testid={`select-status-${order.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="confirmed">Confirmado</SelectItem>
                                <SelectItem value="shipped">Enviado</SelectItem>
                                <SelectItem value="delivered">Entregue</SelectItem>
                                <SelectItem value="cancelled">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Modal */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleSubmitProduct)} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Ex: Camiseta Básica"
                data-testid="input-product-name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Descreva o produto..."
                rows={4}
                data-testid="textarea-description"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  {...form.register("price")}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  data-testid="input-price"
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) => form.setValue("category", value)}
                >
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="conjuntos">Conjuntos</SelectItem>
                    <SelectItem value="acessorios">Acessórios</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Colors */}
            <div>
              <Label>Cores Disponíveis *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Ex: Vermelho, #FF0000"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addColor();
                    }
                  }}
                  data-testid="input-color"
                />
                <Button type="button" onClick={addColor} data-testid="button-add-color">
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch("colors").map((color) => (
                  <Badge key={color} variant="secondary" className="gap-1">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {form.formState.errors.colors && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.colors.message}</p>
              )}
            </div>

            {/* Sizes */}
            <div>
              <Label>Tamanhos Disponíveis *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="Ex: P, M, G, GG"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSize();
                    }
                  }}
                  data-testid="input-size"
                />
                <Button type="button" onClick={addSize} data-testid="button-add-size">
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch("sizes").map((size) => (
                  <Badge key={size} variant="secondary" className="gap-1">
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {form.formState.errors.sizes && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.sizes.message}</p>
              )}
            </div>

            {/* Stock & Active */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Estoque *</Label>
                <Input
                  id="stock"
                  {...form.register("stock", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  data-testid="input-stock"
                />
                {form.formState.errors.stock && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.stock.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-7">
                <Switch
                  checked={form.watch("isActive")}
                  onCheckedChange={(checked) => form.setValue("isActive", checked)}
                  data-testid="switch-active"
                />
                <Label>Produto Ativo</Label>
              </div>
            </div>

            {/* Images */}
            {!editingProduct && (
              <div>
                <Label>Imagens do Produto *</Label>
                <div className="mt-2">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover-elevate transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Clique para selecionar</span> ou arraste imagens
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 5MB)</p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      data-testid="input-images"
                    />
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover-elevate"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setProductModalOpen(false)}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                data-testid="button-submit-product"
              >
                {createProductMutation.isPending || updateProductMutation.isPending
                  ? "Salvando..."
                  : editingProduct
                  ? "Atualizar"
                  : "Criar Produto"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto será permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct} data-testid="button-confirm-delete">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
