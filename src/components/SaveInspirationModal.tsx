import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  Loader2, 
  Link2, 
  Sparkles, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Upload, 
  FileUp, 
  HelpCircle, 
  Check, 
  ShieldCheck, 
  ChevronRight, 
  Globe, 
  Volume2, 
  AlertCircle, 
  Plus, 
  FolderPlus,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Collection, Platform } from '../types';
import { detectPlatform, getPlatformConfig } from '../utils/platform';

interface SaveInspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  onSave: (
    title: string,
    whySaved: string,
    url: string,
    platform: Platform,
    collectionId: string,
    voiceNote?: string,
    voiceTranscript?: string,
    voiceDuration?: number
  ) => Promise<void>;
  onTriggerCreateCollection: () => void;
}

export default function SaveInspirationModal({
  isOpen,
  onClose,
  collections,
  onSave,
  onTriggerCreateCollection,
}: SaveInspirationModalProps) {
  const [whySaved, setWhySaved] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<Platform>('website');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  // Audio recording states
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const durationIntervalRef = useRef<any>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Screenshot Upload States
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // AI tag suggestions to inspire the user
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const waveBars = Array.from({ length: 18 });

  // Check Speech Recognition support on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Stop recording when modal closes or unmounts
  useEffect(() => {
    if (!isOpen && isRecording && recognition) {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
      setIsRecording(false);
    }
  }, [isOpen, isRecording, recognition]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [recognition]);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsRecording(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setWhySaved((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript}` : transcript;
          });
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      try {
        rec.start();
        setRecognition(rec);
      } catch (e) {
        console.error("Failed to start speech recognition", e);
        setIsRecording(false);
      }
    }
  };

  // Audio Recording Handlers
  const startAudioRecording = async () => {
    try {
      setAudioPreviewUrl(null);
      setVoiceNote(null);
      setAudioDuration(0);
      setIsPlayingPreview(false);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Choose supported MIME type
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/ogg';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = ''; // Let browser choose default
      }

      const mediaRecorder = mimeType 
        ? new MediaRecorder(stream, { mimeType }) 
        : new MediaRecorder(stream);
        
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const previewUrl = URL.createObjectURL(audioBlob);
        setAudioPreviewUrl(previewUrl);

        // Convert Blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          setVoiceNote(base64Data);

          // Convert audio to text using Gemini Speech-to-Text
          setIsTranscribing(true);
          try {
            const res = await fetch("/api/ai/transcribe", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ base64Audio: base64Data }),
            });
            if (!res.ok) throw new Error("Failed to transcribe audio");
            const data = await res.json();
            if (data.transcript) {
              setVoiceTranscript(data.transcript);
              setWhySaved((prev) => {
                const trimmed = prev.trim();
                return trimmed ? `${trimmed} ${data.transcript}` : data.transcript;
              });
            }
          } catch (err) {
            console.error("Transcription error:", err);
          } finally {
            setIsTranscribing(false);
          }
        };

        // Stop all tracks to release the mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);

      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setAudioDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting audio recording:', err);
      setError('Could not access microphone. Please ensure microphone permissions are granted.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error('Error stopping recorder', e);
      }
      setIsRecordingAudio(false);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  };

  const deleteAudioRecording = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    setAudioPreviewUrl(null);
    setVoiceNote(null);
    setAudioDuration(0);
    setIsPlayingPreview(false);
    setVoiceTranscript('');
  };

  const togglePlayPreview = () => {
    if (!audioPreviewUrl) return;

    if (!previewAudioRef.current) {
      const audio = new Audio(audioPreviewUrl);
      audio.onended = () => {
        setIsPlayingPreview(false);
      };
      previewAudioRef.current = audio;
    }

    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play()
        .then(() => setIsPlayingPreview(true))
        .catch(err => {
          console.error("Failed to play preview audio", err);
          setIsPlayingPreview(false);
        });
    }
  };

  // Drag and Drop handlers for simulated Upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, JPEG, WEBP) as reference.');
      return;
    }
    setError('');
    setFileName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setFileSize(`${sizeInMB} MB`);
    setIsUploading(true);
    setUploadProgress(0);

    // Progressive simulated quick upload animation
    let currentPrg = 0;
    const interval = setInterval(() => {
      currentPrg += Math.floor(Math.random() * 20) + 15;
      if (currentPrg >= 100) {
        currentPrg = 100;
        clearInterval(interval);
        const reader = new FileReader();
        reader.onloadend = () => {
          setScreenshot(reader.result as string);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }
      setUploadProgress(currentPrg);
    }, 60);
  };

  const deleteUploadedFile = () => {
    setScreenshot(null);
    setFileName(null);
    setFileSize(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setWhySaved('');
      setUrl('');
      setTitle('');
      setError('');
      setIsSuccess(false);
      setAudioPreviewUrl(null);
      setVoiceNote(null);
      setAudioDuration(0);
      setIsPlayingPreview(false);
      setIsRecordingAudio(false);
      setScreenshot(null);
      setFileName(null);
      setFileSize(null);
      setUploadProgress(0);
      setIsUploading(false);
      
      // Default to "Random Ideas" collection
      const randomIdeasColl = collections.find(c => c.name.toLowerCase() === 'random ideas' || c.name.toLowerCase() === 'ideas');
      if (randomIdeasColl) {
        setSelectedCollectionId(randomIdeasColl.id);
      } else if (collections.length > 0) {
        setSelectedCollectionId(collections[0].id);
      }

      // Populate random prompt suggestions
      const prompts = ['Hooks', 'Aesthetic Spacing', 'B-Roll Angle', 'Copywriting', 'Interactive Widget'];
      setSuggestedTags(prompts);
    } else {
      // Clean up when modal closes
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) { /* ignore */ }
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    }
  }, [isOpen, collections]);

  // Handle URL changes to auto-detect platform and suggest title
  useEffect(() => {
    if (!url) {
      setDetectedPlatform('website');
      // Default to "Random Ideas" collection if there is no URL
      const randomIdeasColl = collections.find(c => c.name.toLowerCase() === 'random ideas' || c.name.toLowerCase() === 'ideas');
      if (randomIdeasColl) {
        setSelectedCollectionId(randomIdeasColl.id);
      }
      return;
    }

    const platform = detectPlatform(url);
    setDetectedPlatform(platform);

    // Auto-select collection based on URL
    const cleanUrl = url.toLowerCase().trim();
    let targetCollectionName = 'Random Ideas';
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
      targetCollectionName = 'YouTube';
    } else if (cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')) {
      targetCollectionName = 'Instagram';
    } else if (cleanUrl.includes('pinterest.com') || cleanUrl.includes('pin.it')) {
      targetCollectionName = 'Pinterest';
    }

    const matchedColl = collections.find(c => {
      const nameLower = c.name.toLowerCase();
      if (targetCollectionName === 'Random Ideas') {
        return nameLower === 'random ideas' || nameLower === 'ideas';
      }
      return nameLower === targetCollectionName.toLowerCase();
    });

    if (matchedColl) {
      setSelectedCollectionId(matchedColl.id);
    }
  }, [url, collections]);

  // Character counter for textarea
  const charCount = whySaved.length;
  const isOptimalLength = charCount > 15;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!whySaved.trim()) {
      setError('Please capture why this inspired you—this is the core value!');
      return;
    }

    setError('');
    setIsSubmitting(true);

    let finalTitle = title.trim();
    if (!finalTitle) {
      try {
        const response = await fetch("/api/ai/generate-title", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: whySaved.trim(),
            voiceTranscript: voiceTranscript || undefined,
            url: url.trim(),
            platform: detectedPlatform,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.title && data.title !== 'FALLBACK' && data.title.toLowerCase() !== 'fallback') {
            finalTitle = data.title;
          }
        }
      } catch (err) {
        console.error("Failed to generate title using AI:", err);
      }

      // If AI generation failed, returned "FALLBACK", or BOTH description and transcript are empty
      if (!finalTitle) {
        const content = (whySaved.trim() || voiceTranscript || '').trim();
        if (content) {
          // Take first 5 words
          const words = content.split(/\s+/).filter(Boolean);
          if (words.length > 0) {
            finalTitle = words.slice(0, 5).join(' ');
            if (words.length > 5) {
              finalTitle += '...';
            }
          }
        }
      }

      // Absolute fallback if everything else is empty
      if (!finalTitle) {
        const config = getPlatformConfig(detectedPlatform);
        try {
          const domain = new URL(url).hostname.replace('www.', '');
          finalTitle = `${config.label} Clip from ${domain}`;
        } catch (e) {
          finalTitle = `Saved ${config.label} Clip`;
        }
      }
    }

    // Append screenshot annotation if uploaded
    let finalWhySaved = whySaved.trim();
    if (screenshot && fileName) {
      finalWhySaved = `${finalWhySaved}\n\n[Reference Image Attached: ${fileName} (${fileSize})]`;
    }

    try {
      await onSave(
        finalTitle,
        finalWhySaved,
        url.trim(),
        detectedPlatform,
        selectedCollectionId,
        voiceNote || undefined,
        voiceTranscript || undefined,
        audioDuration || undefined
      );

      // Trigger beautiful vault closing success sequence before closing
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1600);
    } catch (err) {
      console.error(err);
      setError('Failed to save inspiration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__CREATE_NEW__') {
      // Trigger new collection modal
      onTriggerCreateCollection();
      return;
    }
    setSelectedCollectionId(val);
  };

  const appendSuggestion = (tag: string) => {
    setWhySaved((prev) => {
      const trimmed = prev.trim();
      const sentence = `Aesthetic focuses on: #${tag}.`;
      return trimmed ? `${trimmed} ${sentence}` : sentence;
    });
  };

  if (!isOpen) return null;

  const currentPlatformConfig = getPlatformConfig(detectedPlatform);
  const PlatformIcon = currentPlatformConfig.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isSubmitting && !isSuccess ? onClose : undefined}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
          id="save-idea-backdrop"
        />

        {/* Modal content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-[80%] max-h-[90vh] overflow-y-auto rounded-3xl bg-[#09090A] border border-white/[0.08] p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] scrollbar-thin scrollbar-thumb-zinc-800"
          id="save-idea-modal-container"
        >
          {/* Neon Top Decorative Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500 opacity-80" />

          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isSubmitting || isSuccess}
            className="absolute top-5 right-5 rounded-xl p-2 text-white/30 hover:bg-white/5 hover:text-white transition-all duration-200 disabled:opacity-0 cursor-pointer"
            id="close-modal-btn"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              /* EPIC SUCCESS ANIMATION PANEL */
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-12 text-center"
                id="vault-success-screen"
              >
                {/* Rotating Vault Dial */}
                <div className="relative mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-2 border-dashed border-violet-500/40 p-2 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.1, 1] }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                    >
                      <ShieldCheck className="h-8 w-8 stroke-[2]" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Outer Orbit Particles */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-32 w-32 rounded-full border border-violet-500/10 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                </div>

                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold tracking-tight text-[#EDEDED] font-sans"
                >
                  Inspiration Secured!
                </motion.h4>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 text-xs text-white/60 font-mono tracking-wider uppercase"
                >
                  Locked Safely in Your IdeaVault 🔒
                </motion.p>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "120px" }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent mt-4 mb-2"
                />

                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-[10px] text-white/40 font-mono"
                >
                  AI CO-PILOT INITIALIZING INDEX...
                </motion.span>
              </motion.div>
            ) : (
              /* THE FORM CARD */
              <motion.div
                key="form-card"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6" id="save-idea-header">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 shadow-inner">
                    <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-[#EDEDED]">Capture Inspiration</h3>
                    <p className="text-[11px] text-white/45 font-light">Speak, paste, or upload details. Gemini handles the categorization.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 flex items-start gap-2 text-xs text-red-400"
                      id="save-idea-error-container"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Core Content Area: Why inspired? */}
                  <div className="space-y-1.5" id="why-inspired-section">
                    <div className="flex items-center justify-between">
                      <label htmlFor="why-saved" className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1">
                        <span>Why did this inspire you? <span className="text-violet-400 font-bold">*</span></span>
                      </label>
                      
                      {/* Character Count Tag */}
                      <span className={`text-[10px] font-mono transition-colors duration-200 ${isOptimalLength ? 'text-emerald-400/70' : 'text-white/20'}`}>
                        {charCount} characters {isOptimalLength && '✓'}
                      </span>
                    </div>

                    <div className="relative">
                      <textarea
                        id="why-saved"
                        value={whySaved}
                        onChange={(e) => setWhySaved(e.target.value)}
                        placeholder={
                          isTranscribing 
                            ? "Gemini is translating audio wave note. Please wait..." 
                            : "Describe the magic: 'This transitions at 0:12 created huge curiosity...' or click Dictate to speak!"
                        }
                        rows={3}
                        disabled={isTranscribing}
                        className="w-full rounded-2xl bg-white/[0.02] border border-white/10 focus:border-violet-500/45 focus:bg-[#0E0E10] focus:ring-1 focus:ring-violet-500/20 outline-none px-4 py-3 text-sm text-[#EDEDED] placeholder-white/20 resize-none leading-relaxed transition-all duration-200 disabled:opacity-50"
                        required
                      />

                      {/* AI transcription indicator inside textarea */}
                      <AnimatePresence>
                        {isTranscribing && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 rounded-2xl flex flex-col items-center justify-center gap-2.5"
                          >
                            <Loader2 className="h-6 w-6 animate-spin text-violet-450" />
                            <span className="text-xs text-violet-300 font-mono tracking-widest uppercase animate-pulse">Transcribing Voice Note...</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Real-time Oscilloscope Waves when recording dictation */}
                      <AnimatePresence>
                        {isRecording && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                              </span>
                              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider font-mono">Listening...</span>
                            </div>

                            {/* Oscilloscope bars */}
                            <div className="flex items-center gap-[2.5px] h-4">
                              {waveBars.map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-[2.5px] bg-red-400 rounded-full"
                                  animate={{
                                    height: [2, Math.floor(Math.random() * 12) + 4, 2],
                                  }}
                                  transition={{
                                    duration: 0.5 + Math.random() * 0.3,
                                    repeat: Infinity,
                                    delay: i * 0.03,
                                    ease: "easeInOut"
                                  }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Quick helper tag buttons to seed user input */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-white/35 font-mono uppercase mr-1">Add Detail:</span>
                      {suggestedTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => appendSuggestion(tag)}
                          className="rounded-full bg-white/[0.03] border border-white/5 hover:border-violet-500/20 hover:bg-violet-500/5 px-2.5 py-0.5 text-[10px] font-medium text-white/50 hover:text-violet-300 transition-all duration-200 cursor-pointer"
                        >
                          +{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INPUT DOCK (Bento Grid Style) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Link Card */}
                    <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-3.5 space-y-2.5">
                      <label htmlFor="ref-url" className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1">
                        <Link2 className="h-3 w-3 text-violet-400" />
                        <span>Reference Link / URL</span>
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          id="ref-url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="Paste link..."
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 focus:border-violet-500/30 outline-none pl-3 pr-8 py-2 text-xs text-[#EDEDED] placeholder-white/20 transition-all duration-200"
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center">
                          <Globe className="h-3.5 w-3.5 text-white/20" />
                        </div>
                      </div>

                      {/* Sliding Platform Confirmation Badge */}
                      <AnimatePresence>
                        {url && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -5 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -5 }}
                            className={`flex items-center justify-between rounded-xl p-2 text-[11px] font-medium border ${currentPlatformConfig.bgColor} ${currentPlatformConfig.borderColor} ${currentPlatformConfig.textColor}`}
                          >
                            <div className="flex items-center gap-1.5">
                              <PlatformIcon className="h-3.5 w-3.5 shrink-0" />
                              <span>Detected: {currentPlatformConfig.label}</span>
                            </div>
                            <Check className="h-3 w-3 stroke-[2]" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Screenshot Upload Card */}
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`rounded-2xl border transition-all duration-200 p-3.5 flex flex-col justify-between min-h-[105px] ${
                        isDragging 
                          ? 'border-violet-500 bg-violet-500/5' 
                          : screenshot 
                            ? 'border-emerald-500/20 bg-emerald-500/[0.02]' 
                            : 'border-white/[0.05] bg-white/[0.01]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1">
                          <ImageIcon className="h-3 w-3 text-violet-400" />
                          <span>Attach Reference Image</span>
                        </span>
                        
                        {screenshot && (
                          <button
                            type="button"
                            onClick={deleteUploadedFile}
                            className="rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1 transition-colors cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {/* Dropzone Actions */}
                      {!screenshot && !isUploading ? (
                        <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl hover:border-violet-500/20 hover:bg-white/[0.01] p-2 cursor-pointer transition-all duration-200">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="hidden" 
                          />
                          <FileUp className="h-4 w-4 text-white/30 mb-1" />
                          <span className="text-[10px] text-white/50 text-center font-light leading-normal">
                            Drag & drop or <span className="text-violet-400 font-medium">browse</span>
                          </span>
                        </label>
                      ) : isUploading ? (
                        <div className="flex-1 flex flex-col justify-center space-y-1.5 px-1">
                          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                            <span>Uploading Screenshot...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          {/* Slim Progress Bar */}
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.1 }}
                            />
                          </div>
                        </div>
                      ) : (
                        /* Image Upload Success Preview card */
                        <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl p-1.5">
                          <img 
                            src={screenshot || ''} 
                            alt="Preview Reference" 
                            className="h-10 w-10 object-cover rounded-lg border border-white/10 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium text-white/70 truncate">{fileName}</p>
                            <span className="text-[9px] text-white/40 font-mono">{fileSize} • Ready</span>
                          </div>
                          <div className="h-5 w-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0 mr-1">
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VOICE RECORDER DOCK */}
                  <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-3.5 space-y-3" id="voice-recorder-section">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                        <Volume2 className="h-3.5 w-3.5 text-violet-400" />
                        <span>Voice Inputs</span>
                      </span>

                      {/* Mode Toggles */}
                      <div className="flex items-center gap-2">
                        {/* Real-time speech-to-text toggler */}
                        <button
                          type="button"
                          onClick={toggleRecording}
                          disabled={!speechSupported || isRecordingAudio}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-medium transition-all ${
                            isRecording 
                              ? 'bg-red-500/20 border-red-500/30 text-red-400 animate-pulse' 
                              : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-30 cursor-pointer'
                          }`}
                          title="Speak real-time to write transcript text directly into description"
                        >
                          <Mic className="h-3 w-3" />
                          <span>{isRecording ? 'Listening' : 'Voice Dictate'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Microphone Recording Component */}
                    {!audioPreviewUrl && !isRecordingAudio ? (
                      <button
                        type="button"
                        onClick={startAudioRecording}
                        disabled={isRecording}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-violet-500/20 py-3.5 text-xs font-semibold text-white/60 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-30"
                      >
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                        <span>Record Audio Voice Memo</span>
                      </button>
                    ) : isRecordingAudio ? (
                      <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-red-400">
                        <div className="flex items-center gap-3">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                          </span>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-wider">Recording Voice Note...</span>
                            <span className="text-[10px] text-red-400/70 font-mono">Duration: {audioDuration}s</span>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={stopAudioRecording}
                          className="flex items-center gap-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-md"
                        >
                          <Square className="h-3 w-3 fill-current" />
                          <span>Stop & Keep</span>
                        </button>
                      </div>
                    ) : (
                      /* Audio Player controls */
                      <div className="flex items-center justify-between rounded-xl border border-emerald-500/15 bg-emerald-500/[0.02] px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Play className="h-4 w-4 fill-current animate-pulse" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#EDEDED]">Audio Recording Attached</span>
                            <span className="text-[10px] text-white/40 font-mono">Recorded Memo • {audioDuration || 1}s</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={togglePlayPreview}
                            className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#EDEDED] border border-white/10 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                          >
                            {isPlayingPreview ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                            <span>{isPlayingPreview ? 'Pause' : 'Play Preview'}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={deleteAudioRecording}
                            className="rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 border border-red-500/10 transition-colors cursor-pointer"
                            title="Delete recording"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM CONFIGURATION BAR (Title & Boards) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                      <label htmlFor="inspiration-title" className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center justify-between">
                        <span>Inspiration Title</span>
                        <span className="text-[9px] text-violet-400/75 italic">Optional • AI auto-generates if empty</span>
                      </label>
                      <input
                        type="text"
                        id="inspiration-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Bauhaus Photo Grid Overlay"
                        className="w-full rounded-xl bg-white/[0.02] border border-white/10 focus:border-violet-500/30 outline-none px-3.5 py-2.5 text-xs text-[#EDEDED] placeholder-white/20 transition-all"
                      />
                    </div>

                    {/* Board Selection */}
                    <div className="space-y-1.5">
                      <label htmlFor="collection-select" className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                        Target Inspiration Board
                      </label>
                      <div className="relative">
                        <select
                          id="collection-select"
                          value={selectedCollectionId}
                          onChange={handleCollectionChange}
                          className="w-full rounded-xl bg-white/[0.02] border border-white/10 focus:border-violet-500/30 outline-none px-3 py-2.5 text-xs text-[#EDEDED] transition-all cursor-pointer appearance-none"
                        >
                          <optgroup label="Default Boards" className="bg-[#0A0A0A] text-[#EDEDED]">
                            {collections
                              .filter(c => c.is_default)
                              .map(c => (
                                <option key={c.id} value={c.id}>
                                  {c.icon} {c.name}
                                </option>
                              ))}
                          </optgroup>
                          
                          {collections.some(c => !c.is_default) && (
                            <optgroup label="Custom Boards" className="bg-[#0A0A0A] text-[#EDEDED]">
                              {collections
                                .filter(c => !c.is_default)
                                .map(c => (
                                  <option key={c.id} value={c.id}>
                                    {c.icon} {c.name}
                                  </option>
                                ))}
                            </optgroup>
                          )}
                        </select>
                        
                        {/* Custom Select arrow replacement */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-white/30">
                          <Plus className="h-3.5 w-3.5 stroke-[2] rotate-45" />
                        </div>
                      </div>

                      {/* Add collection helper link */}
                      <button
                        type="button"
                        onClick={onTriggerCreateCollection}
                        className="text-[10px] text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 pt-1 transition-all"
                      >
                        <FolderPlus className="h-3 w-3" />
                        <span>Create custom board...</span>
                      </button>
                    </div>
                  </div>

                  {/* AI STATUS / FOOTER CO-PILOT INDICATOR */}
                  <div className="rounded-xl bg-violet-500/[0.02] border border-violet-500/10 p-3 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 shrink-0">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-[11px] font-bold text-violet-300 uppercase tracking-wider">AI Co-Pilot Enabled</h5>
                      <p className="text-[10px] text-white/50 leading-relaxed">
                        Saving triggers background Gemini analysis: extracts core hooks, creates storytelling formulas, tags elements, and drafts blueprints for reuse.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]" id="modal-footer-actions">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="rounded-full px-5 py-2.5 text-xs font-semibold text-white/40 hover:bg-white/5 hover:text-white transition-all cursor-pointer disabled:opacity-30"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || !whySaved.trim()}
                      className="relative flex items-center gap-1.5 overflow-hidden rounded-full bg-white hover:bg-white/90 text-black px-6 py-2.5 text-xs font-bold shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.25)] transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Locking in Vault...</span>
                        </>
                      ) : (
                        <>
                          <span>Secure Inspiration</span>
                          <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

