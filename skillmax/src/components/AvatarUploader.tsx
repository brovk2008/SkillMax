'use client'

import { useState, useRef } from 'react'
import { Upload, Dices, Image as ImageIcon, Check, RefreshCw } from 'lucide-react'

const RANDOM_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
]

interface AvatarUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function AvatarUploader({ value, onChange, label = 'Profile Avatar Photo' }: AvatarUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP)')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  function handleRandomize() {
    const randomIndex = Math.floor(Math.random() * RANDOM_AVATARS.length)
    onChange(RANDOM_AVATARS[randomIndex])
  }

  return (
    <div className="space-y-3">
      {label && <label className="block text-xs font-semibold text-slate-700">{label}</label>}

      {/* Main Avatar Preview & Drag & Drop Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col sm:flex-row items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-all duration-200 ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
            : 'border-slate-300 bg-slate-50/70 hover:border-emerald-400 hover:bg-slate-50'
        }`}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0])
            }
          }}
        />

        {/* Avatar Image Circle Preview */}
        <div className="relative shrink-0 group">
          <img
            src={value || RANDOM_AVATARS[0]}
            alt="Profile Avatar"
            className="h-16 w-16 rounded-full object-cover border-2 border-emerald-500 shadow-md group-hover:opacity-90 transition-opacity"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 rounded-full bg-emerald-600 p-1 text-white shadow-xs hover:bg-emerald-700 transition-colors"
            title="Upload Photo"
          >
            <Upload className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Controls & Dropzone Instruction */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div>
            <p className="text-xs font-semibold text-slate-900">
              Drag &amp; drop your photo here, or click to upload
            </p>
            <p className="text-[11px] text-slate-500">Supports PNG, JPG, WEBP (Max 5MB)</p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
            {/* Upload File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Photo</span>
            </button>

            {/* Random Avatar Button */}
            <button
              type="button"
              onClick={handleRandomize}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
              title="Pick a random profile photo"
            >
              <Dices className="h-3.5 w-3.5 text-emerald-600 animate-bounce" />
              <span>Random Avatar</span>
            </button>

            {/* Toggle Paste Custom URL */}
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 hover:underline transition-colors"
            >
              <ImageIcon className="h-3 w-3" />
              <span>{showUrlInput ? 'Hide URL field' : 'Paste URL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Paste Image URL Field */}
      {showUrlInput && (
        <div className="animate-in fade-in zoom-in-95 duration-150">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste custom photo URL (https://...)"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
          />
        </div>
      )}

      {/* Quick Select Presets Grid */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Or choose from sample avatars:</p>
        <div className="flex flex-wrap gap-2">
          {RANDOM_AVATARS.slice(0, 6).map((url, idx) => {
            const isSelected = value === url
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(url)}
                className={`relative h-9 w-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                  isSelected ? 'border-emerald-600 scale-110 shadow-sm ring-2 ring-emerald-200' : 'border-slate-200 opacity-75 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img src={url} alt={`Preset Avatar ${idx}`} className="h-full w-full object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-600/40 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
