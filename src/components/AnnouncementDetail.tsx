import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { ArrowLeft, Bookmark, BookmarkCheck, Pin, Paperclip, Eye, Calendar, Clock, FileText, Download, Share2, Check, Volume2, Play, Pause, Square, Settings2, Gauge } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AnnouncementDetail({ basePath = "/user" }: { basePath?: string }) {
  const { id } = useParams<{ id: string }>();
  const { announcements, toggleBookmark, markAsRead, incrementViews } = useAnnouncements();
  const { user } = useAuth();
  const a = announcements.find((ann) => ann.id === id);
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // TTS Advanced State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (a) {
      document.title = `${a.title} – Smart Campus`;
      markAsRead(a.id);
      incrementViews(a.id);
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      // Default to a natural sounding English voice if possible
      if (!selectedVoiceURI && availableVoices.length > 0) {
        const preferred = availableVoices.find(v => v.name.includes("Google") || v.name.includes("Natural")) || availableVoices[0];
        setSelectedVoiceURI(preferred.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [a?.id]);

  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height === 0) return;
      setReadingProgress((scrolled / height) * 100);
    };
    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  // Sync scroll with TTS progress
  useEffect(() => {
    if (isSpeaking && !isPaused) {
      const activeElement = document.querySelector('.tts-active-word');
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentCharIndex, isSpeaking, isPaused]);

  const stopTTS = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentCharIndex(0);
  };

  const handleTTS = () => {
    if (!a) return;

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Start New Speech
    window.speechSynthesis.cancel();
    const fullText = `${a.title}. ${a.description}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utteranceRef.current = utterance;
    // @ts-ignore
    window.currentUtterance = utterance; // Prevent Chrome GC bug

    utterance.rate = playbackRate;

    if (selectedVoiceURI) {
      const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (voice) utterance.voice = voice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentCharIndex(event.charIndex);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentCharIndex(0);
    };

    utterance.onerror = (event) => {
      console.error("SpeechSynthesis error:", event);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentCharIndex(0);
      toast.error("Speech synthesis failed");
    };

    window.speechSynthesis.speak(utterance);
    // Set initial state immediately to show start of Title
    setIsSpeaking(true);
    setIsPaused(false);
    setCurrentCharIndex(0);
  };

  // Helper to render highlighted text
  const renderTextWithHighlight = (text: string, startIndex: number, isActive: boolean) => {
    if (!isActive) {
      return <span className="select-text">{text}</span>;
    }

    const isThisBlockActive = currentCharIndex >= startIndex && currentCharIndex < startIndex + text.length;

    if (!isThisBlockActive) {
      return <span className="select-text">{text}</span>;
    }

    const tokens = text.split(/(\s+)/);
    let currentOffset = startIndex;

    const mappedTokens = tokens.map(token => {
      const start = currentOffset;
      const end = currentOffset + token.length;
      currentOffset = end;
      return { token, start, end };
    });

    const activeIndex = mappedTokens.findIndex(
      t => t.end > currentCharIndex && t.token.trim().length > 0
    );

    return (
      <span className="tts-container select-text">
        {mappedTokens.map((t, i) => {
          if (i === activeIndex) {
            return (
              <span key={i} className="tts-active-word bg-primary/30 text-primary px-1 rounded-md transition-none shadow-[0_0_12px_rgba(59,130,246,0.5)] ring-1 ring-primary/20">
                {t.token}
              </span>
            );
          }
          return <span key={i}>{t.token}</span>;
        })}
      </span>
    );
  };

  const audioProgress = useMemo(() => {
    if (!a) return 0;
    const totalLength = a.title.length + a.description.length + 2;
    return (currentCharIndex / totalLength) * 100;
  }, [currentCharIndex, a]);

  const related = useMemo(() => {
    if (!a) return [];
    return announcements
      .filter(item => item.id !== a.id && item.category === a.category && item.status === "Published")
      .slice(0, 2);
  }, [a, announcements]);

  if (!a) {
    return (
      <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
        <p className="text-muted-foreground font-medium">Announcement not found</p>
        <Link to={basePath} className="text-primary text-sm font-semibold mt-2 inline-block hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const priorityMap = {
    high: "bg-priority-high",
    normal: "bg-priority-normal",
    low: "bg-priority-low",
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, 210, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("SMART CAMPUS", 10, 20);
      doc.setFontSize(10);
      doc.text("Official Announcement System", 10, 30);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(a.title, 180);
      doc.text(titleLines, 10, 55);
      doc.setDrawColor(200, 200, 200);
      doc.line(10, 65, 200, 65);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Department: ${a.department}`, 10, 75);
      doc.text(`Category: ${a.category}`, 10, 82);
      doc.text(`Priority: ${a.priority.toUpperCase()}`, 10, 89);
      doc.text(`Posted: ${a.createdAt}`, 130, 75);
      doc.text(`Expires: ${a.expiryDate}`, 130, 82);
      doc.setDrawColor(200, 200, 200);
      doc.line(10, 95, 200, 95);
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      const descriptionLines = doc.splitTextToSize(a.description, 180);
      doc.text(descriptionLines, 10, 105);
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Generated by Smart Campus Announcement System", 10, pageHeight - 10);
      doc.text(`Download Date: ${new Date().toLocaleString()}`, 150, pageHeight - 10);
      doc.save(`announcement-${a.id}.pdf`);
    });
  };

  return (
    <>
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[60] bg-muted/20 backdrop-blur-sm">
        <div
          className="h-full bg-primary transition-all duration-200 shadow-[0_0_15px_rgba(59,130,246,0.8)] relative"
          style={{ width: `${readingProgress}%` }}
        >
          <div className="absolute right-0 top-0 h-full w-4 bg-white/40 blur-sm animate-pulse" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to={basePath} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>

        <article className="campus-card-static p-6 sm:p-8 space-y-6 animate-fade-in-up shadow-xl shadow-primary/5">
          {/* Enhanced Audio Player UX */}
          <div className="relative p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl border border-primary/20 overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 transition-transform ${isSpeaking && !isPaused ? 'scale-110 animate-pulse' : ''}`}>
                    <Volume2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-primary uppercase tracking-wider flex items-center gap-2">
                      Listen to Notice
                      {isSpeaking && <span className="flex gap-0.5"><span className="w-1 h-3 bg-primary animate-bounce" /><span className="w-1 h-3 bg-primary animate-bounce [animation-delay:-0.2s]" /><span className="w-1 h-3 bg-primary animate-bounce [animation-delay:-0.4s]" /></span>}
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-bold mt-0.5 uppercase tracking-widest">
                      {isSpeaking ? (isPaused ? "Paused" : "Now Reading...") : "AI Narrator Ready"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all active:scale-95 shadow-sm ${isSettingsOpen ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:border-primary/50'}`}
                    aria-label="Audio Settings"
                  >
                    <Settings2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleTTS}
                    className="h-10 w-10 flex items-center justify-center bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                    aria-label={isSpeaking && !isPaused ? "Pause" : "Play"}
                  >
                    {isSpeaking && !isPaused ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                  </button>
                  {isSpeaking && (
                    <button
                      onClick={stopTTS}
                      className="h-10 w-10 flex items-center justify-center bg-destructive text-destructive-foreground rounded-xl shadow-lg shadow-destructive/20 hover:scale-105 transition-all active:scale-95 animate-fade-in"
                      aria-label="Stop"
                    >
                      <Square className="h-4 w-4 fill-current" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar inside Player */}
              <div className="relative h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>

              {/* Interactive Settings Panel */}
              {isSettingsOpen && (
                <div className="grid grid-cols-2 gap-4 p-4 mt-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 px-1">
                      <Gauge className="h-3 w-3" /> Voice Speed
                    </label>
                    <div className="flex p-1 bg-muted/50 rounded-lg border border-border">
                      {[1, 1.25, 1.5].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setPlaybackRate(rate)}
                          className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${playbackRate === rate ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 px-1">
                      <Volume2 className="h-3 w-3" /> Narrator
                    </label>
                    <select
                      value={selectedVoiceURI || ""}
                      onChange={(e) => setSelectedVoiceURI(e.target.value)}
                      className="w-full h-8 px-2 text-[10px] font-bold bg-muted/50 border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30"
                    >
                      {voices.slice(0, 5).map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name.split(" - ")[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {a.pinned && (
              <span className="inline-flex items-center gap-1 text-xs text-campus-blue font-bold uppercase tracking-widest"><Pin className="h-3.5 w-3.5" /> Pinned</span>
            )}
            <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${priorityMap[a.priority]}`}>
              {a.priority} Priority
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold uppercase tracking-wider">{a.category}</span>
            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-bold uppercase tracking-wider">{a.department}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-foreground select-text cursor-text">
            {renderTextWithHighlight(a.title, 0, isSpeaking)}
          </h1>

          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap tabular-nums font-bold uppercase tracking-wider">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md border border-border/50"><Calendar className="h-3.5 w-3.5 text-primary" /> {a.createdAt}</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md border border-border/50"><Clock className="h-3.5 w-3.5 text-primary" /> Expires: {a.expiryDate}</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md border border-border/50"><Eye className="h-3.5 w-3.5 text-primary" /> {a.views} Views</span>
          </div>

          <div className="border-t border-border/50 pt-8 mt-4">
            <div className="text-lg sm:text-xl leading-relaxed whitespace-pre-line text-foreground/90 font-medium select-text cursor-text">
              {renderTextWithHighlight(a.description, a.title.length + 2, isSpeaking)}
            </div>
          </div>

          {a.attachment && (
            <div className="border-t border-border/50 pt-8 mt-4">
              <div className="inline-flex items-center gap-4 p-5 rounded-2xl bg-muted/20 border border-border/60 text-sm w-full transition-all hover:bg-muted/30">
                <div className="h-12 w-12 rounded-xl bg-background shadow-inner flex items-center justify-center border border-border/50">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate text-foreground">{a.attachment.name}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{a.attachment.type} {a.attachment.size && `• ${a.attachment.size}`}</p>
                </div>
                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-background border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all active:scale-95" aria-label="Download">
                  <Download className="h-5 w-5 text-primary" />
                </button>
              </div>
            </div>
          )}

          {a.rejectionReason && (
            <div className="border-t border-border/50 pt-8 mt-4">
              <div className="p-5 rounded-2xl bg-destructive/5 border border-destructive/10">
                <div className="flex items-center gap-2 text-destructive font-black uppercase text-xs tracking-[0.2em] mb-3">
                  Rejection Audit Result
                </div>
                <p className="text-foreground/80 font-medium leading-relaxed">{a.rejectionReason}</p>
              </div>
            </div>
          )}

          <div className="border-t border-border/50 pt-8 mt-4 flex items-center gap-4 flex-wrap">
            {user?.role === "user" && (
              <button onClick={() => toggleBookmark(a.id)}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl border border-border text-xs font-black uppercase tracking-widest hover:bg-muted hover:border-primary/30 transition-all duration-150 active:scale-95 shadow-sm">
                {a.isBookmarked ? <><BookmarkCheck className="h-5 w-5 text-primary" /> Saved to Hub</> : <><Bookmark className="h-5 w-5" /> Save Notice</>}
              </button>
            )}
            <button onClick={handleDownloadPDF}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-150 active:scale-95 shadow-lg shadow-primary/10">
              <Download className="h-5 w-5" /> Export Document (PDF)
            </button>
          </div>

          {/* Discussion */}
          {a.comments && a.comments.length > 0 && (
            <div className="border-t border-border/50 pt-10 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black uppercase tracking-tighter">Campus Discussion</h3>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-muted rounded-full border border-border">{a.comments.length} Comments</span>
              </div>
              <div className="space-y-6">
                {a.comments.map((c) => (
                  <div key={c.id} className="p-6 rounded-2xl bg-muted/10 border border-border/50 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground text-sm font-black flex items-center justify-center shadow-lg shadow-primary/10">
                        {c.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-foreground">{c.author}</span>
                          <span className="text-[9px] uppercase font-black tracking-widest text-primary px-1.5 py-0.5 rounded bg-primary/5 border border-primary/10">{c.role}</span>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wide">{new Date(c.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Announcements */}
        {related.length > 0 && (
          <div className="space-y-6 pt-10">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black uppercase text-muted-foreground tracking-[0.3em]">Next in category</h3>
              <div className="h-px bg-border/50 flex-1 ml-6" />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map(item => (
                <Link key={item.id} to={`/user/announcement/${item.id}`} className="campus-card p-6 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-card/40 backdrop-blur-sm border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">{item.category}</span>
                    <ArrowLeft className="h-3 w-3 text-muted-foreground rotate-180" />
                  </div>
                  <h4 className="text-lg font-bold line-clamp-1 text-foreground mb-2">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
