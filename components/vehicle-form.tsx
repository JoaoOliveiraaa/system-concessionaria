"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MediaUpload } from "@/components/media-upload"
import { Loader2 } from "lucide-react"

interface MediaFile {
  id: string
  url: string
  type: "image" | "video"
  filename: string
  order: number
}

interface Vehicle {
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
  status: string
  description: string
  media?: any[]
}

interface VehicleFormProps {
  vehicle?: Vehicle | null
  onSubmit: (data: Partial<Vehicle> & { media?: MediaFile[] }) => Promise<void>
  onClose: () => void
}

const FUEL_TYPES = ["Gasolina", "Diesel", "Híbrido", "Elétrico"]
const GEARBOX_TYPES = ["Manual", "Automático", "CVT"]
const COLORS = ["Preto", "Branco", "Prata", "Cinza", "Vermelho", "Azul", "Verde", "Marrom", "Dourado"]
const STATUSES = ["rascunho", "anunciado", "vendido"]

export function VehicleForm({ vehicle, onSubmit, onClose }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    title: vehicle?.title || "",
    brand: vehicle?.brand || "",
    model: vehicle?.model || "",
    year: vehicle?.year || new Date().getFullYear(),
    color: vehicle?.color || "",
    km: vehicle?.km ?? 0,
    price: vehicle?.price ?? 0,
    fuel: vehicle?.fuel || "",
    gearbox: vehicle?.gearbox || "",
    status: vehicle?.status || "rascunho",
    description: vehicle?.description || "",
  })
  const [media, setMedia] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load existing media when editing
  useEffect(() => {
    if (vehicle?.media && Array.isArray(vehicle.media)) {
      const existingMedia = vehicle.media.map((m: any, index: number) => ({
        id: m.id || `existing-${index}`,
        url: m.url,
        type: (m.type || 'image') as "image" | "video",
        filename: m.url.split('/').pop() || `media-${index}`,
        order: m.order || index
      }))
      setMedia(existingMedia)
    }
  }, [vehicle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log('Submitting vehicle with media:', media)
      await onSubmit({ ...formData, media })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="year">Ano</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) || new Date().getFullYear() })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="brand">Marca</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="model">Modelo</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="km">Quilometragem (km)</Label>
          <Input
            id="km"
            type="number"
            value={formData.km}
            onChange={(e) => setFormData({ ...formData, km: Number.parseInt(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="color">Cor</Label>
          <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
            <SelectTrigger id="color">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COLORS.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="fuel">Tipo de Combustível</Label>
          <Select value={formData.fuel} onValueChange={(value) => setFormData({ ...formData, fuel: value })}>
            <SelectTrigger id="fuel">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((fuel) => (
                <SelectItem key={fuel} value={fuel}>
                  {fuel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="gearbox">Câmbio</Label>
          <Select value={formData.gearbox} onValueChange={(value) => setFormData({ ...formData, gearbox: value })}>
            <SelectTrigger id="gearbox">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GEARBOX_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "rascunho" ? "Rascunho" : status === "anunciado" ? "Anunciado" : "Vendido"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      {/* Media Upload Section */}
      <div className="border-t border-border/40 pt-4">
        <MediaUpload onMediaAdd={setMedia} existingMedia={media} />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" onClick={onClose} type="button">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {vehicle ? "Atualizar Veículo" : "Criar Veículo"}
        </Button>
      </div>
    </form>
  )
}
