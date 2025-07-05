import React from 'react'
import { motion } from 'framer-motion'
import { 
  Video, 
  Square, 
  Mic, 
  MicOff,
  RotateCcw,
  Play
} from 'lucide-react'

const RecordingControls = ({
  isRecording,
  audioEnabled,
  onStartRecording,
  onStopRecording,
  onToggleAudio,
  onReset,
  hasRecording
}) => {
  return (
    <div className="space-y-4">
      {/* Audio Toggle */}
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center gap-3">
          {audioEnabled ? (
            <Mic className="w-5 h-5 text-green-400" />
          ) : (
            <MicOff className="w-5 h-5 text-red-400" />
          )}
          <span className="text-white font-medium">
            Audio Recording & Transcription
          </span>
        </div>
        <button
          onClick={onToggleAudio}
          disabled={isRecording}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            audioEnabled ? 'bg-green-500' : 'bg-gray-600'
          } ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              audioEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Main Controls */}
      <div className="flex gap-4">
        {!isRecording ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartRecording}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Video className="w-5 h-5" />
            Start Recording
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStopRecording}
            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl recording-pulse"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </motion.button>
        )}

        {hasRecording && !isRecording && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            New Recording
          </motion.button>
        )}
      </div>

      {/* Recording Tips */}
      {!isRecording && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <h4 className="text-blue-300 font-medium mb-2">💡 Recording Tips</h4>
          <ul className="text-blue-200/80 text-sm space-y-1">
            <li>• Choose the screen or window you want to record</li>
            <li>• Enable audio for automatic transcription</li>
            <li>• Speak clearly for better transcript accuracy</li>
            <li>• Click "Stop Recording" when finished</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default RecordingControls
