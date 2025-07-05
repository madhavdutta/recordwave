import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video, 
  Square, 
  Download, 
  FileText, 
  Mic, 
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Monitor
} from 'lucide-react'
import RecordingControls from './components/RecordingControls'
import TranscriptPanel from './components/TranscriptPanel'
import VideoPreview from './components/VideoPreview'
import StatusIndicator from './components/StatusIndicator'
import { useScreenRecorder } from './hooks/useScreenRecorder'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [audioEnabled, setAudioEnabled] = useState(true)
  
  const {
    startRecording,
    stopRecording,
    recordingTime,
    isSupported: isRecordingSupported
  } = useScreenRecorder({
    onRecordingComplete: (videoBlob) => {
      setRecordedVideo(videoBlob)
      setIsRecording(false)
    }
  })

  const {
    startListening,
    stopListening,
    transcript: liveTranscript,
    isListening,
    isSupported: isSpeechSupported
  } = useSpeechRecognition({
    onTranscriptUpdate: (text) => {
      setTranscript(text)
    }
  })

  const handleStartRecording = useCallback(async () => {
    try {
      await startRecording(audioEnabled)
      setIsRecording(true)
      setTranscript('')
      
      if (audioEnabled && isSpeechSupported) {
        startListening()
      }
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('Failed to start recording. Please ensure you grant screen capture permissions.')
    }
  }, [startRecording, audioEnabled, isSpeechSupported, startListening])

  const handleStopRecording = useCallback(() => {
    stopRecording()
    if (isListening) {
      stopListening()
    }
  }, [stopRecording, isListening, stopListening])

  const handleReset = useCallback(() => {
    setRecordedVideo(null)
    setTranscript('')
    setIsRecording(false)
  }, [])

  if (!isRecordingSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-effect rounded-2xl p-8 text-center text-white max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Monitor className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Browser Not Supported</h2>
          <p className="text-white/80">
            Your browser doesn't support screen recording. Please use a modern browser like Chrome, Firefox, or Edge.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">RecordCraft</h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Professional screen recording with automatic transcription. 
            Record your screen and get instant PDF transcripts powered by AI.
          </p>
        </motion.div>

        {/* Status Indicator */}
        <StatusIndicator 
          isRecording={isRecording}
          recordingTime={recordingTime}
          isListening={isListening && audioEnabled}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Recording Controls & Video */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Recording Controls */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Video className="w-5 h-5" />
                Recording Controls
              </h2>
              
              <RecordingControls
                isRecording={isRecording}
                audioEnabled={audioEnabled}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                onToggleAudio={() => setAudioEnabled(!audioEnabled)}
                onReset={handleReset}
                hasRecording={!!recordedVideo}
              />
            </div>

            {/* Video Preview */}
            {recordedVideo && (
              <VideoPreview 
                videoBlob={recordedVideo}
                transcript={transcript}
              />
            )}
          </motion.div>

          {/* Right Panel - Transcript */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TranscriptPanel
              transcript={transcript}
              liveTranscript={liveTranscript}
              isRecording={isRecording}
              isListening={isListening && audioEnabled}
              audioEnabled={audioEnabled}
              isSpeechSupported={isSpeechSupported}
            />
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Monitor,
              title: "High-Quality Recording",
              description: "Record your entire screen or specific applications in crisp quality"
            },
            {
              icon: Mic,
              title: "Live Transcription",
              description: "Real-time speech-to-text conversion while you record"
            },
            {
              icon: FileText,
              title: "PDF Export",
              description: "Generate professional PDF transcripts with timestamps"
            }
          ].map((feature, index) => (
            <div key={index} className="glass-effect rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default App
