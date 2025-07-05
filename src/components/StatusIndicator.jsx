import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Circle, 
  Mic,
  Clock
} from 'lucide-react'

const StatusIndicator = ({ isRecording, recordingTime, isListening }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {(isRecording || isListening) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="glass-effect rounded-xl p-4 flex items-center gap-3">
            {isRecording && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex items-center gap-2"
                >
                  <Circle className="w-3 h-3 fill-red-500 text-red-500" />
                  <span className="text-white font-medium">Recording</span>
                </motion.div>
                
                <div className="flex items-center gap-1 text-white/80">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-sm">{formatTime(recordingTime)}</span>
                </div>
              </>
            )}
            
            {isListening && (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2"
              >
                <Mic className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">Transcribing</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StatusIndicator
