import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import logoUrl from "@assets/2_1762970835071.png";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin } = useAuth();

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Produtos", href: "/products" },
    { name: "Sobre", href: "/about" },
    { name: "Contato", href: "/contact" },
  ];

  const adminNavigation = isAdmin
    ? [{ name: "Painel Admin", href: "/admin" }]
    : [];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 hover-elevate rounded-md px-2 py-1 transition-all cursor-pointer" data-testid="link-home">
              <img src={logoUrl} alt="Lara Moda" className="h-10 w-10" />
              <span className="font-heading text-xl font-semibold text-primary">
                Lara Moda
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <div
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover-elevate cursor-pointer ${
                    location === item.href
                      ? "text-primary"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                  data-testid={`link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </div>
              </Link>
            ))}
          </nav>

          {/* Right Side - Auth */}
          <div className="flex items-center space-x-4">
            {/* Customer Login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <div data-testid="link-profile">
                      <Link href="/profile">
                        <div className="flex items-center w-full cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Meu Perfil
                        </div>
                      </Link>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <div data-testid="link-orders">
                      <Link href="/orders">
                        <div className="flex items-center w-full cursor-pointer">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Meus Pedidos
                        </div>
                      </Link>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a
                      href="/api/logout"
                      className="flex items-center w-full text-destructive"
                      data-testid="link-logout"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden md:flex"
                data-testid="button-login"
              >
                <a href="/api/login">
                  <User className="mr-2 h-4 w-4" />
                  Entrar
                </a>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  data-testid="button-menu-toggle"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <div
                        className={`px-4 py-2 text-base font-medium rounded-md transition-colors hover-elevate cursor-pointer ${
                          location === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-accent"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`link-mobile-${item.name.toLowerCase()}`}
                      >
                        {item.name}
                      </div>
                    </Link>
                  ))}

                  {/* Admin Link in Mobile Menu */}
                  {adminNavigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <div
                        className="px-4 py-2 text-base font-medium rounded-md bg-primary/10 text-primary hover-elevate cursor-pointer"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="link-mobile-admin"
                      >
                        {item.name}
                      </div>
                    </Link>
                  ))}

                  {/* Mobile Auth */}
                  {!isAuthenticated && (
                    <Button asChild variant="default" className="mt-4" data-testid="button-mobile-login">
                      <a href="/api/login">
                        <User className="mr-2 h-4 w-4" />
                        Entrar
                      </a>
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
