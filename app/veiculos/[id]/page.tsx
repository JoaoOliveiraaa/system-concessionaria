import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VehicleGallery } from "@/components/vehicle-gallery"
import { Fuel, Gauge, Palette, Zap, Calendar, Mail, Phone } from "lucide-react"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VehicleDetailsPage(props: PageProps) {
  const params = await props.params
  const supabase = await createClient()

  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      media (*)
    `)
    .eq("id", params.id)
    .eq("status", "anunciado")
    .single()

  if (error || !vehicle) {
    notFound()
  }

  const mainMedia = vehicle.media || []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatKm = (km: number) => {
    return new Intl.NumberFormat("pt-BR").format(km)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{vehicle.title}</h1>
          <p className="text-xl text-muted-foreground">
            {vehicle.brand} {vehicle.model}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Gallery and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <VehicleGallery media={mainMedia} vehicleTitle={vehicle.title} />

            {/* Description */}
            <Card className="border-border/40">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Descrição</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {vehicle.description || "Descrição não disponível."}
                </p>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="border-border/40">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Especificações</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ano</p>
                      <p className="font-semibold">{vehicle.year}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Gauge className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Quilometragem</p>
                      <p className="font-semibold">{formatKm(vehicle.km)} km</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Fuel className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Combustível</p>
                      <p className="font-semibold">{vehicle.fuel}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Câmbio</p>
                      <p className="font-semibold">{vehicle.gearbox}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Palette className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cor</p>
                      <p className="font-semibold">{vehicle.color}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Price and Contact */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="border-primary/40 shadow-lg sticky top-24">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <Badge variant="secondary" className="mb-3">
                    {vehicle.year}
                  </Badge>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatPrice(vehicle.price)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    À vista ou financiado
                  </p>
                </div>

                <div className="space-y-3">
                  <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90">
                    <a href={`mailto:vendas@automax.com?subject=Interesse no ${vehicle.title}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar E-mail
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <a href={`https://wa.me/5511999999999?text=Olá! Tenho interesse no ${vehicle.title}`} target="_blank" rel="noopener noreferrer">
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border/40">
                  <p className="text-xs text-center text-muted-foreground">
                    📷 {mainMedia.length} {mainMedia.length === 1 ? "foto" : "fotos"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-border/40">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4">Informações Importantes</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Veículo inspecionado</li>
                  <li>✓ Documentação em dia</li>
                  <li>✓ Aceita financiamento</li>
                  <li>✓ Aceita troca</li>
                  <li>✓ Garantia disponível</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

