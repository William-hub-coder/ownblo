"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  ListMusic,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  audioUrl: string;
  duration: number;
}

const defaultPlaylist: Song[] = [
  {
    id: "1",
    title: "Lo-fi Beats",
    artist: "Chill Study Music",
    audioUrl: "",
    duration: 180,
  },
  {
    id: "2",
    title: "Ambient Dreams",
    artist: "Atmospheric Sounds",
    audioUrl: "",
    duration: 240,
  },
  {
    id: "3",
    title: "Cyber Waves",
    artist: "Synthwave Collective",
    audioUrl: "",
    duration: 200,
  },
];

export function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const currentSong = defaultPlaylist[currentTrack];

  // Hide player if no audio URLs are configured
  if (defaultPlaylist.every((s) => !s.audioUrl)) return null;

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hideTimer.current);
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideTimer.current = setTimeout(() => {
      setIsExpanded(false);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => clearTimeout(hideTimer.current);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) =>
      prev === 0 ? defaultPlaylist.length - 1 : prev - 1
    );
    setIsPlaying(false);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) =>
      prev === defaultPlaylist.length - 1 ? 0 : prev + 1
    );
    setIsPlaying(false);
  };

  useEffect(() => {
    if (audioRef.current && currentSong.audioUrl) {
      audioRef.current.src = currentSong.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrack]);

  // Audio element event handlers
  const onTimeUpdate = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration || currentSong.duration;
      setProgress((audioRef.current.currentTime / dur) * 100);
    }
  };

  const onEnded = () => {
    nextTrack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div
        className={`glass transition-all duration-500 ${
          isExpanded ? "h-20" : "h-10"
        }`}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyber-border">
          <div
            className="h-full bg-gradient-to-r from-cyber-primary to-cyber-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Collapsed View */}
        {!isExpanded && (
          <div className="flex items-center justify-between h-10 px-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={togglePlay}
                className="text-cyber-muted hover:text-cyber-primary transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
              <span className="text-xs text-cyber-muted truncate">
                {currentSong.title} — {currentSong.artist}
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(true)}
              className="text-cyber-muted hover:text-cyber-text transition-colors"
              aria-label="Expand player"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <div className="flex items-center h-20 px-4 gap-4">
            {/* Album art */}
            <div className="relative flex-shrink-0 w-10 h-10 rounded-lg bg-cyber-border overflow-hidden">
              <div
                className={`w-full h-full bg-gradient-to-br from-cyber-primary to-cyber-accent ${
                  isPlaying ? "animate-spin-slow" : ""
                }`}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="text-xs text-cyber-text font-medium truncate">
                  {currentSong.title}
                </span>
                <span className="text-xs text-cyber-muted hidden sm:inline">
                  {currentSong.artist}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-cyber-muted">
                  {formatTime(0)}
                </span>
                <div className="flex-1 h-1 rounded-full bg-cyber-border">
                  <div
                    className="h-full rounded-full bg-cyber-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-cyber-muted">
                  {formatTime(currentSong.duration)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevTrack}
                className="p-1.5 text-cyber-muted hover:text-cyber-text transition-colors"
                aria-label="Previous track"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={togglePlay}
                className="p-1.5 text-cyber-primary hover:text-cyber-text transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="p-1.5 text-cyber-muted hover:text-cyber-text transition-colors"
                aria-label="Next track"
              >
                <SkipForward className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 text-cyber-muted hover:text-cyber-text transition-colors ml-2"
                aria-label="Collapse player"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
