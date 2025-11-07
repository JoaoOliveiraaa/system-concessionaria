"use client"

import Link from "next/link"
import Image from "next/image"
import { Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">AutoMax</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Início
            </Link>
            <Link 
              href="/sobre" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Sobre a Empresa
            </Link>
            <ThemeToggle />
            <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90">
              <a href="mailto:vendas@automax.com">Contato</a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

