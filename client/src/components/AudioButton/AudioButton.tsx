import React, { useState, useRef, useEffect } from 'react'
import { AudioIcon } from '../../assets/icons/AudioIcon'

// Типы для SpeechRecognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition
    }
    webkitSpeechRecognition: {
      new (): SpeechRecognition
    }
  }
}

interface AudioButtonProps {
  onTranscript: (text: string) => void
  disabled?: boolean
  lang?: string
}

export const AudioButton: React.FC<AudioButtonProps> = ({ 
  onTranscript, 
  disabled = false,
  lang = 'ru-RU'
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Инициализация Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = lang

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' '
            }
          }

          if (finalTranscript) {
            onTranscript(finalTranscript.trim())
          }
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'no-speech') {
            // Игнорируем ошибку "no-speech"
            return
          }
          setIsRecording(false)
          alert(`Ошибка распознавания речи: ${event.message}`)
        }

        recognition.onend = () => {
          setIsRecording(false)
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current.abort()
      }
    }
  }, [onTranscript, lang])

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Распознавание речи не поддерживается в вашем браузере')
      return
    }

    if (isRecording) {
      // Останавливаем запись
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      // Начинаем запись
      try {
        recognitionRef.current.start()
        setIsRecording(true)
      } catch (error) {
        console.error('Error starting recognition:', error)
        setIsRecording(false)
      }
    }
  }

  return (
    <button 
      type='button' 
      className={`pl-4 transition-all duration-300 ${
        isRecording 
          ? 'text-red-500 animate-pulse' 
          : 'text-blue-900 hover:text-blue-700'
      }`}
      onClick={handleToggleRecording}
      disabled={disabled}
      title={isRecording ? 'Остановить запись' : 'Начать запись голоса'}
    >
      <AudioIcon />
    </button>
  )
}
