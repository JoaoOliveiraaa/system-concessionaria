"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fuel, Gauge, Palette, Zap } from "lucide-react"

interface Media {
  id: string
  url: string
  type: string
}

interface VehicleCardProps {
  vehicle: {
    id: string
    title: string
    brand: string
    model: string
    year: number
    color: string
    km: number
    price: number
    fuel: string
    gearbox: string
    media?: Media[]
  }
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const [imageError, setImageError] = useState(false)
  const mainImage = vehicle.media?.[0]

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
    <Link href={`/veiculos/${vehicle.id}`}>
      <Card className="overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-border/40 hover:border-primary/40 group cursor-pointer">
        {/* Image Section */}
        <div className="relative h-56 bg-muted overflow-hidden">
        {mainImage && !imageError ? (
          <Image
            src={mainImage.url || "/placeholder.svg"}
            alt={vehicle.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Palette className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
            {vehicle.year}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground">{vehicle.title}</h3>
          <p className="text-sm text-muted-foreground">
            {vehicle.brand} {vehicle.model}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-6">
        {/* Price */}
        <div className="text-2xl font-bold text-primary">{formatPrice(vehicle.price)}</div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{formatKm(vehicle.km)} km</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Fuel className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{vehicle.fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{vehicle.gearbox}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{vehicle.color}</span>
          </div>
        </div>

        {/* Media count */}
        {vehicle.media && vehicle.media.length > 0 && (
          <p className="text-xs text-muted-foreground border-t border-border/40 pt-3">
            📷 {vehicle.media.length} foto{vehicle.media.length > 1 ? "s" : ""}
          </p>
        )}
      </CardContent>
    </Card>
    </Link>
  )
}
