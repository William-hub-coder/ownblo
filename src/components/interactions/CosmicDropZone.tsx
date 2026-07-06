"use client";

import { useState, useRef, useCallback, type DragEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";

type CosmicDropZoneProps = {
  onFiles: (files: FileList | File[]) => void;
  children?: ReactNode;
  className?: string;
  accept?: string;
  multiple?: boolean;
  label?: string;
};

/**
 * Drag-and-drop upload zone with cosmic overlay effect.
 */
export function CosmicDropZone({
  onFiles,
  children,
  className = "",
  accept = "image/*",
  multiple = true,
  label = "Drop to upload",
}: CosmicDropZoneProps) {
  const [isOver, setIsOver] = useState(false);
  const counterRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    counterRef.current++;
    if (counterRef.current === 1) setIsOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    counterRef.current--;
    if (counterRef.current === 0) setIsOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    counterRef.current = 0;
    setIsOver(false);
    if (e.dataTransfer.files.length > 0) onFiles(e.dataTransfer.files);
  }, [onFiles]);

  const handleClick = () => inputRef.current?.click();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) onFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={handleDrop}
        className="relative cursor-pointer"
      >
        {children}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleInput}
        />
      </div>

      <AnimatePresence>
        {isOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-32 h-32 rounded-full border-2 border-[var(--cosmic-accent-cyan)] flex items-center justify-center"
                style={{ boxShadow: "0 0 60px rgba(6,182,212,0.4), 0 0 120px rgba(6,182,212,0.2)" }}
              >
                <Upload className="h-12 w-12 text-[var(--cosmic-accent-cyan)]" />
              </div>
              <p className="text-lg font-semibold text-white tracking-wider">{label}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
