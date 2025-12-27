import OwnerLayout from '../layouts/OwnerLayout'
import { Plus, Edit, Trash2, Calendar, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AddPetModal from '../../../components/AddPetModal'
import Toast from '../../../components/Toast'
import ConfirmDialog from '../../../components/ConfirmDialog'
import { api } from '../../../lib/api'

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
    icon: string
  }
  photos?: Array<{
    url: string
    caption?: string
  }>
  createdAt: string
}

export default function Pets() {
  const navigate = useNavigate()
  const [showAddPetModal, setShowAddPetModal] = useState(false)
  const [showEditPetModal, setShowEditPetModal] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{show: boolean, type: 'success' | 'error', message: string}>({
    show: false,
    type: 'success',
    message: ''
  })

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      setLoading(true)
      const response = await api.get('/pets')
      
      if (response.data.success) {
        setPets(response.data.data.pets)
      }
    } catch (err: any) {
      console.error('Error fetching pets:', err)
      setError('Failed to load pets')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
  }

  const handlePetAdded = () => {
    fetchPets()
    setShowAddPetModal(false)
    showToast('success', 'Pet added successfully!')
  }

  const handlePetUpdated = () => {
    fetchPets()
    setShowEditPetModal(false)
    setSelectedPet(null)
    showToast('success', 'Pet updated successfully!')
  }

  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet)
    setShowEditPetModal(true)
  }

  const handleDeleteClick = (pet: Pet) => {
    setPetToDelete(pet)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!petToDelete) return

    try {
      await api.delete(`/pets/${petToDelete._id}`)
      showToast('success', `${petToDelete.name} has been deleted successfully`)
      fetchPets()
    } catch (err) {
      console.error('Error deleting pet:', err)
      showToast('error', 'Failed to delete pet. Please try again.')
    } finally {
      setShowDeleteDialog(false)
      setPetToDelete(null)
    }
  }

  const handleBookWalk = (petId: string) => {
    navigate(`/owner/book-walk?petId=${petId}`)
  }

  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
            <p className="text-gray-600 mt-1">Manage your furry friends</p>
          </div>
          <button
            onClick={() => setShowAddPetModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Pet
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Pets" value={pets.length.toString()} />
          <StatCard title="Total Walks" value="0" />
          <StatCard title="Active Today" value="0" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading your pets...</span>
          </div>
        ) : pets.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pets yet</h3>
            <p className="text-gray-600 mb-6">Add your first pet to get started!</p>
            <button
              onClick={() => setShowAddPetModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Pet
            </button>
          </div>
        ) : (
          /* Pets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard
                key={pet._id}
                pet={pet}
                onEdit={handleEditPet}
                onDelete={handleDeleteClick}
                onBookWalk={handleBookWalk}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Pet Modal */}
      <AddPetModal
        isOpen={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        onSuccess={handlePetAdded}
        mode="add"
      />

      {/* Edit Pet Modal */}
      <AddPetModal
        isOpen={showEditPetModal}
        onClose={() => {
          setShowEditPetModal(false)
          setSelectedPet(null)
        }}
        onSuccess={handlePetUpdated}
        mode="edit"
        pet={selectedPet}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Pet"
        message={`Are you sure you want to delete ${petToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false)
          setPetToDelete(null)
        }}
      />

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ show: false, type: 'success', message: '' })}
      />
    </OwnerLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface PetCardProps {
  pet: Pet
  onEdit: (pet: Pet) => void
  onDelete: (pet: Pet) => void
  onBookWalk: (petId: string) => void
}

function PetCard({ pet, onEdit, onDelete, onBookWalk }: PetCardProps) {
  const petImage = pet.photos && pet.photos.length > 0 
    ? `http://localhost:5000/${pet.photos[0].url}`
    : null
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-5xl overflow-hidden">
          {petImage ? (
            <img src={petImage} alt={pet.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            pet.petType.icon
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(pet)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
            title="Edit pet"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(pet)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete pet"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-1">{pet.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{pet.breed}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Age</span>
          <span className="font-medium text-gray-900">{pet.age} {pet.age === 1 ? 'year' : 'years'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Type</span>
          <span className="font-medium text-gray-900">{pet.petType.name}</span>
        </div>
        {pet.weight && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Weight</span>
            <span className="font-medium text-gray-900">{pet.weight} kg</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Vaccinated</span>
          <span className={`font-medium ${pet.vaccinated ? 'text-green-600' : 'text-red-600'}`}>
            {pet.vaccinated ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Temperament</span>
          <span className={`font-medium ${pet.temperament ? 'text-gray-900' : 'text-gray-400'}`}>
            {pet.temperament?.name || 'Not specified'}
          </span>
        </div>
      </div>

      {pet.description && (
        <p className="text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">{pet.description}</p>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total Walks</span>
          <span className="text-lg font-bold text-purple-600">0</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Last Walk</span>
          <span className="text-sm font-medium text-gray-900">Never</span>
        </div>
        <button 
          onClick={() => onBookWalk(pet._id)}
          className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Book Walk
        </button>
      </div>
    </div>
  )
}
