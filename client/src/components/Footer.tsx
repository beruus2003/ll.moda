import { Mail, Phone, Instagram, MapPin } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-primary">
              Lara Moda
            </h3>
            <p className="text-sm text-muted-foreground">
              Sua loja de moda feminina e masculina com produtos de qualidade e estilo único.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <div className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-home">
                    Início
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <div className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-products">
                    Produtos
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <div className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-about">
                    Sobre
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-contact">
                    Contato
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Atendimento</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Política de Troca</li>
              <li>Entregas</li>
              <li>Perguntas Frequentes</li>
              <li>Formas de Pagamento</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>(XX) XXXXX-XXXX</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>contato@laramoda.com</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Instagram className="h-4 w-4 text-primary" />
                <span>@laramoda</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Lara Moda. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Termos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
