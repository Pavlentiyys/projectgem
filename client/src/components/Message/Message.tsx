import React from 'react'
import { useTypingAnimation } from '../../hooks/useTypingAnimation'
import { motion } from 'framer-motion'

interface MessageProps {
  message: string
  type: 'user' | 'ai'
  isNew?: boolean
}

const Message: React.FC<MessageProps> = ({ message, type, isNew = false }) => {
  const isUser = type === 'user'
  const animatedText = useTypingAnimation(
    message,
    5,
    !isUser && isNew 
  )
  const displayText = !isUser && isNew ? animatedText : message
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: 0.5 }} 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full mb-4`}>
      <div
        className={`max-w-[70%] lg:max-w-[50%] px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-blue-900 text-white'
            : 'bg-gray-700 text-white'
        }`}
      >
        <p className="text-sm lg:text-base break-words">
          {displayText}
          {!isUser && isNew && animatedText.length < message.length && (
            <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse" />
          )}
        </p>
      </div>
    </motion.div>
  )
}

export default Message