import OwnerLayout from '../layouts/OwnerLayout'
import { Search, Send, Paperclip, MoreVertical, Loader, Check, CheckCheck, Smile, FileText, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../../lib/api'
import { useSocket } from '../../../contexts/SocketContext'
import { useAuth } from '../../../context/AuthContext'

interface User {
  _id: string
  name: string
  email: string
  profilePicture?: string
}

interface Attachment {
  type: 'image' | 'document'
  url: string
  filename: string
  size: number
  mimeType: string
}

interface Message {
  _id: string
  sender: User
  receiver: User
  content: string
  attachments?: Attachment[]
  isRead: boolean
  readAt?: string
  createdAt: string
}

interface Conversation {
  conversationId: string
  otherUser: User
  lastMessage: {
    content: string
    createdAt: string
    isRead: boolean
  }
  unreadCount: number
}

export default function Messages() {
  const [searchParams] = useSearchParams()
  const chatParam = searchParams.get('chat')
  const { socket, isConnected } = useSocket()
  const { user } = useAuth()
  const currentUserId = user?.id || null
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newChatUser, setNewChatUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  // Socket.io event listeners
  useEffect(() => {
    if (!socket || !isConnected) return

    // Listen for new messages
    socket.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, message])
      fetchConversations() // Update conversation list
      scrollToBottom()
    })

    // Listen for typing indicators
    socket.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== currentUserId) {
        setIsTyping(data.isTyping)
      }
    })

    // Listen for read receipts
    socket.on('messages_marked_read', (data: { messageIds: string[] }) => {
      setMessages(prev =>
        prev.map(msg =>
          data.messageIds.includes(msg._id)
            ? { ...msg, isRead: true, readAt: new Date().toISOString() }
            : msg
        )
      )
    })

    return () => {
      socket.off('new_message')
      socket.off('user_typing')
      socket.off('messages_marked_read')
    }
  }, [socket, isConnected])

  // Join/leave conversation rooms
  useEffect(() => {
    if (!socket || !selectedChat || !currentUserId) return

    const conversationId = generateConversationId(currentUserId, selectedChat)
    socket.emit('join_conversation', conversationId)

    return () => {
      socket.emit('leave_conversation', conversationId)
    }
  }, [socket, selectedChat, currentUserId])

  // Auto-select conversation from URL
  useEffect(() => {
    if (chatParam) {
      setSelectedChat(chatParam)
      const existingConv = conversations.find(c => c.otherUser._id === chatParam)
      if (!existingConv) {
        fetchUserDetails(chatParam)
      }
    }
  }, [chatParam, conversations])

  // Fetch messages when conversation selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat)
    }
  }, [selectedChat])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateConversationId = (userId1: string, userId2: string) => {
    const ids = [userId1, userId2].sort()
    return `${ids[0]}_${ids[1]}`
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    try {
      setLoading(true)
      console.log('📋 Fetching conversations...')
      const response = await api.get('/messages/conversations')
      
      console.log('📦 Conversations response:', response.data)
      
      if (response.data.success) {
        console.log('✅ Setting conversations:', response.data.data.conversations)
        setConversations(response.data.data.conversations)
        
        if (!selectedChat && !chatParam && response.data.data.conversations.length > 0) {
          setSelectedChat(response.data.data.conversations[0].otherUser._id)
        }
      }
    } catch (err: any) {
      console.error('❌ Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}`)
      if (response.data.success) {
        setNewChatUser(response.data.data.user)
      }
    } catch (err: any) {
      console.error('Error fetching user details:', err)
    }
  }

  const fetchMessages = async (otherUserId: string) => {
    try {
      console.log('🔍 Fetching messages for user:', otherUserId)
      const response = await api.get(`/messages/${otherUserId}`)
      
      console.log('📨 Messages response:', response.data)
      
      if (response.data.success) {
        console.log('✅ Setting messages:', response.data.data.messages)
        setMessages(response.data.data.messages)
        
        // Mark messages as read
        const unreadIds = response.data.data.messages
          .filter((m: Message) => !m.isRead && m.receiver._id === currentUserId)
          .map((m: Message) => m._id)
        
        if (unreadIds.length > 0 && socket && currentUserId) {
          const conversationId = generateConversationId(currentUserId, otherUserId)
          socket.emit('messages_read', { conversationId, messageIds: unreadIds })
        }
      }
    } catch (err: any) {
      console.error('❌ Error fetching messages:', err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if ((!messageInput.trim() && selectedFiles.length === 0) || !selectedChat || sending) return

    try {
      setSending(true)
      
      const formData = new FormData()
      formData.append('receiverId', selectedChat)
      if (messageInput.trim()) {
        formData.append('content', messageInput.trim())
      }
      
      // Append all selected files
      selectedFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await api.post('/messages/send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        const newMessage = response.data.data.message
        setMessageInput('')
        setSelectedFiles([])
        setMessages([...messages, newMessage])
        
        // Emit via Socket.io
        if (socket && currentUserId) {
          const conversationId = generateConversationId(currentUserId, selectedChat)
          socket.emit('send_message', { conversationId, message: newMessage })
        }
        
        fetchConversations()
        inputRef.current?.focus()
      }
    } catch (err: any) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file sizes (10MB each)
    const oversized = files.filter(f => f.size > 10 * 1024 * 1024)
    if (oversized.length > 0) {
      alert(`Some files exceed 10MB limit: ${oversized.map(f => f.name).join(', ')}`)
      return
    }

    // Limit to 5 files total
    const newFiles = [...selectedFiles, ...files].slice(0, 5)
    setSelectedFiles(newFiles)
    
    // Reset input
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value)
    
    // Emit typing indicator
    if (socket && selectedChat && currentUserId && user) {
      const conversationId = generateConversationId(currentUserId, selectedChat)
      
      socket.emit('typing_start', { conversationId, userName: user.name })
      
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
      
      // Set new timeout to stop typing
      const timeout = setTimeout(() => {
        socket.emit('typing_stop', { conversationId })
      }, 2000)
      
      setTypingTimeout(timeout)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }
  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  console.log('Conversations filtered:', filteredConversations)

  const selectedConversation = conversations.find(c => c.otherUser._id === selectedChat)
  const chatUser = selectedConversation?.otherUser || newChatUser
  const canShowChat = selectedChat && chatUser

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading messages...</span>
        </div>
      </OwnerLayout>
    )
  }

  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Chat with your walkers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chat List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start a walk to chat with walkers</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <ChatItem
                    key={conv.otherUser._id}
                    id={conv.otherUser._id}
                    name={conv.otherUser.name}
                    lastMessage={conv.lastMessage.content}
                    time={formatTime(conv.lastMessage.createdAt)}
                    unread={conv.unreadCount}
                    active={selectedChat === conv.otherUser._id}
                    onClick={() => setSelectedChat(conv.otherUser._id)}
                    profilePicture={conv.otherUser.profilePicture}
                  />
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden" style={{ height: '680px' }}>
            {canShowChat ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-3">
                    {chatUser.profilePicture ? (
                      <img
                        src={`http://localhost:5000/${chatUser.profilePicture}`}
                        alt={chatUser.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-100"
                      />
                    ) : (
                      <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {chatUser.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{chatUser.name}</h3>
                      <p className="text-xs text-gray-500">
                        {isConnected ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23f3f4f6\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                  {(() => {
                    console.log('🎨 Rendering messages area. Messages count:', messages.length)
                    console.log('📋 Messages data:', messages)
                    return null
                  })()}
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Send className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="text-gray-500 font-medium">No messages yet</p>
                      <p className="text-sm text-gray-400 mt-1">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => {
                        console.log(`🔷 Rendering message ${index}:`, message)
                        console.log(`   Sender ID: ${message.sender._id}, Current User: ${currentUserId}`)
                        console.log(`   Is sent by me: ${message.sender._id === currentUserId}`)
                        return (
                          <MessageBubble
                            key={message._id}
                            message={message.content}
                            time={formatMessageTime(message.createdAt)}
                            sent={message.sender._id === currentUserId}
                            isRead={message.isRead}
                            attachments={message.attachments}
                            showAvatar={
                              index === 0 ||
                              messages[index - 1].sender._id !== message.sender._id
                            }
                            senderName={message.sender.name}
                          />
                        )
                      })}
                      {isTyping && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* File Preview Area */}
                {selectedFiles.length > 0 && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex gap-2 overflow-x-auto">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border-2 border-gray-200">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <FileText className="w-8 h-8 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-600 mt-1 w-20 truncate text-center">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="px-6 py-4 bg-white border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <button type="button" className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>
                    <label className="cursor-pointer p-2.5 hover:bg-gray-100 rounded-full transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={handleInputChange}
                      disabled={sending}
                      className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-full focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={(!messageInput.trim() && selectedFiles.length === 0) || sending}
                      className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-purple-600" />
                  </div>
                  <p className="text-gray-500 font-medium">Select a conversation</p>
                  <p className="text-sm text-gray-400 mt-1">Choose a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </OwnerLayout>
  )
}

interface ChatItemProps {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: number
  active: boolean
  onClick: () => void
  profilePicture?: string
}

function ChatItem({ name, lastMessage, time, unread, active, onClick, profilePicture }: ChatItemProps) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 cursor-pointer transition-all border-l-4 ${
        active 
          ? 'bg-purple-50 border-purple-600' 
          : 'hover:bg-gray-50 border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        {profilePicture ? (
          <img
            src={`http://localhost:5000/${profilePicture}`}
            alt={name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{name}</h4>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{time}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate pr-2">{lastMessage}</p>
            {unread > 0 && (
              <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-purple-600 text-white rounded-full text-xs font-medium flex items-center justify-center">
                {unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MessageBubbleProps {
  message: string
  time: string
  sent: boolean
  isRead?: boolean
  showAvatar?: boolean
  senderName?: string
  attachments?: Attachment[]
}

function MessageBubble({ message, time, sent, isRead, attachments }: MessageBubbleProps) {
  console.log('💬 MessageBubble rendering:', { message, time, sent, isRead, attachments })
  return (
    <div className={`flex ${sent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%]`}>
        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="mb-2 space-y-2">
            {attachments.map((att, idx) => (
              <div key={idx}>
                {att.type === 'image' ? (
                  <img
                    src={`http://localhost:5000/${att.url}`}
                    alt={att.filename}
                    className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-md"
                    onClick={() => window.open(`http://localhost:5000/${att.url}`, '_blank')}
                  />
                ) : (
                  <a
                    href={`http://localhost:5000/${att.url}`}
                    download={att.filename}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      sent
                        ? 'bg-purple-500 border-purple-600 text-white hover:bg-purple-600'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{att.filename}</p>
                      <p className={`text-xs ${sent ? 'text-purple-100' : 'text-gray-500'}`}>
                        {(att.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Message text */}
        {message && (
          <div
            className={`px-4 py-3 rounded-2xl border-2 ${
              sent
                ? 'bg-purple-600 text-white border-purple-700 rounded-br-none'
                : 'bg-gray-100 text-gray-900 border-gray-200 rounded-bl-none'
            }`}
          >
            <p className="text-sm leading-relaxed break-words">{message}</p>
          </div>
        )}
        
        <div className={`flex items-center gap-1 mt-1 px-1 ${sent ? 'justify-end' : 'justify-start'}`}>
          <p className="text-xs text-gray-500">{time}</p>
          {sent && (
            <span className="text-gray-500">
              {isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

