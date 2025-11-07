import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-card via-background to-background overflow-hidden border-b border-border/40">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Encontre Seu Veículo <span className="text-primary">Perfeito</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Navegue por nossa coleção exclusiva de automóveis premium. Cada veículo é cuidadosamente selecionado e mantido com os mais altos padrões de qualidade e performance.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="#vehicles">Explorar Agora</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sobre">Sobre Nós</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
