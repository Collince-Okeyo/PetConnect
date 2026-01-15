import AdminLayout from '../layouts/AdminLayout'
import { Search, Settings, Loader, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import PetDataManagement from '../../../components/admin/PetDataManagement'
import PetDetailsModal from '../../../components/admin/PetDetailsModal'
import AddPetModal from '../../../components/AddPetModal'
import ConfirmDialog from '../../../components/ConfirmDialog'
import Toast from '../../../components/Toast'
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

interface Stats {
  total: number
  byType: Record<string, number>
  activeToday: number
}

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [filteredPets, setFilteredPets] = useState<Pet[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, byType: {}, activeToday: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [showManagement, setShowManagement] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const petsPerPage = 12
  
  // Modal states
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null)
  
  // Toast state
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
      const response = await api.get('/admin/pets')
      
      if (response.data.success) {
        setPets(response.data.data.pets)
        setFilteredPets(response.data.data.pets)
        setStats(response.data.data.stats)
      }
    } catch (err: any) {
      console.error('Error fetching pets:', err)
      showToast('error', 'Failed to load pets')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
  }

  const handleViewDetails = (pet: Pet) => {
    setSelectedPet(pet)
    setShowDetailsModal(true)
  }

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet)
    setShowEditModal(true)
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
      fetchPets() // Refresh the list
    } catch (err) {
      console.error('Error deleting pet:', err)
      showToast('error', 'Failed to delete pet. Please try again.')
    } finally {
      setShowDeleteDialog(false)
      setPetToDelete(null)
    }
  }

  const handlePetUpdated = () => {
    fetchPets()
    setShowEditModal(false)
    setSelectedPet(null)
    showToast('success', 'Pet updated successfully!')
  }

  // Apply search and filter
  useEffect(() => {
    let result = pets

    // Apply search filter
    if (searchQuery) {
      result = result.filter(pet =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply pet type filter
    if (filter !== 'all') {
      result = result.filter(pet =>
        pet.petType.name.toLowerCase() === filter.toLowerCase()
      )
    }

    setFilteredPets(result)
    setCurrentPage(1) // Reset to first page on filter change
  }, [searchQuery, filter, pets])

  // Pagination
  const indexOfLastPet = currentPage * petsPerPage
  const indexOfFirstPet = indexOfLastPet - petsPerPage
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet)
  const totalPages = Math.ceil(filteredPets.length / petsPerPage)

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pet Management</h1>
            <p className="text-gray-600 mt-1">View and manage all registered pets</p>
          </div>
          <button
            onClick={() => setShowManagement(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Settings className="w-5 h-5" />
            Manage Pet Data
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Pets" value={stats.total.toString()} />
          <StatCard title="Dogs" value={(stats.byType['dog'] || 0).toString()} />
          <StatCard title="Cats" value={(stats.byType['cat'] || 0).toString()} />
          <StatCard title="Active Today" value={stats.activeToday.toString()} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by pet name, breed, or owner..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('dog')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'dog' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Dogs
              </button>
              <button
                onClick={() => setFilter('cat')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'cat' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Cats
              </button>
            </div>
          </div>
        </div>

        {/* Pets Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600">Loading pets...</span>
          </div>
        ) : currentPets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg">No pets found</p>
            {searchQuery && (
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentPets.map((pet) => (
              <PetCard
                key={pet._id}
                pet={pet}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredPets.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{indexOfFirstPet + 1}-{Math.min(indexOfLastPet, filteredPets.length)}</span> of <span className="font-medium">{filteredPets.length}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pet Data Management Modal */}
      {showManagement && (
        <PetDataManagement onClose={() => setShowManagement(false)} />
      )}

      {/* Pet Details Modal */}
      {showDetailsModal && selectedPet && (
        <PetDetailsModal
          pet={selectedPet}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedPet(null)
          }}
        />
      )}

      {/* Edit Pet Modal */}
      {showEditModal && selectedPet && (
        <AddPetModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedPet(null)
          }}
          onSuccess={handlePetUpdated}
          mode="edit"
          pet={selectedPet}
        />
      )}

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
    </AdminLayout>
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
  onViewDetails: (pet: Pet) => void
  onEdit: (pet: Pet) => void
  onDelete: (pet: Pet) => void
}

function PetCard({ pet, onViewDetails, onEdit, onDelete }: PetCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleViewDetails = () => {
    onViewDetails(pet)
    setShowMenu(false)
  }

  const handleEdit = () => {
    onEdit(pet)
    setShowMenu(false)
  }

  const handleDelete = () => {
    onDelete(pet)
    setShowMenu(false)
  }
  const petImage = pet.photos && pet.photos.length > 0
    ? import.meta.env.VITE_APP_URL + pet.photos[0].url
    : pet.petType.icon
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-4xl overflow-hidden">
          {pet.photos && pet.photos.length > 0 ? (
            <img src={petImage} alt={pet.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            petImage
          )}
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={handleViewDetails}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={handleEdit}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Pet
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              {/* <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Pet
              </button> */}
            </div>
          )}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{pet.name}</h3>
      <p className="text-sm text-gray-600 mb-1">{pet.breed}</p>
      <p className="text-xs text-gray-500 mb-3">{pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Owner</p>
        <p className="text-sm font-medium text-gray-900 mb-2">{pet.owner.name}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Pet Type</span>
          <span className="text-sm font-semibold text-indigo-600">{pet.petType.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total Walks</span>
          <span className="text-lg font-bold text-purple-600">0</span>
        </div>
      </div>
    </div>
  )
}
