import { useEffect, useRef } from 'react'
import Message from '../Message/Message'
import { useStorage } from '../../hooks/useStorage'
import type { Message as MessageType } from '../../types/HistoryTypes'

const HistoryChat = () => {
  const [messages] = useStorage<MessageType[]>('chat_history', [])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animatedMessagesRef = useRef<Set<string>>(new Set())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div ref={containerRef} className='w-full h-full overflow-y-auto pr-2'>
      <div className='flex flex-col gap-2'>
        {messages.length === 0 ? (
          <p className='text-gray-400 text-center'>No messages yet</p>
        ) : (
          messages.map((msg, index) => {
            // Определяем, является ли это новое AI сообщение (последнее в списке и от AI)
            const isLastMessage = index === messages.length - 1
            const isNewAiMessage = isLastMessage && msg.type === 'ai'
            
            // Создаем уникальный ключ для сообщения (индекс + содержимое)
            const messageKey = `${index}-${msg.content}`
            const shouldAnimate = isNewAiMessage && !animatedMessagesRef.current.has(messageKey)
            
            // Отмечаем сообщение как анимированное после первого рендера
            if (shouldAnimate) {
              animatedMessagesRef.current.add(messageKey)
            }
            
            return (
              <Message
                key={messageKey}
                message={msg.content}
                type={msg.type}
                isNew={shouldAnimate}
              />
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default HistoryChat