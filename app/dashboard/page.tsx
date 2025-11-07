import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get vehicle count
  const { count: vehicleCount } = await supabase.from("vehicles").select("*", { count: "exact", head: true })

  // Get active listings count
  const { count: activeCount } = await supabase
    .from("vehicles")
    .select("*", { count: "exact", head: true })
    .eq("status", "anunciado")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
        <p className="text-muted-foreground mt-2">Bem-vindo ao sistema de gerenciamento da concessionária</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicleCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Todos os veículos no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Anúncios Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Atualmente à venda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Funcionalidades disponíveis</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
