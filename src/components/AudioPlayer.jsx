// src/components/AudioPlayer.jsx
import React, { useRef } from 'react';
import { logEvent } from '../utils/logger';

const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);

  const handlePlay = () => {
    logEvent('AUDIO', 'Audio playback started');
  };

  const handlePause = () => {
    logEvent('AUDIO', 'Audio playback paused');
  };

  return (
    <div className="p-4">
      <audio
        ref={audioRef}
        controls
        src={audioUrl}
        onPlay={handlePlay}
        onPause={handlePause}
        className="w-full"
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
