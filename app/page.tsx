import { createClient } from "@/lib/supabase/server"
import { VehicleGrid } from "@/components/vehicle-grid"
import { HeroSection } from "@/components/hero-section"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch all published vehicles
  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      media (*)
    `)
    .eq("status", "anunciado")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <HeroSection />

      {/* Vehicles Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-2 mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Nossa <span className="text-primary">Coleção</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Descubra nossa seleção premium de veículos cuidadosamente selecionados, cada um deles uma obra-prima de engenharia e design.
            </p>
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Falha ao carregar veículos</p>
            </div>
          ) : !vehicles || vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum veículo disponível no momento.</p>
            </div>
          ) : (
            <VehicleGrid vehicles={vehicles} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card border-t border-border/40">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Não encontrou o que procura?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Entre em contato com nossa equipe de vendas para saber sobre novos veículos e encomendas especiais.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <a href="mailto:vendas@automax.com">Entre em Contato</a>
          </Button>
        </div>
      </section>
    </div>
  )
}
