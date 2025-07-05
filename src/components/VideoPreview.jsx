import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Download, 
  Volume2,
  VolumeX,
  Maximize
} from 'lucide-react'

const VideoPreview = ({ videoBlob, transcript }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (videoRef.current && videoBlob) {
      const videoUrl = URL.createObjectURL(videoBlob)
      videoRef.current.src = videoUrl
      
      return () => {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoBlob])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = pos * duration
    }
  }

  const handleDownload = () => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `screen-recording-${new Date().toISOString().slice(0, 19)}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Play className="w-5 h-5" />
          Recording Preview
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Download className="w-4 h-4" />
          Download Video
        </motion.button>
      </div>

      <div className="relative bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-auto max-h-96"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          muted={isMuted}
        />
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-white/20 rounded-full mb-3 cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-150"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>
              
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
              
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <Maximize className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Recording Info */}
      <div className="mt-4 p-4 bg-white/5 rounded-xl">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/60">Duration:</span>
            <span className="text-white ml-2">{formatTime(duration)}</span>
          </div>
          <div>
            <span className="text-white/60">Size:</span>
            <span className="text-white ml-2">
              {videoBlob ? `${(videoBlob.size / 1024 / 1024).toFixed(1)} MB` : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-white/60">Format:</span>
            <span className="text-white ml-2">WebM</span>
          </div>
          <div>
            <span className="text-white/60">Transcript:</span>
            <span className="text-white ml-2">
              {transcript ? 'Available' : 'Not available'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VideoPreview
