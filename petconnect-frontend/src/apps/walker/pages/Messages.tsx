import WalkerLayout from '../layouts/WalkerLayout'
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react'
import { useState } from 'react'

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState('john')

  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Chat with pet owners</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <ChatItem
                id="john"
                name="John Doe"
                lastMessage="Thanks! See you at 3 PM"
                time="2m ago"
                unread={1}
                active={selectedChat === 'john'}
                onClick={() => setSelectedChat('john')}
              />
              <ChatItem
                id="emma"
                name="Emma Wilson"
                lastMessage="Bella had a great walk!"
                time="1h ago"
                unread={0}
                active={selectedChat === 'emma'}
                onClick={() => setSelectedChat('emma')}
              />
              <ChatItem
                id="mike"
                name="Mike Davis"
                lastMessage="Can you walk Charlie tomorrow?"
                time="3h ago"
                unread={2}
                active={selectedChat === 'mike'}
                onClick={() => setSelectedChat('mike')}
              />
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                  J
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">John Doe</h3>
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
                message="Hi Sarah! I'd like to book a walk for Max tomorrow at 3 PM"
                time="10:30 AM"
                sent={false}
              />
              <MessageBubble
                message="Hello John! Sure, I'm available at 3 PM tomorrow. 30 minutes walk?"
                time="10:32 AM"
                sent={true}
              />
              <MessageBubble
                message="Yes, 30 minutes would be perfect. The usual route in Westlands?"
                time="10:35 AM"
                sent={false}
              />
              <MessageBubble
                message="Perfect! I'll meet you there at 3 PM. Looking forward to walking Max!"
                time="10:37 AM"
                sent={true}
              />
              <MessageBubble
                message="Thanks! See you at 3 PM"
                time="10:40 AM"
                sent={false}
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button className="p-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WalkerLayout>
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
        active ? 'bg-teal-50 border-2 border-teal-200' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
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
              <span className="ml-2 px-2 py-0.5 bg-teal-600 text-white rounded-full text-xs font-medium">
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
              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
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
