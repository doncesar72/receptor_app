"use client"

import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"

interface PhotoUploadSheetProps {
  isOpen: boolean
  onClose: () => void
  onFileSelect: (file: File) => void
}

export function PhotoUploadSheet({ isOpen, onClose, onFileSelect }: PhotoUploadSheetProps) {
  const handleCameraClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) onFileSelect(file)
    }
    input.click()
  }

  const handleGalleryClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) onFileSelect(file)
    }
    input.click()
  }

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Sheet */}
      <div className="relative bg-background rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Загрузить фото
          </h2>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            aria-label="Закрыть"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>
        
        {/* Options */}
        <div className="px-6 pb-8">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCameraClick}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-primary/20 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 btn-press"
            >
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">📷</span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-base">
                  Сделать фото
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Использовать камеру
                </p>
              </div>
            </button>
            
            <button
              onClick={handleGalleryClick}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-accent/20 bg-card hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 btn-press"
            >
              <div className="size-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <span className="text-2xl">🖼</span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-base">
                  Выбрать из галереи
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Из сохраненных
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
