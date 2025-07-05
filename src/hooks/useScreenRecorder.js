import { useState, useRef, useCallback } from 'react'

export const useScreenRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const isSupported = typeof navigator !== 'undefined' && 
    navigator.mediaDevices && 
    navigator.mediaDevices.getDisplayMedia

  const startTimer = useCallback(() => {
    setRecordingTime(0)
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startRecording = useCallback(async (includeAudio = true) => {
    try {
      // Get screen capture
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: includeAudio
      })

      let finalStream = displayStream

      // If audio is requested but not included in display stream, get microphone
      if (includeAudio && !displayStream.getAudioTracks().length) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 44100
            }
          })

          // Combine video and audio streams
          const combinedStream = new MediaStream([
            ...displayStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
          ])
          
          finalStream = combinedStream
        } catch (audioError) {
          console.warn('Could not access microphone:', audioError)
          // Continue with just screen capture
        }
      }

      streamRef.current = finalStream
      chunksRef.current = []

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(finalStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        onRecordingComplete(blob)
        
        // Clean up streams
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
        
        setIsRecording(false)
        stopTimer()
      }

      // Handle stream ending (user stops sharing)
      finalStream.getVideoTracks()[0].addEventListener('ended', () => {
        if (isRecording) {
          stopRecording()
        }
      })

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      startTimer()

    } catch (error) {
      console.error('Error starting recording:', error)
      setIsRecording(false)
      throw error
    }
  }, [onRecordingComplete, isRecording, startTimer, stopTimer])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }, [isRecording])

  return {
    startRecording,
    stopRecording,
    isRecording,
    recordingTime,
    isSupported
  }
}
