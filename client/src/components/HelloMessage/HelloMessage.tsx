import { MessageIcon } from '../../assets/icons/MessageIcon'
import { motion } from 'framer-motion'

export const HelloMessage = () => {
  return (
    <div className='flex flex-col justify-between items-center lg:items-start'>

      <div className='flex flex-col justify-center items-center lg:items-start gap-20'>

          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }} 
            className='p-4 w-fit bg-blue-900 rounded-lg'>
            <MessageIcon />
          </motion.div>

          <div className='flex flex-col justify-center items-center lg:items-start gap-6'>

            <motion.h2 
              initial={{ opacity: 0, y: -50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }} 
              className='text-4xl font-bold text-white'>Hi there!</motion.h2>

            <motion.h1 
              initial={{ opacity: 0, y: -50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.3 }} 
              className='text-5xl font-bold text-white'>What would you like to talk know?</motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: -50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.4 }} 
              className='text-2xl text-gray-400'>Use one of the most common prompts below or type your own.</motion.p>
          </div>

      </div>
    </div>
  )
}
