import { useState, useRef, useEffect } from 'react'
import { X, Upload, Loader, Camera } from 'lucide-react'
import { api } from '../lib/api'
import type { PetType, Temperament } from '../types/petData'

interface AddPetModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddPetModal({ isOpen, onClose, onSuccess }: AddPetModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    petType: '',
    breed: '',
    age: '',
    weight: '',
    gender: 'male',
    description: '',
    temperament: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [petTypes, setPetTypes] = useState<PetType[]>([])
  const [temperaments, setTemperaments] = useState<Temperament[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch pet types and temperaments on mount
  useEffect(() => {
    if (isOpen) {
      fetchPetData()
    }
  }, [isOpen])

  const fetchPetData = async () => {
    try {
      setLoadingData(true)
      const [typesRes, temperamentsRes] = await Promise.all([
        api.get('/pet-types/active'),
        api.get('/temperaments/active')
      ])

      if (typesRes.data.success) {
        setPetTypes(typesRes.data.data.petTypes)
        // Set first pet type as default
        if (typesRes.data.data.petTypes.length > 0 && !formData.petType) {
          setFormData(prev => ({ ...prev, petType: typesRes.data.data.petTypes[0]._id }))
        }
      }

      if (temperamentsRes.data.success) {
        setTemperaments(temperamentsRes.data.data.temperaments)
        // Set first temperament as default
        if (temperamentsRes.data.data.temperaments.length > 0 && !formData.temperament) {
          setFormData(prev => ({ ...prev, temperament: temperamentsRes.data.data.temperaments[0]._id }))
        }
      }
    } catch (err) {
      console.error('Error fetching pet data:', err)
      setError('Failed to load pet types and temperaments')
    } finally {
      setLoadingData(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setImageFile(file)
    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError('')

      // Create FormData for multipart upload
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('petType', formData.petType)
      submitData.append('breed', formData.breed)
      submitData.append('age', formData.age)
      submitData.append('weight', formData.weight)
      submitData.append('gender', formData.gender)
      submitData.append('description', formData.description)
      submitData.append('temperament', formData.temperament)
      
      if (imageFile) {
        submitData.append('photo', imageFile)
      }

      const response = await api.post('/pets', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        onSuccess()
        handleClose()
      }
    } catch (err: any) {
      console.error('Error adding pet:', err)
      setError(err.response?.data?.message || 'Failed to add pet')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      petType: petTypes.length > 0 ? petTypes[0]._id : '',
      breed: '',
      age: '',
      weight: '',
      gender: 'male',
      description: '',
      temperament: temperaments.length > 0 ? temperaments[0]._id : ''
    })
    setImageFile(null)
    setImagePreview('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Add New Pet</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : (
            <>
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Pet preview"
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-12 h-12 text-purple-400" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-lg"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      Upload a clear photo of your pet
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, JPEG, PNG or GIF. Max size 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Pet Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                    maxLength={30}
                    placeholder="Bosco"
                  />
                </div>

                {/* Pet Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.petType}
                    onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  >
                    {petTypes.map(type => (
                      <option key={type._id} value={type._id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Breed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                    placeholder="e.g., Golden Retriever"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age (years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                    min="0"
                    max="30"
                    step="0.1"
                    placeholder="e.g., 3"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    min="0"
                    max="200"
                    step="0.1"
                    placeholder="e.g., 25"
                  />
                </div>
              </div>

              {/* Temperament */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperament
                </label>
                <select
                  value={formData.temperament}
                  onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  {temperaments.map(temp => (
                    <option key={temp._id} value={temp._id}>
                      {temp.icon} {temp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                  maxLength={500}
                  placeholder="Tell us about your pet's personality, habits, likes/dislikes..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Adding Pet...
                    </>
                  ) : (
                    'Add Pet'
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
