"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Trash2, Upload, AlertCircle } from "lucide-react"

interface MediaFile {
  id: string
  url: string
  type: "image" | "video"
  filename: string
  order: number
}

interface MediaUploadProps {
  onMediaAdd: (media: MediaFile[]) => void
  existingMedia?: MediaFile[]
}

export function MediaUpload({ onMediaAdd, existingMedia = [] }: MediaUploadProps) {
  const [media, setMedia] = useState<MediaFile[]>(existingMedia)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync with existing media when it changes
  useEffect(() => {
    if (existingMedia && existingMedia.length > 0) {
      setMedia(existingMedia)
    }
  }, [existingMedia])

  // Update parent when media changes
  useEffect(() => {
    onMediaAdd(media)
  }, [media]) // Removemos onMediaAdd das dependências para evitar loops

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    setError(null)
    setUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type
        const isImage = file.type.startsWith("image/")
        const isVideo = file.type.startsWith("video/")

        if (!isImage && !isVideo) {
          setError("Only image and video files are allowed")
          continue
        }

        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()

        const newMedia: MediaFile = {
          id: `${Date.now()}-${i}`,
          url: data.url,
          type: isImage ? "image" : "video",
          filename: data.filename || file.name,
          order: media.length + i,
        }

        setMedia((prev) => [...prev, newMedia])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const removeMedia = async (id: string) => {
    const mediaItem = media.find((m) => m.id === id)
    if (!mediaItem) return

    try {
      await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: mediaItem.url }),
      })

      setMedia((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  const reorderMedia = (id: string, direction: "up" | "down") => {
    const index = media.findIndex((m) => m.id === id)
    if (index === -1) return

    const newMedia = [...media]
    if (direction === "up" && index > 0) {
      ;[newMedia[index], newMedia[index - 1]] = [newMedia[index - 1], newMedia[index]]
    } else if (direction === "down" && index < newMedia.length - 1) {
      ;[newMedia[index], newMedia[index + 1]] = [newMedia[index + 1], newMedia[index]]
    }

    setMedia(newMedia)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Media (Fotos e Vídeos)</label>
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={uploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Fotos e Vídeos"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {media.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">
            {media.length} arquivo(s) - 
            <span className="text-muted-foreground ml-1">
              Arraste para reordenar ou clique para remover
            </span>
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((item, index) => (
              <Card key={item.id} className="relative overflow-hidden group border-2 border-transparent hover:border-primary">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  {item.type === "image" ? (
                    <Image 
                      src={item.url || "/placeholder.svg"} 
                      alt={item.filename} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs font-medium">▶ Vídeo</span>
                    </div>
                  )}
                  
                  {/* Order Badge */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => reorderMedia(item.id, "up")}
                    disabled={index === 0}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    title="Mover para cima"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => reorderMedia(item.id, "down")}
                    disabled={index === media.length - 1}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    title="Mover para baixo"
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeMedia(item.id)}
                    className="text-white hover:bg-red-500/50 h-8 w-8 p-0"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
