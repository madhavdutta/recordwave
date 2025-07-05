import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Mic, 
  MicOff,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { generatePDF } from '../utils/pdfGenerator'

const TranscriptPanel = ({
  transcript,
  liveTranscript,
  isRecording,
  isListening,
  audioEnabled,
  isSpeechSupported
}) => {
  const handleDownloadPDF = () => {
    if (!transcript.trim()) {
      alert('No transcript available to download.')
      return
    }
    
    generatePDF(transcript)
  }

  const displayTranscript = transcript || liveTranscript

  return (
    <div className="glass-effect rounded-2xl p-6 h-full min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Live Transcript
        </h2>
        
        {displayTranscript && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </motion.button>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mb-4">
        {!audioEnabled ? (
          <div className="flex items-center gap-2 text-gray-400 bg-gray-500/10 rounded-lg p-3">
            <MicOff className="w-4 h-4" />
            <span className="text-sm">Audio recording disabled</span>
          </div>
        ) : !isSpeechSupported ? (
          <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 rounded-lg p-3">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Speech recognition not supported in this browser</span>
          </div>
        ) : isListening ? (
          <motion.div 
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-green-400 bg-green-500/10 rounded-lg p-3"
          >
            <Mic className="w-4 h-4" />
            <span className="text-sm">Listening and transcribing...</span>
            <div className="flex gap-1 ml-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 4] }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                  className="w-1 bg-green-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 text-blue-400 bg-blue-500/10 rounded-lg p-3">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Ready to transcribe when recording starts</span>
          </div>
        )}
      </div>

      {/* Transcript Content */}
      <div className="flex-1 bg-white/5 rounded-xl p-4 overflow-y-auto">
        <AnimatePresence>
          {displayTranscript ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {displayTranscript.split('\n').map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-white/90 leading-relaxed"
                >
                  {line}
                </motion.p>
              ))}
              
              {isListening && liveTranscript && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-blue-300 italic"
                >
                  {liveTranscript}...
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-white/50" />
              </div>
              <h3 className="text-white/70 font-medium mb-2">No transcript yet</h3>
              <p className="text-white/50 text-sm max-w-xs">
                {audioEnabled 
                  ? "Start recording with audio enabled to see live transcription here"
                  : "Enable audio recording to generate transcripts"
                }
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Transcript Stats */}
      {displayTranscript && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm text-white/60">
            <span>Words: {displayTranscript.split(' ').filter(word => word.length > 0).length}</span>
            <span>Characters: {displayTranscript.length}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TranscriptPanel
