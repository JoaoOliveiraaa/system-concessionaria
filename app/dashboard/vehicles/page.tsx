"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { VehicleForm } from "@/components/vehicle-form"
import { VehiclesTable } from "@/components/vehicles-table"

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
  created_at: string
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchVehicles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/vehicles")
      if (!response.ok) throw new Error("Failed to fetch vehicles")
      const data = await response.json()
      setVehicles(data || [])
    } catch (error) {
      console.error("Error fetching vehicles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddVehicle = () => {
    setEditingVehicle(null)
    setIsOpen(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setIsOpen(true)
  }

  const handleDeleteVehicle = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este veículo?")) {
      return
    }

    try {
      const response = await fetch(`/api/vehicles?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete vehicle")
      setVehicles(vehicles.filter((v) => v.id !== id))
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      alert("Falha ao deletar veículo")
    }
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingVehicle) {
        // Update existing vehicle
        const response = await fetch("/api/vehicles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingVehicle.id, ...formData }),
        })
        if (!response.ok) throw new Error("Failed to update vehicle")
        const updatedVehicle = await response.json()
        setVehicles(vehicles.map((v) => (v.id === editingVehicle.id ? updatedVehicle : v)))
      } else {
        // Create new vehicle
        const response = await fetch("/api/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!response.ok) throw new Error("Failed to create vehicle")
        const newVehicle = await response.json()
        setVehicles([newVehicle, ...vehicles])
      }
      setIsOpen(false)
      setEditingVehicle(null)
    } catch (error) {
      console.error("Error saving vehicle:", error)
      alert("Falha ao salvar veículo")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Veículos</h1>
          <p className="text-muted-foreground mt-2">Gerencie o inventário de veículos</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddVehicle} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? "Editar Veículo" : "Adicionar Novo Veículo"}</DialogTitle>
            </DialogHeader>
            <VehicleForm vehicle={editingVehicle} onSubmit={handleFormSubmit} onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Buscar por título, marca ou modelo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <VehiclesTable vehicles={filteredVehicles} onEdit={handleEditVehicle} onDelete={handleDeleteVehicle} />
      )}
    </div>
  )
}
