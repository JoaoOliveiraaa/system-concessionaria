"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Palette } from "lucide-react"

interface Media {
  id: string
  url: string
  type: string
}

interface VehicleGalleryProps {
  media: Media[]
  vehicleTitle: string
}

export function VehicleGallery({ media, vehicleTitle }: VehicleGalleryProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const currentMedia = media[selectedMediaIndex]

  if (!media || media.length === 0) {
    return (
      <Card className="overflow-hidden border-border/40">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            <Palette className="w-24 h-24 text-muted-foreground/30" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-border/40">
      <CardContent className="p-0">
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative w-full aspect-video bg-muted rounded-t-lg overflow-hidden">
            {currentMedia?.type === "image" ? (
              <Image
                src={currentMedia.url || "/placeholder.svg"}
                alt={vehicleTitle}
                fill
                className="object-contain"
                priority
              />
            ) : currentMedia?.type === "video" ? (
              <video
                src={currentMedia.url}
                controls
                className="w-full h-full object-contain"
              />
            ) : null}
          </div>

          {/* Thumbnails Grid */}
          {media.length > 1 && (
            <div className="grid grid-cols-5 gap-2 p-4">
              {media.map((item: any, index: number) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMediaIndex(index)}
                  className={`relative aspect-video bg-muted rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all ${
                    selectedMediaIndex === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {item.type === "image" ? (
                    <Image
                      src={item.url || "/placeholder.svg"}
                      alt={`${vehicleTitle} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-xs text-muted-foreground font-medium">▶</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

