"use client"

import { useCallback, useState, useRef } from "react"
import { Camera, ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { PhotoUploadSheet } from "./photo-upload-sheet"

interface UploadZoneProps {
  onUpload: (imageDataUrl: string) => void
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        console.log("[UploadZone] Selected file:", {
          name: file.name,
          type: file.type,
          size: file.size,
        })
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          console.log("[UploadZone] FileReader loaded image data URL, length:", dataUrl?.length)
          setPreview(dataUrl)
          onUpload(dataUrl)
        }
        reader.readAsDataURL(file)
      }
    },
    [onUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleCameraCapture = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleGallerySelect = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleZoneClick = useCallback(() => {
    if (!preview) {
      setIsSheetOpen(true)
    }
  }, [preview])

  const handleReplacePhoto = useCallback(() => {
    setIsSheetOpen(true)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      console.log("[UploadZone] Input change event, file present:", !!file)
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <>
      <div className="flex flex-col gap-4">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-300 cursor-pointer",
            "min-h-[220px]",
            isDragging
              ? "border-accent bg-[#FFF7ED] scale-[1.02]"
              : preview
              ? "border-primary bg-card"
              : "border-primary/40 bg-card hover:border-primary hover:bg-muted/50"
          )}
          onClick={handleZoneClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputChange}
            className="hidden"
            aria-label="Загрузить фото продуктов"
          />

          {preview ? (
            <div className="relative w-full">
              <div 
                className="w-full h-48 rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 flex items-center justify-center"
                onError={() => setPreview(null)}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <div className="absolute inset-0 bg-foreground/5 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={handleReplacePhoto}
                  className="bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-card transition-colors"
                >
                  <Camera className="size-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">
                    Заменить фото
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ImagePlus className="size-8 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 size-7 rounded-lg bg-accent flex items-center justify-center shadow-md">
                  <Camera className="size-4 text-accent-foreground" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground text-base">
                  Сфотографируйте продукты
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Нажмите чтобы загрузить фото
                </p>
              </div>
            </div>
          )}
        </div>

        {preview && (
          <button
            onClick={() => {
              setPreview(null)
            }}
            className="text-sm text-muted-foreground hover:text-accent transition-colors self-center"
          >
            Удалить фото
          </button>
        )}
      </div>

      <PhotoUploadSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCameraCapture={handleCameraCapture}
        onGallerySelect={handleGallerySelect}
      />
    </>
  )
}
