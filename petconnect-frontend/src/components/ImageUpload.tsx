import { useState, useRef } from 'react'
import { Upload, Camera, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploadProps {
  label: string
  onImageSelect: (file: File) => void
  preview?: string | null
  allowCamera?: boolean
  accept?: string
  maxSize?: number // in MB
}

export default function ImageUpload({
  label,
  onImageSelect,
  preview,
  allowCamera = false,
  accept = 'image/jpeg,image/png,image/jpg',
  maxSize = 5
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    onImageSelect(file)
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      })
      setStream(mediaStream)
      setShowCamera(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
            onImageSelect(file)
            stopCamera()
          }
        }, 'image/jpeg', 0.9)
      }
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {!preview && !showCamera && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
          />

          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop your image here, or
          </p>

          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Choose File
            </button>

            {allowCamera && (
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Max file size: {maxSize}MB
          </p>
        </div>
      )}

      {/* Camera View */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-black rounded-xl overflow-hidden"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors font-medium flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Capture
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview */}
      {preview && !showCamera && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-xl border-2 border-green-500"
          />
          <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
            <Check className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium shadow-lg"
          >
            Change
          </button>
        </motion.div>
      )}
    </div>
  )
}
