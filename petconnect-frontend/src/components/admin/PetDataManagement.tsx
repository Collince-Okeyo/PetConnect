import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Power, PowerOff, Loader, X } from 'lucide-react'
import { api } from '../../lib/api'
import type { PetType, Temperament } from '../../types/petData'

interface PetDataManagementProps {
  onClose: () => void
}

export default function PetDataManagement({ onClose }: PetDataManagementProps) {
  const [activeTab, setActiveTab] = useState<'types' | 'temperaments'>('types')
  const [petTypes, setPetTypes] = useState<PetType[]>([])
  const [temperaments, setTemperaments] = useState<Temperament[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PetType | Temperament | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'types') {
        const res = await api.get('/pet-types')
        if (res.data.success) {
          setPetTypes(res.data.data.petTypes)
        }
      } else {
        const res = await api.get('/temperaments')
        if (res.data.success) {
          setTemperaments(res.data.data.temperaments)
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const endpoint = activeTab === 'types' ? '/pet-types' : '/temperaments'
      await api.patch(`${endpoint}/${id}/toggle`)
      fetchData()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const endpoint = activeTab === 'types' ? '/pet-types' : '/temperaments'
      await api.delete(`${endpoint}/${id}`)
      fetchData()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete item')
    }
  }

  const currentData = activeTab === 'types' ? petTypes : temperaments

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Pet Data Management</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('types')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'types'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pet Types ({petTypes.length})
            </button>
            <button
              onClick={() => setActiveTab('temperaments')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'temperaments'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Temperaments ({temperaments.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Add Button */}
          <div className="mb-4">
            <button
              onClick={() => {
                setEditingItem(null)
                setShowAddModal(true)
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add {activeTab === 'types' ? 'Pet Type' : 'Temperament'}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentData.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-2xl">{item.icon}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.description || '-'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(item)
                              setShowAddModal(true)
                            }}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item._id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title={item.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {item.isActive ? (
                              <PowerOff className="w-4 h-4" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddEditModal
          type={activeTab}
          item={editingItem}
          onClose={() => {
            setShowAddModal(false)
            setEditingItem(null)
          }}
          onSuccess={() => {
            setShowAddModal(false)
            setEditingItem(null)
            fetchData()
          }}
        />
      )}
    </div>
  )
}

interface AddEditModalProps {
  type: 'types' | 'temperaments'
  item: PetType | Temperament | null
  onClose: () => void
  onSuccess: () => void
}

function AddEditModal({ type, item, onClose, onSuccess }: AddEditModalProps) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    icon: item?.icon || (type === 'types' ? '🐾' : '😊')
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const endpoint = type === 'types' ? '/pet-types' : '/temperaments'

      if (item) {
        // Update
        await api.put(`${endpoint}/${item._id}`, formData)
      } else {
        // Create
        await api.post(endpoint, formData)
      }

      onSuccess()
    } catch (err: any) {
      console.error('Error saving:', err)
      setError(err.response?.data?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-xl font-bold text-white">
            {item ? 'Edit' : 'Add'} {type === 'types' ? 'Pet Type' : 'Temperament'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
              maxLength={50}
              placeholder="e.g., Hamster"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon (Emoji)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-2xl"
              placeholder="🐹"
              maxLength={2}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              rows={3}
              maxLength={200}
              placeholder="Brief description..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/200 characters
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                item ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
