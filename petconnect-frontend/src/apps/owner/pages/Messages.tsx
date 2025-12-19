import OwnerLayout from '../layouts/OwnerLayout'
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react'
import { useState } from 'react'

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState('sarah')

  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Chat with your walkers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <ChatItem
                id="sarah"
                name="Sarah Johnson"
                lastMessage="Thanks! See you tomorrow"
                time="2m ago"
                unread={2}
                active={selectedChat === 'sarah'}
                onClick={() => setSelectedChat('sarah')}
              />
              <ChatItem
                id="mike"
                name="Mike Davis"
                lastMessage="Max had a great walk today!"
                time="1h ago"
                unread={0}
                active={selectedChat === 'mike'}
                onClick={() => setSelectedChat('mike')}
              />
              <ChatItem
                id="emma"
                name="Emma Wilson"
                lastMessage="What time works best for you?"
                time="3h ago"
                unread={1}
                active={selectedChat === 'emma'}
                onClick={() => setSelectedChat('emma')}
              />
              <ChatItem
                id="james"
                name="James Brown"
                lastMessage="Perfect, I'll be there at 3 PM"
                time="1d ago"
                unread={0}
                active={selectedChat === 'james'}
                onClick={() => setSelectedChat('james')}
              />
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  S
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <MessageBubble
                message="Hi! I'd like to book a walk for Max tomorrow at 3 PM"
                time="10:30 AM"
                sent={true}
              />
              <MessageBubble
                message="Hello! Sure, I'm available at 3 PM tomorrow. How long would you like the walk to be?"
                time="10:32 AM"
                sent={false}
              />
              <MessageBubble
                message="30 minutes would be perfect. Max loves the park near Westlands"
                time="10:35 AM"
                sent={true}
              />
              <MessageBubble
                message="Great! I know that park well. I'll meet you there at 3 PM. Looking forward to walking Max!"
                time="10:37 AM"
                sent={false}
              />
              <MessageBubble
                message="Thanks! See you tomorrow"
                time="10:40 AM"
                sent={true}
              />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
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
}

function ChatItem({ name, lastMessage, time, unread, active, onClick }: ChatItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        active ? 'bg-purple-50 border-2 border-purple-200' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{name}</h4>
            <span className="text-xs text-gray-500">{time}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
            {unread > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs font-medium">
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
}

function MessageBubble({ message, time, sent }: MessageBubbleProps) {
  return (
    <div className={`flex ${sent ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${sent ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            sent
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-sm">{message}</p>
        </div>
        <p className={`text-xs text-gray-500 mt-1 ${sent ? 'text-right' : 'text-left'}`}>{time}</p>
      </div>
    </div>
  )
}
