"use client"

import { Edit2, Trash2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Media {
  id: string
  url: string
  type: string
  order: number
}

interface Vehicle {
  id: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  km: number
  status: string
  media?: Media[]
}

interface VehiclesTableProps {
  vehicles: Vehicle[]
  onEdit: (vehicle: Vehicle) => void
  onDelete: (id: string) => void
}

const statusColors: Record<string, string> = {
  rascunho: "secondary",
  anunciado: "default",
  vendido: "destructive",
}

const statusLabels: Record<string, string> = {
  rascunho: "Rascunho",
  anunciado: "Anunciado",
  vendido: "Vendido",
}

export function VehiclesTable({ vehicles, onEdit, onDelete }: VehiclesTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatKm = (km: number) => {
    return new Intl.NumberFormat("pt-BR").format(km)
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 border border-border/40 rounded-lg bg-card/50">
        <p className="text-muted-foreground">Nenhum veículo encontrado.</p>
      </div>
    )
  }

  return (
    <div className="border border-border/40 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-card border-border/40">
            <TableHead className="w-24">Imagem</TableHead>
            <TableHead>Veículo</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Quilometragem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => {
            const mainImage = vehicle.media?.find(m => m.type === 'image')
            const imageCount = vehicle.media?.filter(m => m.type === 'image').length || 0
            
            return (
            <TableRow key={vehicle.id} className="border-border/40 hover:bg-card/50 transition">
              <TableCell>
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                  {mainImage ? (
                    <Image
                      src={mainImage.url}
                      alt={vehicle.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                  {imageCount > 1 && (
                    <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded-tl">
                      +{imageCount - 1}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <p className="text-foreground">{vehicle.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.brand} {vehicle.model}
                  </p>
                </div>
              </TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell className="font-semibold text-primary">{formatPrice(vehicle.price)}</TableCell>
              <TableCell>{formatKm(vehicle.km)} km</TableCell>
              <TableCell>
                <Badge variant={statusColors[vehicle.status] as any}>{statusLabels[vehicle.status]}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(vehicle)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(vehicle.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
