import { X, Calendar, Phone, Mail } from 'lucide-react'

interface Pet {
  _id: string
  name: string
  breed: string
  age: number
  weight?: number
  gender: string
  description?: string
  vaccinated?: boolean
  petType: {
    _id: string
    name: string
    icon: string
  }
  temperament?: {
    _id: string
    name: string
  }
  owner: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  photos?: Array<{
    url: string
  }>
  createdAt: string
}

interface PetDetailsModalProps {
  pet: Pet
  onClose: () => void
}

export default function PetDetailsModal({ pet, onClose }: PetDetailsModalProps) {
  const petImage = pet.photos && pet.photos.length > 0
    ? import.meta.env.VITE_APP_URL + pet.photos[0].url
    : pet.petType.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Pet Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Pet Image and Basic Info */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-6xl overflow-hidden flex-shrink-0">
              {pet.photos && pet.photos.length > 0 ? (
                <img src={petImage} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                petImage
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{pet.name}</h3>
              <p className="text-lg text-gray-600 mb-1">{pet.breed}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</span>
                <span>•</span>
                <span className="capitalize">{pet.gender}</span>
                {pet.weight && (
                  <>
                    <span>•</span>
                    <span>{pet.weight} kg</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Pet Information Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Pet Type</p>
              <p className="text-sm font-semibold text-gray-900">{pet.petType.name}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Temperament</p>
              <p className="text-sm font-semibold text-gray-900">
                {pet.temperament?.name || 'Not specified'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Vaccinated</p>
              <p className={`text-sm font-semibold ${pet.vaccinated ? 'text-green-600' : 'text-red-600'}`}>
                {pet.vaccinated ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Registered</p>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(pet.createdAt)}
              </p>
            </div>
          </div>

          {/* Description */}
          {pet.description && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">{pet.description}</p>
            </div>
          )}

          {/* Owner Information */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Owner Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">
                    {pet.owner.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{pet.owner.name}</p>
                  <p className="text-xs text-gray-500">Pet Owner</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${pet.owner.email}`} className="hover:text-indigo-600">
                  {pet.owner.email}
                </a>
              </div>
              {pet.owner.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${pet.owner.phone}`} className="hover:text-indigo-600">
                    {pet.owner.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
