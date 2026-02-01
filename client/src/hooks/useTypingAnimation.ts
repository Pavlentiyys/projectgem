import { useState, useEffect, useRef } from 'react'

export function useTypingAnimation(
  text: string,
  speed: number = 20,
  enabled: boolean = true
): string {
  const [displayedText, setDisplayedText] = useState(enabled ? '' : text)
  const animatedTextRef = useRef<string>('')

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text)
      animatedTextRef.current = ''
      return
    }

    // Если этот текст уже был анимирован, показываем его сразу
    if (animatedTextRef.current === text) {
      setDisplayedText(text)
      return
    }

    // Сбрасываем текст при первом запуске для нового текста
    setDisplayedText('')
    let currentIndex = 0

    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        animatedTextRef.current = text
      }
    }, speed)

    return () => {
      clearInterval(typingInterval)
    }
  }, [text, speed, enabled])

  return displayedText
}
