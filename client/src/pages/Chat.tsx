import { HelloMessage } from '../components/HelloMessage/HelloMessage'
import HistoryChat from '../components/HistoryChat/HistoryChat'
import { InputChat } from '../components/InputChat/InputChat'
import { useStorage } from '../hooks/useStorage'
import type { Message } from '../types/HistoryTypes'

export const Chat = () => {
  const [messages] = useStorage<Message[]>('chat_history', [])
  const hasHistory = messages.length > 0

  return (
    <div className='mx-auto lg:mx-20 container w-[90%]'>
        <div className={`flex flex-col justify-between w-full ${hasHistory ? 'h-full' : 'h-[60vh]'}`}>
            {hasHistory ? <HistoryChat /> : <HelloMessage />}
            <InputChat />
        </div>
    </div>
  )
}
