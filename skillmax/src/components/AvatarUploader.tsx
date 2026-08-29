'use client'

import { useState, useRef } from 'react'
import { Upload, Dices, Image as ImageIcon, Check } from 'lucide-react'

export const CARTOON_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Zack',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sparkle',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Milo',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Sasha',
  'https://api.dicebear.com/7.x/micah/svg?seed=Leo',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Alex',
  'https://api.dicebear.com/7.x/open-peeps/svg?seed=Sam',
  'https://api.dicebear.com/7.x/personas/svg?seed=Jordan',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Maya',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nico',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Pixel',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Bliss',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Chloe',
]

interface AvatarUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function AvatarUploader({ value, onChange, label = 'Profile Cartoon Avatar' }: AvatarUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, SVG)')
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
    const seed = `SkillMax_${Math.random().toString(36).substring(7)}`
    const styles = ['adventurer', 'avataaars', 'bottts', 'fun-emoji', 'big-smile', 'lorelei', 'micah', 'notionists']
    const style = styles[Math.floor(Math.random() * styles.length)]
    onChange(`https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`)
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
            src={value || CARTOON_AVATARS[0]}
            alt="Cartoon Avatar"
            className="h-16 w-16 rounded-full object-cover bg-emerald-100 border-2 border-emerald-500 shadow-md group-hover:opacity-90 transition-opacity"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 rounded-full bg-emerald-600 p-1 text-white shadow-xs hover:bg-emerald-700 transition-colors"
            title="Upload Custom Image"
          >
            <Upload className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Controls & Dropzone Instruction */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div>
            <p className="text-xs font-semibold text-slate-900">
              Drag &amp; drop your custom cartoon/image here, or click to upload
            </p>
            <p className="text-[11px] text-slate-500">Supports PNG, JPG, WEBP, SVG (Max 5MB)</p>
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

            {/* Random Cartoon Avatar Button */}
            <button
              type="button"
              onClick={handleRandomize}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer shadow-xs"
              title="Generate a unique 3D Cartoon Avatar"
            >
              <Dices className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
              <span>🎲 Random Cartoon</span>
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
            placeholder="Paste custom photo or avatar URL (https://...)"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
          />
        </div>
      )}

      {/* Quick Select Cartoon Presets Grid */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Choose from cartoon avatars:</p>
        <div className="flex flex-wrap gap-2">
          {CARTOON_AVATARS.slice(0, 8).map((url, idx) => {
            const isSelected = value === url
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(url)}
                className={`relative h-10 w-10 rounded-full overflow-hidden border-2 bg-emerald-50 transition-all cursor-pointer ${
                  isSelected ? 'border-emerald-600 scale-110 shadow-sm ring-2 ring-emerald-300' : 'border-slate-200 opacity-80 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img src={url} alt={`Cartoon Avatar ${idx}`} className="h-full w-full object-cover" />
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
