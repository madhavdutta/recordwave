import { useState, useRef, useCallback, useEffect } from 'react'

export const useSpeechRecognition = ({ onTranscriptUpdate }) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef('')

  const isSupported = typeof window !== 'undefined' && 
    (window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = finalTranscriptRef.current

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      finalTranscriptRef.current = finalTranscript
      const fullTranscript = finalTranscript + interimTranscript
      
      setTranscript(fullTranscript)
      onTranscriptUpdate(finalTranscript)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access for transcription.')
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isSupported, onTranscriptUpdate])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      finalTranscriptRef.current = ''
      setTranscript('')
      recognitionRef.current.start()
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = ''
    setTranscript('')
    onTranscriptUpdate('')
  }, [onTranscriptUpdate])

  return {
    startListening,
    stopListening,
    resetTranscript,
    transcript,
    isListening,
    isSupported
  }
}
