import { Card, CardContent } from "@/components/ui/card";
import { Heart, TrendingUp, Users } from "lucide-react";
import logoUrl from "@assets/2_1762970835071.png";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <img src={logoUrl} alt="Lara Moda" className="h-24 w-24 mx-auto mb-6" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Sobre a Lara Moda
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sua loja online de moda feminina e masculina com estilo e qualidade
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="font-heading text-2xl font-semibold mb-4">Nossa História</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Lara Moda nasceu com o objetivo de oferecer moda de qualidade com estilo único para todos.
                Nossa missão é proporcionar uma experiência de compra excepcional, com produtos cuidadosamente
                selecionados e atendimento personalizado.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Produtos selecionados com cuidado e atenção aos detalhes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Estilo</h3>
                <p className="text-sm text-muted-foreground">
                  Sempre atualizados com as últimas tendências da moda
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Atendimento</h3>
                <p className="text-sm text-muted-foreground">
                  Equipe dedicada para ajudar você em qualquer momento
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
