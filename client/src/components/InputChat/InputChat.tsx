import { useState } from 'react'
import { SendIcon } from '../../assets/icons/SendIcon'
import { LoadingIcon } from '../../assets/icons/LoadingIcon'
import { AudioButton } from '../AudioButton/AudioButton'
import { motion } from 'framer-motion'
import { HistoryService } from '../../api/HistoryData'
import { useStorage } from '../../hooks/useStorage'
import type { Message } from '../../types/HistoryTypes'

export const InputChat = () => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const historyService = new HistoryService()
  const [messages] = useStorage<Message[]>('chat_history', [])
  const hasHistory = messages.length > 0

  const handleTranscript = (text: string) => {
    setMessage((prev) => (prev + ' ' + text).trim())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || isLoading) {
      return
    }

    setIsLoading(true)
    try {
      await historyService.sendMessage(message.trim())
      setMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert(error instanceof Error ? error.message : 'Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className='sticky bottom-0 w-full bg-blue-950'>
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.5 }} 
        className={`${hasHistory ? 'mx-auto' : " "} w-full lg:w-2/3 my-10 flex justify-between gap-2 border-2 border-blue-900 rounded-xl`}>

          <div className='flex items-center gap-2 w-full'>
              <AudioButton 
                onTranscript={handleTranscript}
                disabled={isLoading}
              />
                
              <input 
                type="text" 
                className='w-full outline-none bg-transparent text-white' 
                placeholder='Ask whatever you want'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
              />
              
          </div>


            <button type='submit'
            className='bg-blue-900 hover:bg-blue-700 transition ease-in-out duration-300 p-4 m-0.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={isLoading || !message.trim()}
            >
              {isLoading ? <LoadingIcon /> : <SendIcon />}
          </button>

      </motion.div>
    </form>
    </>
  )
}
