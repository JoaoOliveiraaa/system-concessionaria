"use client"

import { useState, useMemo } from "react"
import { VehicleCard } from "./vehicle-card"
import { VehicleSearchBar } from "./vehicle-search-bar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

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
  media?: Array<{
    id: string
    url: string
    type: string
  }>
}

interface VehicleGridProps {
  vehicles: Vehicle[]
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedFuel, setSelectedFuel] = useState<string>("all")
  const [selectedGearbox, setSelectedGearbox] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")

  // Get unique values for filters
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(vehicles.map((v) => v.brand))]
    return uniqueBrands.sort()
  }, [vehicles])

  const fuels = useMemo(() => {
    const uniqueFuels = [...new Set(vehicles.map((v) => v.fuel))]
    return uniqueFuels.sort()
  }, [vehicles])

  const gearboxes = useMemo(() => {
    const uniqueGearboxes = [...new Set(vehicles.map((v) => v.gearbox))]
    return uniqueGearboxes.sort()
  }, [vehicles])

  // Filter vehicles based on selections
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const searchLower = searchQuery.toLowerCase()
      const searchMatch =
        searchQuery === "" ||
        vehicle.title.toLowerCase().includes(searchLower) ||
        vehicle.brand.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower) ||
        vehicle.description.toLowerCase().includes(searchLower)

      const brandMatch = selectedBrand === "all" || vehicle.brand === selectedBrand
      const fuelMatch = selectedFuel === "all" || vehicle.fuel === selectedFuel
      const gearboxMatch = selectedGearbox === "all" || vehicle.gearbox === selectedGearbox

      let priceMatch = true
      if (priceRange !== "all") {
        const price = vehicle.price
        switch (priceRange) {
          case "under-50":
            priceMatch = price < 50000
            break
          case "50-100":
            priceMatch = price >= 50000 && price < 100000
            break
          case "100-150":
            priceMatch = price >= 100000 && price < 150000
            break
          case "over-150":
            priceMatch = price >= 150000
            break
        }
      }

      return searchMatch && brandMatch && fuelMatch && gearboxMatch && priceMatch
    })
  }, [vehicles, searchQuery, selectedBrand, selectedFuel, selectedGearbox, priceRange])

  const handleReset = () => {
    setSearchQuery("")
    setSelectedBrand("all")
    setSelectedFuel("all")
    setSelectedGearbox("all")
    setPriceRange("all")
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - Filters */}
      <aside className="w-full lg:w-80 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          {/* Search Bar */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Buscar</h3>
            <VehicleSearchBar onSearch={setSearchQuery} />
          </div>

          {/* Filters Card */}
          <div className="p-6 bg-card rounded-lg border border-border/40 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="h-8 text-xs"
              >
                Limpar
              </Button>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Marca</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fuel Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Combustível</label>
              <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {fuels.map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>
                      {fuel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gearbox Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Câmbio</label>
              <Select value={selectedGearbox} onValueChange={setSelectedGearbox}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {gearboxes.map((gearbox) => (
                    <SelectItem key={gearbox} value={gearbox}>
                      {gearbox}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Faixa de Preço</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="under-50">Até R$ 50k</SelectItem>
                  <SelectItem value="50-100">R$ 50k - R$ 100k</SelectItem>
                  <SelectItem value="100-150">R$ 100k - R$ 150k</SelectItem>
                  <SelectItem value="over-150">Acima de R$ 150k</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="pt-4 border-t border-border/40">
              <p className="text-sm text-muted-foreground text-center">
                {filteredVehicles.length} de {vehicles.length} veículos
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Vehicle Grid */}
      <div className="flex-1 min-w-0">
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Nenhum veículo corresponde aos seus filtros.
            </p>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="mt-4"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
