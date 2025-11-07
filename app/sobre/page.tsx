import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Award, Users, Target, Shield } from "lucide-react"

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-card via-background to-background border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6 text-foreground">
              Sobre a <span className="text-primary">AutoMax</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Há mais de 15 anos no mercado, somos referência em veículos premium com atendimento personalizado e as melhores condições para você realizar o sonho do seu carro ideal.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/40">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Veículos cuidadosamente selecionados e inspecionados
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Atendimento</h3>
                <p className="text-sm text-muted-foreground">
                  Equipe especializada e atenciosa para ajudar você
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Transparência</h3>
                <p className="text-sm text-muted-foreground">
                  Informações claras e honestas sobre cada veículo
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Confiança</h3>
                <p className="text-sm text-muted-foreground">
                  Garantia e suporte pós-venda de excelência
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-card border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Nossa História</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Fundada em 2008, a AutoMax nasceu do sonho de criar uma concessionária diferenciada, 
                onde a paixão por automóveis se une ao compromisso com a satisfação do cliente.
              </p>
              <p>
                Ao longo dos anos, construímos uma reputação sólida no mercado de veículos premium, 
                sempre priorizando a qualidade, transparência e excelência no atendimento.
              </p>
              <p>
                Hoje, somos orgulhosamente uma das concessionárias mais respeitadas da região, 
                com milhares de clientes satisfeitos e uma coleção invejável de veículos de alto padrão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Venha nos visitar!</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a encontrar o veículo perfeito. 
            Entre em contato conosco ou visite nossa showroom.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <a href="mailto:vendas@automax.com">Falar com Vendedor</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/">Ver Veículos</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

