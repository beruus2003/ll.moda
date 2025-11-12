import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Instagram, MessageCircle, MapPin } from "lucide-react";

export default function Contact() {
  const whatsappNumber = "5500000000000"; // Replace with actual number
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de mais informações sobre a Lara Moda.");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Entre em Contato
          </h1>
          <p className="text-lg text-muted-foreground">
            Estamos aqui para ajudar. Entre em contato conosco!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>WhatsApp</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Fale conosco diretamente pelo WhatsApp. Respondemos rapidamente!
              </p>
              <Button asChild className="w-full" data-testid="button-whatsapp">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Abrir WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>E-mail</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Envie suas dúvidas por e-mail. Retornaremos em breve.
              </p>
              <Button asChild variant="outline" className="w-full" data-testid="button-email">
                <a href="mailto:contato@laramoda.com">
                  <Mail className="mr-2 h-4 w-4" />
                  contato@laramoda.com
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Outras Formas de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">(XX) XXXXX-XXXX</span>
            </div>
            <div className="flex items-center space-x-3">
              <Instagram className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">@laramoda</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Brasil</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
