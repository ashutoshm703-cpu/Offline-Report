import React, { useState, useRef, useEffect } from 'react';
import { SubjectData, SubjectStatus, Status, ChapterStat, QuestionDetail } from '../types';

interface ChapterPosterProps {
    chapter: ChapterStat;
    variant: 'improve' | 'good' | 'strong';
    isActive: boolean;
    onSelect: (name: string) => void;
}

// Helper to parse time string "1h 30m 10s" to seconds
const parseTimeStringToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    
    let totalSeconds = 0;
    const h = timeStr.match(/(\d+)h/);
    const m = timeStr.match(/(\d+)m/);
    const s = timeStr.match(/(\d+)s/);
    
    if (h) totalSeconds += parseInt(h[1]) * 3600;
    if (m) totalSeconds += parseInt(m[1]) * 60;
    if (s) totalSeconds += parseInt(s[1]);
    
    return totalSeconds;
};

// Helper to format seconds back to "1m 30s"
const formatSecondsToTime = (seconds: number): string => {
    if (seconds === 0) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || (h === 0 && m === 0)) parts.push(`${s}s`);
    
    return parts.join(' ');
};

interface QuestionTypeStat {
  typeName: string;
  total: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  totalMarks: number;
  negativeMarks: number;
  timeSpent: number;
  avgTime: number;
}

const DonutChart = ({ 
    correct, 
    incorrect, 
    unattempted, 
    total 
}: { 
    correct: number; 
    incorrect: number; 
    unattempted: number; 
    total: number 
}) => {
    const size = 64;
    const strokeWidth = 8;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const correctOffset = circumference - ((correct / total) * circumference);
    const incorrectOffset = circumference - ((incorrect / total) * circumference);
    // Unattempted is the base circle, so we layer Correct and Incorrect on top.

    // Calculate rotation for the second segment (Incorrect) so it starts where Correct ends
    const correctAngle = (correct / total) * 360;

    return (
        <div className="relative size-16 flex-shrink-0">
             <svg className="size-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                {/* 1. Base Track (Unattempted Color - Gray) */}
                <circle 
                    cx={center} cy={center} r={radius} 
                    fill="transparent" 
                    stroke="#E2E8F0" 
                    strokeWidth={strokeWidth} 
                />
                
                {/* 2. Incorrect Segment (Red) */}
                {incorrect > 0 && (
                     <circle 
                        cx={center} cy={center} r={radius} 
                        fill="transparent" 
                        stroke="#EB5757" 
                        strokeWidth={strokeWidth} 
                        strokeDasharray={circumference}
                        strokeDashoffset={incorrectOffset}
                        strokeLinecap="round"
                        transform={`rotate(${correctAngle} ${center} ${center})`}
                        className="transition-all duration-500 ease-out"
                    />
                )}

                {/* 3. Correct Segment (Green) - Drawn First (visually looks like it starts at 12 o'clock) */}
                {correct > 0 && (
                    <circle 
                        cx={center} cy={center} r={radius} 
                        fill="transparent" 
                        stroke="#219653" 
                        strokeWidth={strokeWidth} 
                        strokeDasharray={circumference}
                        strokeDashoffset={correctOffset}
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-out"
                    />
                )}
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-sm font-bold text-slate-700 leading-none">{total}</span>
                 <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">Qs</span>
             </div>
        </div>
    );
}

const QuestionTypeCard: React.FC<{ stat: QuestionTypeStat, isOffline: boolean }> = ({ stat, isOffline }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 mb-3 shadow-sm relative overflow-hidden flex flex-col">
            <div className="p-4 flex flex-row gap-2">
                {/* Left Zone: Metrics */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-tight pr-2">
                            {stat.typeName}
                        </h4>
                        
                        {/* Hero Score Section */}
                        <div className="mt-3 flex flex-col items-start">
                             <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-black tracking-tight ${stat.score >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
                                    {stat.score}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Net Marks</span>
                             </div>
                             
                             {/* Negative Marks Warning */}
                             <div className="flex items-center gap-1.5 mt-0.5">
                                 <span className={`text-[11px] font-bold ${stat.negativeMarks < 0 ? 'text-ref-red' : 'text-slate-300'}`}>
                                    {stat.negativeMarks} Neg. Marks
                                 </span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Right Zone: Visuals */}
                <div className="w-32 pl-4 border-l border-slate-50 flex flex-col items-center justify-center gap-3">
                     <DonutChart 
                        correct={stat.correct}
                        incorrect={stat.incorrect}
                        unattempted={stat.unattempted}
                        total={stat.total}
                     />

                     {/* Legend */}
                     <div className="flex flex-col gap-1.5 w-full pl-2">
                         <div className="flex items-center justify-between w-full text-[10px]">
                             <div className="flex items-center gap-1.5">
                                 <div className="size-1.5 rounded-full bg-ref-green"></div>
                                 <span className="font-medium text-slate-500">Correct</span>
                             </div>
                             <span className="font-bold text-slate-700">{stat.correct}</span>
                         </div>
                         <div className="flex items-center justify-between w-full text-[10px]">
                             <div className="flex items-center gap-1.5">
                                 <div className="size-1.5 rounded-full bg-ref-red"></div>
                                 <span className="font-medium text-slate-500">Wrong</span>
                             </div>
                             <span className="font-bold text-slate-700">{stat.incorrect}</span>
                         </div>
                         <div className="flex items-center justify-between w-full text-[10px]">
                             <div className="flex items-center gap-1.5">
                                 <div className="size-1.5 rounded-full bg-slate-300"></div>
                                 <span className="font-medium text-slate-400">Unatt.</span>
                             </div>
                             <span className="font-bold text-slate-500">{stat.unattempted}</span>
                         </div>
                     </div>
                </div>
            </div>

            {/* Efficiency Footer (Only if Online) */}
            {!isOffline && (
                <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">schedule</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total: {formatSecondsToTime(stat.timeSpent)}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">speed</span>
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Avg: {formatSecondsToTime(Math.round(stat.avgTime))}/Q</span>
                     </div>
                </div>
            )}
        </div>
    );
};


// Compact Poster Component for Netflix-style Swimlanes
const ChapterPoster: React.FC<ChapterPosterProps> = ({ 
    chapter, 
    variant, 
    isActive, 
    onSelect 
}) => {
    const accuracy = chapter.total > 0 ? Math.round((chapter.correct / chapter.total) * 100) : 0;
    
    // Style configurations based on variant
    let styles = {
        bg: 'bg-white',
        border: 'border-slate-100',
        ringTrack: 'text-slate-100',
        ringColor: 'text-slate-400',
        textColor: 'text-slate-600',
        badgeBg: 'bg-slate-50',
        badgeText: 'text-slate-500'
    };

    if (variant === 'improve') {
        styles = {
            bg: 'bg-red-50/40',
            border: 'border-red-100',
            ringTrack: 'text-red-200',
            ringColor: 'text-red-500',
            textColor: 'text-red-700',
            badgeBg: 'bg-white/80',
            badgeText: 'text-red-700'
        };
    } else if (variant === 'good') {
        styles = {
            bg: 'bg-amber-50/40',
            border: 'border-amber-100',
            ringTrack: 'text-amber-200',
            ringColor: 'text-amber-500',
            textColor: 'text-amber-700',
            badgeBg: 'bg-white/80',
            badgeText: 'text-amber-700'
        };
    } else if (variant === 'strong') {
        styles = {
            bg: 'bg-emerald-50/40',
            border: 'border-emerald-100',
            ringTrack: 'text-emerald-200',
            ringColor: 'text-emerald-500',
            textColor: 'text-emerald-700',
            badgeBg: 'bg-white/80',
            badgeText: 'text-emerald-700'
        };
    }

    // SVG Circle Math - Standardized to 40x40 Grid
    const size = 40;
    const center = size / 2; // 20
    const strokeWidth = 4; // Keeps proportion when scaled down
    const radius = (size - strokeWidth) / 2; // 18
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (accuracy / 100) * circumference;

    return (
        <button 
            onClick={() => onSelect(chapter.name)}
            className={`
                relative flex-shrink-0 w-32 p-3 rounded-xl border snap-start text-left transition-all duration-200 group
                flex flex-col gap-3
                ${styles.bg} ${styles.border}
                ${isActive ? 'ring-2 ring-primary ring-offset-2 shadow-md' : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'}
            `}
        >
            <div className="flex justify-between items-start">
                 {/* Circular Progress */}
                <div className="relative size-10 flex-shrink-0">
                    <svg className="size-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                        {/* Background Track */}
                        <circle 
                            cx={center} 
                            cy={center} 
                            r={radius} 
                            fill="transparent" 
                            stroke="currentColor" 
                            strokeWidth={strokeWidth} 
                            className={styles.ringTrack} 
                        />
                        {/* Progress Value */}
                        <circle 
                            cx={center} 
                            cy={center} 
                            r={radius} 
                            fill="transparent" 
                            stroke="currentColor" 
                            strokeWidth={strokeWidth} 
                            strokeDasharray={circumference} 
                            strokeDashoffset={offset} 
                            strokeLinecap="round" 
                            className={styles.ringColor} 
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-[9px] font-bold ${styles.textColor}`}>{accuracy}%</span>
                    </div>
                </div>

                {/* Question Count Badge - INCREASED SIZE & PADDING */}
                <div className={`px-1.5 py-1 rounded text-[11px] font-bold border border-transparent ${styles.badgeBg} ${styles.badgeText}`}>
                    {chapter.total} Qs
                </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-between min-h-[2.5rem]">
                <p className="text-[10px] font-bold text-slate-700 leading-tight line-clamp-2" title={chapter.name}>
                    {chapter.name}
                </p>
                <div className="flex items-center gap-1 mt-2">
                    <span className={`text-[9px] font-medium ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors flex items-center gap-0.5`}>
                        {isActive ? 'Viewing' : 'View Qs'} 
                        <span className="material-symbols-outlined text-[10px]">{isActive ? 'visibility' : 'arrow_forward'}</span>
                    </span>
                </div>
            </div>
        </button>
    );
};

interface SwimlaneRowProps {
    title: string; 
    chapters: ChapterStat[]; 
    variant: 'improve' | 'good' | 'strong';
    activeChapter: string | null;
    onSelect: (name: string) => void;
}

// Independent Scrollable Swimlane Row Component
const SwimlaneRow: React.FC<SwimlaneRowProps> = ({ 
    title, 
    chapters, 
    variant, 
    activeChapter, 
    onSelect 
}) => {
    const rowScrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (rowScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = rowScrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
        }
    };

    // Reset scroll when data changes to ensure consistent alignment
    useEffect(() => {
        if (rowScrollRef.current) {
            rowScrollRef.current.scrollLeft = 0;
            checkScroll();
        }
    }, [chapters, variant]);

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [chapters]);

    const scrollRight = () => {
        if (rowScrollRef.current) {
            rowScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
        if (rowScrollRef.current) {
            rowScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    if (!chapters || chapters.length === 0) return null;

    return (
        <div className="mb-6 last:mb-2 relative">
             <h6 className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                {variant === 'improve' && <span className="size-1.5 rounded-full bg-ref-red animate-pulse"></span>}
                {title}
                <span className="bg-slate-100 text-slate-500 px-1.5 rounded text-[9px]">{chapters.length}</span>
            </h6>
            
            <div className="relative group/swimlane">
                {/* Scroll Buttons - Positioned at Edge (left-1 = 4px) */}
                {canScrollLeft && (
                    <button 
                        onClick={scrollLeft} 
                        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md border border-slate-100 rounded-full size-8 flex items-center justify-center text-slate-500 hover:text-primary transition-all hidden sm:flex"
                    >
                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                )}
                {canScrollRight && (
                    <button 
                        onClick={scrollRight} 
                        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur shadow-md border border-slate-100 rounded-full size-8 flex items-center justify-center text-slate-500 hover:text-primary transition-all hidden sm:flex"
                    >
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                )}

                {/* Fade Gradients - Solid White Start to hide content underneath */}
                <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/90 to-transparent z-10 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

                <div 
                    ref={rowScrollRef}
                    onScroll={checkScroll}
                    className="flex overflow-x-auto gap-3 px-5 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] scroll-pl-5"
                >
                    {chapters.map((chapter, i) => (
                        <ChapterPoster 
                            key={i} 
                            chapter={chapter} 
                            variant={variant}
                            isActive={activeChapter === chapter.name}
                            onSelect={onSelect}
                        />
                    ))}
                    <div className="w-2 flex-shrink-0"></div>
                </div>
            </div>
        </div>
    );
};


interface SubjectCardProps {
  subject: SubjectData;
  isOffline?: boolean;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, isOffline = false }) => {
  const [showQuestionTable, setShowQuestionTable] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | Status>('All');
  const [activeChapterFilter, setActiveChapterFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chapters' | 'types'>('chapters');

  // Ref for auto-scrolling to table
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Refs and State for Rank Breakdown Horizontal Scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [subject]);

  const scrollRight = () => {
    if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const getResultColor = (result: Status) => {
      switch(result) {
          case Status.Correct: return 'bg-ref-green text-white';
          case Status.Incorrect: return 'bg-ref-red text-white';
          case Status.Unattempted: return 'bg-ref-gray text-slate-500';
          default: return 'bg-slate-200';
      }
  };

  const filteredQuestions = subject.questions.filter(q => {
    const matchesStatus = activeFilter === 'All' ? true : q.result === activeFilter;
    const matchesChapter = activeChapterFilter ? q.chapter === activeChapterFilter : true;
    return matchesStatus && matchesChapter;
  });

  const questionArrayCounts = {
      All: subject.questions.length,
      [Status.Correct]: subject.questions.filter(q => q.result === Status.Correct).length,
      [Status.Incorrect]: subject.questions.filter(q => q.result === Status.Incorrect).length,
      [Status.Unattempted]: subject.questions.filter(q => q.result === Status.Unattempted).length,
  };

  // Get unique chapters and their counts for the dropdown
  const chapterCounts = subject.questions.reduce((acc, q) => {
    if (q.chapter) {
      acc[q.chapter] = (acc[q.chapter] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const uniqueChapters = Object.keys(chapterCounts).sort();

  // AGGREGATE COUNTS FROM CHAPTERS
  const allChapters = [
      ...subject.chapters.strong,
      ...subject.chapters.good,
      ...subject.chapters.improve
  ];
  
  const trueCounts = allChapters.reduce((acc, chapter) => ({
      correct: acc.correct + chapter.correct,
      incorrect: acc.incorrect + chapter.incorrect,
      unattempted: acc.unattempted + chapter.unattempted,
      total: acc.total + chapter.total
  }), { correct: 0, incorrect: 0, unattempted: 0, total: 0 });

  const displayCounts = trueCounts.total > 0 ? trueCounts : {
      correct: questionArrayCounts[Status.Correct],
      incorrect: questionArrayCounts[Status.Incorrect],
      unattempted: questionArrayCounts[Status.Unattempted],
      total: questionArrayCounts.All
  };

  // Attempt Rate Calc
  const attemptedCount = displayCounts.total - displayCounts.unattempted;
  const attemptRate = displayCounts.total > 0 ? Math.round((attemptedCount / displayCounts.total) * 100) : 0;
  
  // Time per Q calc for stats
  const correctAvgTime = displayCounts.correct > 0 ? Math.round(parseTimeStringToSeconds(subject.timeBreakdown.correct) / displayCounts.correct) : 0;
  const incorrectAvgTime = displayCounts.incorrect > 0 ? Math.round(parseTimeStringToSeconds(subject.timeBreakdown.incorrect) / displayCounts.incorrect) : 0;
  const unattemptedAvgTime = displayCounts.unattempted > 0 ? Math.round(parseTimeStringToSeconds(subject.timeBreakdown.unattempted) / displayCounts.unattempted) : 0;

  const handleChapterSelect = (chapterName: string) => {
      if (activeChapterFilter === chapterName) {
          setActiveChapterFilter(null);
      } else {
          setActiveChapterFilter(chapterName);
          setShowQuestionTable(true);
          setTimeout(() => {
            tableContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
      }
  };

  // Rank Chip Component
  const RankChip = ({ label, rank, icon }: { label: string, rank: number, icon: string }) => {
     return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-100/80 flex-shrink-0">
            <span className="material-symbols-outlined text-[10px] text-slate-400">{icon}</span>
            <div className="flex items-baseline gap-1">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">
                    {label}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                    {rank}
                </span>
            </div>
        </div>
     );
  };

  // CALCULATE QUESTION TYPE STATS
  const questionTypeStats: QuestionTypeStat[] = React.useMemo(() => {
      const stats: Record<string, QuestionTypeStat> = {};
      
      subject.questions.forEach(q => {
          const type = q.type || 'Unknown Type';
          if (!stats[type]) {
              stats[type] = {
                  typeName: type,
                  total: 0,
                  correct: 0,
                  incorrect: 0,
                  unattempted: 0,
                  score: 0,
                  totalMarks: 0,
                  negativeMarks: 0,
                  timeSpent: 0,
                  avgTime: 0
              };
          }
          
          stats[type].total++;
          if (q.result === Status.Correct) stats[type].correct++;
          if (q.result === Status.Incorrect) stats[type].incorrect++;
          if (q.result === Status.Unattempted) stats[type].unattempted++;
          
          stats[type].score += q.marks;
          stats[type].totalMarks += 4; // Assuming 4 marks per question for now
          
          if (q.marks < 0) stats[type].negativeMarks += q.marks;
          
          stats[type].timeSpent += parseTimeStringToSeconds(q.timeSpent);
      });
      
      return Object.values(stats).map(s => ({
          ...s,
          avgTime: s.total > 0 ? s.timeSpent / s.total : 0
      }));
  }, [subject.questions]);


  return (
    <div 
        className="bg-white rounded-xl border border-slate-100 shadow-soft overflow-visible transition-all duration-300 my-1"
    >
      {/* HEADER: High Density Dashboard Layout */}
      <div className="p-5 pb-0 bg-white rounded-t-xl relative z-10">
        <div className="flex justify-between items-end mb-4">
             {/* Left: Score Anchor (Zone A) */}
             <div>
                <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">{subject.name}</h4>
                <div className="flex items-baseline gap-2">
                   <span className="text-5xl font-black text-slate-800 tracking-tighter">{subject.score}</span>
                   <span className="text-lg font-medium text-slate-300">/ {subject.totalMarks}</span>
                </div>
             </div>

             {/* Right: Diagnostics Grid (Zone B) - AIR | Accuracy - Time REMOVED from here */}
             <div className="flex items-center gap-3 mb-1.5">
                {/* AIR (Priority 1) */}
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">AIR</span>
                    <span className="text-lg font-bold text-slate-800">
                        #{subject.ranks.air.rank}
                    </span>
                </div>

                <div className="w-px h-8 bg-slate-100"></div>

                {/* Accuracy (Priority 2) */}
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Accuracy</span>
                   <span className={`text-lg font-bold ${subject.accuracy < 75 ? 'text-ref-red' : 'text-ref-green-dark'}`}>
                      {Math.round(subject.accuracy)}%
                   </span>
                </div>
             </div>
        </div>
      </div>

      {/* PILL/CHIP RANK LAYOUT */}
      <div className="border-b border-slate-50 pb-2">
         <div className="px-5 mb-1.5">
            <p className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1.5 tracking-wider">
                <span className="material-symbols-outlined text-[12px]">leaderboard</span>
                Rank Breakdown
            </p>
         </div>
         
         <div className="relative">
             {/* Horizontal Scroll Chips */}
             <div 
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex overflow-x-auto gap-2 px-5 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
             >
                 <RankChip label="State" rank={subject.ranks.state.rank} icon="map" />
                 <RankChip label="Batch" rank={subject.ranks.batch.rank} icon="group" />
                 <RankChip label="Section" rank={subject.ranks.section.rank} icon="class" />
                 <RankChip label="Program" rank={subject.ranks.program.rank} icon="school" />
                 <RankChip label="Course" rank={subject.ranks.course.rank} icon="local_library" />
                 <div className="w-2 flex-shrink-0"></div>
             </div>
             
             {/* Gradients */}
             <div className={`pointer-events-none absolute left-0 top-0 bottom-2 w-16 bg-gradient-to-r from-white via-white/90 to-transparent z-10 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
             {canScrollLeft && (
                <button onClick={scrollLeft} className="absolute left-2 top-[calc(50%-4px)] -translate-y-1/2 z-20 bg-white shadow-md border border-slate-100 rounded-full size-6 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
             )}
             <div className={`pointer-events-none absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-white via-white/90 to-transparent z-10 transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
             {canScrollRight && (
                <button onClick={scrollRight} className="absolute right-2 top-[calc(50%-4px)] -translate-y-1/2 z-20 bg-white shadow-md border border-slate-100 rounded-full size-6 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
             )}
         </div>
      </div>

      <div className="grid grid-rows-[1fr]">
        <div className="overflow-hidden min-h-0 bg-white border-t border-slate-50">
            
            {/* 1. CONTEXT BAR (4 Columns now, Time Added) */}
            <div className={`grid ${isOffline ? 'grid-cols-3' : 'grid-cols-4'} divide-x divide-slate-50 border-b border-slate-50 bg-white py-1`}>
                 <div className="p-3 text-center">
                    <p className="text-[9px] uppercase text-slate-400 font-bold mb-1 tracking-wide">Top Score</p>
                    <p className="text-sm font-bold text-slate-700">{subject.topperScore}</p>
                 </div>
                 <div className="p-3 text-center">
                    <p className="text-[9px] uppercase text-slate-400 font-bold mb-1 tracking-wide">Avg Score</p>
                    <p className="text-sm font-bold text-slate-700">{subject.averageScore}</p>
                 </div>
                 <div className="p-3 text-center">
                    <p className="text-[9px] uppercase text-slate-400 font-bold mb-1 tracking-wide">Attempt</p>
                    <p className="text-sm font-bold text-slate-700">
                        {attemptRate}%
                    </p>
                 </div>
                 {/* New Time Column (Only for Online) */}
                 {!isOffline && (
                    <div className="p-3 text-center">
                        <p className="text-[9px] uppercase text-slate-400 font-bold mb-1 tracking-wide">Time</p>
                        <p className="text-sm font-bold text-slate-700">{subject.timeSpent}</p>
                    </div>
                 )}
            </div>

            {/* 2. ATTEMPT & TIME DISTRIBUTION - MATCHED TO SCREENSHOT */}
            <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1.5 tracking-wider">
                        <span className="material-symbols-outlined text-base text-slate-300">{isOffline ? 'poll' : 'schedule'}</span>
                        {isOffline ? 'Attempt' : 'Attempt & Time'}
                    </p>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        {displayCounts.total} Questions
                    </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                    {/* Correct Card */}
                    <div className={`rounded-2xl bg-[#ecfdf5] p-3 flex flex-col ${isOffline ? 'justify-center gap-1' : 'justify-between h-36'} relative overflow-hidden border border-emerald-100/50`}>
                        {/* Header: Number Left, Tag Below (Vertical Stack) */}
                        <div className="flex flex-col items-start z-10 gap-0.5">
                            <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">{displayCounts.correct}</span>
                            <span className="text-emerald-700 text-[9px] font-extrabold uppercase">Correct</span>
                        </div>
                        
                        {!isOffline && (
                            <div className="z-10 mt-auto flex flex-col gap-3">
                                {/* Progress Bar */}
                                <div className="w-full h-1.5 bg-emerald-200/50 rounded-full">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(displayCounts.correct / displayCounts.total) * 100}%` }}></div>
                                </div>

                                {/* Time Stack */}
                                <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800 leading-tight">{subject.timeBreakdown.correct}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{formatSecondsToTime(correctAvgTime)} / Q</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Incorrect Card */}
                    <div className={`rounded-2xl bg-[#fff1f2] p-3 flex flex-col ${isOffline ? 'justify-center gap-1' : 'justify-between h-36'} relative overflow-hidden border border-rose-100/50`}>
                        <div className="flex flex-col items-start z-10 gap-0.5">
                            <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">{displayCounts.incorrect}</span>
                            <span className="text-rose-700 text-[9px] font-extrabold uppercase">Incorrect</span>
                        </div>
                        
                        {!isOffline && (
                            <div className="z-10 mt-auto flex flex-col gap-3">
                                <div className="w-full h-1.5 bg-rose-200/50 rounded-full">
                                    <div className="h-full bg-ref-red rounded-full transition-all duration-500" style={{ width: `${(displayCounts.incorrect / displayCounts.total) * 100}%` }}></div>
                                </div>

                                <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800 leading-tight">{subject.timeBreakdown.incorrect}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{formatSecondsToTime(incorrectAvgTime)} / Q</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Unattempted Card */}
                    <div className={`rounded-2xl bg-[#f8fafc] p-3 flex flex-col ${isOffline ? 'justify-center gap-1' : 'justify-between h-36'} relative overflow-hidden border border-slate-100`}>
                        <div className="flex flex-col items-start z-10 gap-0.5">
                            <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">{displayCounts.unattempted}</span>
                            <span className="text-slate-500 text-[9px] font-extrabold uppercase">Unattempted</span>
                        </div>
                        
                        {!isOffline && (
                            <div className="z-10 mt-auto flex flex-col gap-3">
                                <div className="w-full h-1.5 bg-slate-200 rounded-full">
                                    <div className="h-full bg-slate-400 rounded-full transition-all duration-500" style={{ width: `${(displayCounts.unattempted / displayCounts.total) * 100}%` }}></div>
                                </div>

                                <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800 leading-tight">{subject.timeBreakdown.unattempted}</span>
                                        <span className="text-[10px] font-bold text-slate-400">-</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. NEW CHAPTER INSIGHTS (Netflix Swimlanes) OR QUESTION TYPE CARDS */}
            <div className="border-b border-dashed border-slate-200 bg-white pt-4 pb-2">
                
                {/* Header with Toggle */}
                <div className="px-5 mb-5 flex justify-between items-center">
                     <h5 className="text-[11px] font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-base text-primary">
                            {viewMode === 'chapters' ? 'topic' : 'donut_large'}
                        </span>
                        Insights
                    </h5>

                    {/* Toggle Switch */}
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button 
                            onClick={() => setViewMode('chapters')}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                                viewMode === 'chapters' 
                                ? 'bg-white text-slate-800 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Chapters
                        </button>
                        <button 
                             onClick={() => setViewMode('types')}
                             className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                                viewMode === 'types' 
                                ? 'bg-white text-slate-800 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Q-Types
                        </button>
                    </div>
                </div>
                
                {viewMode === 'chapters' ? (
                    <div className="flex flex-col gap-2">
                        <SwimlaneRow 
                            title="Critical Attention Needed" 
                            chapters={subject.chapters.improve} 
                            variant="improve"
                            activeChapter={activeChapterFilter}
                            onSelect={handleChapterSelect}
                        />
                        <SwimlaneRow 
                            title="On the Edge" 
                            chapters={subject.chapters.good} 
                            variant="good"
                            activeChapter={activeChapterFilter}
                            onSelect={handleChapterSelect}
                        />
                        <SwimlaneRow 
                            title="Mastered Topics" 
                            chapters={subject.chapters.strong} 
                            variant="strong"
                            activeChapter={activeChapterFilter}
                            onSelect={handleChapterSelect}
                        />
                    </div>
                ) : (
                    <div className="px-5 flex flex-col gap-1 pb-4">
                        {questionTypeStats.map((stat) => (
                            <QuestionTypeCard key={stat.typeName} stat={stat} isOffline={isOffline} />
                        ))}
                    </div>
                )}
            </div>

            {/* 4. Behavior Analysis - Hidden in Offline Mode */}
            {subject.questionBehavior && !isOffline && (
                 <div className="px-5 py-6 border-b border-dashed border-slate-200 bg-white">
                    <h5 className="text-[11px] font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-base">psychology</span>
                        Behavior Analysis
                    </h5>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-xs">
                                <div>
                                    <span className="text-slate-600 block font-medium">Fast Incorrects</span>
                                    <span className="text-[10px] text-slate-400">Rushed mistakes</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-medium text-slate-400">
                                        avg {subject.questionBehavior.fastIncorrectAvgTime}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-ref-red" style={{ width: `${(subject.questionBehavior.fastIncorrect / 15) * 100}%` }}></div>
                                        </div>
                                        <span className="font-bold text-ref-red w-4 text-right">{subject.questionBehavior.fastIncorrect}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-2">
                                <div>
                                    <span className="text-slate-600 block font-medium">Slow Incorrects</span>
                                    <span className="text-[10px] text-slate-400">Time traps</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-medium text-slate-400">
                                        avg {subject.questionBehavior.slowIncorrectAvgTime}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-400" style={{ width: `${(subject.questionBehavior.slowIncorrect / 15) * 100}%` }}></div>
                                        </div>
                                        <span className="font-bold text-orange-500 w-4 text-right">{subject.questionBehavior.slowIncorrect}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-2">
                                <div>
                                    <span className="text-slate-600 block font-medium">Unattempted Time</span>
                                    <span className="text-[10px] text-slate-400">Time spent with 0 marks</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-500">{subject.questionBehavior.unattemptedTimeWasted}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

            {/* 5. Detailed Question Grid */}
            <div className="px-5 pt-6 pb-4 bg-white">
                <h5 className="text-[11px] font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-base">grid_view</span>
                    Detailed Performance
                </h5>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    {subject.questions.map((q) => (
                         <div 
                            key={q.id} 
                            className={`size-8 rounded ${getResultColor(q.result)} text-xs font-bold flex items-center justify-center shadow-sm relative group cursor-pointer hover:ring-2 hover:ring-offset-1 hover:-translate-y-0.5 transition-all duration-200`}
                         >
                             {q.id}
                             {/* Hybrid Tooltip - Custom Chip for Chapter */}
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max pointer-events-none hidden sm:block z-50">
                                {/* Custom Chip: Chapter (Context) */}
                                <div className="mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out">
                                    <div className="bg-white border border-slate-100 text-slate-500 text-[10px] font-medium px-2.5 py-1 rounded shadow-sm whitespace-nowrap">
                                        {q.chapter || 'Unknown Topic'}
                                    </div>
                                </div>
                             </div>

                             {/* Custom Solution Tooltip (Delay 700ms) - Positioned Below */}
                             <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-slate-500 text-white text-[9px] rounded shadow-lg whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-hover:delay-700">
                                Click to view solution
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-b-slate-500"></div>
                             </div>
                         </div>
                    ))}
                    {[...Array(5)].map((_, i) => (
                        <div key={`mock-${i}`} className="size-8 rounded bg-slate-100 text-slate-300 text-xs font-bold flex items-center justify-center cursor-default">
                            •
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => {
                        setShowQuestionTable(!showQuestionTable);
                        if (!showQuestionTable) {
                            setTimeout(() => {
                                tableContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                        }
                    }}
                    className="w-full py-2.5 mt-2 flex items-center justify-center gap-2 text-xs font-bold text-primary border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    {showQuestionTable ? 'Hide Questions' : 'View all questions'}
                    <span className={`material-symbols-outlined text-lg transition-transform duration-200 ${showQuestionTable ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
            </div>

            {showQuestionTable && (
                <div ref={tableContainerRef} className="border-t border-slate-100 bg-slate-50/50 p-4 animate-in slide-in-from-top-2 fade-in duration-200 scroll-mt-20">
                    
                    {/* New Control Bar: Two Dropdowns */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        {/* Status Select */}
                        <div className="relative">
                            <select
                                value={activeFilter}
                                onChange={(e) => setActiveFilter(e.target.value as 'All' | Status)}
                                className="w-full appearance-none bg-white text-slate-700 text-xs font-bold border border-slate-200 rounded-lg py-2.5 pl-3 pr-8 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            >
                                <option value="All">All Questions</option>
                                <option value={Status.Correct}>Correct</option>
                                <option value={Status.Incorrect}>Incorrect</option>
                                <option value={Status.Unattempted}>Unattempted</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined text-lg">expand_more</span>
                            </div>
                        </div>

                        {/* Chapter Select */}
                        <div className="relative">
                            <select
                                value={activeChapterFilter || ''}
                                onChange={(e) => setActiveChapterFilter(e.target.value || null)}
                                className="w-full appearance-none bg-white text-slate-700 text-xs font-bold border border-slate-200 rounded-lg py-2.5 pl-3 pr-8 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            >
                                <option value="">All Chapters</option>
                                {uniqueChapters.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined text-lg">expand_more</span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-[11px]">
                                <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0 z-10 shadow-sm">
                                    <tr className="border-b border-slate-100">
                                        <th className="p-3 w-16">Q#</th>
                                        <th className="p-3">Chapter</th>
                                        <th className="p-3 text-center">Status</th>
                                        <th className="p-3 text-right">Marks</th>
                                        {!isOffline && <th className="p-3 text-right">Time (vs Peer)</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredQuestions.map((q) => {
                                        // Simple comparison logic for time coloring
                                        const myTimeSec = parseTimeStringToSeconds(q.timeSpent);
                                        const peerTimeSec = parseTimeStringToSeconds(q.avgPeerTime);
                                        const isSlow = myTimeSec > (peerTimeSec * 1.5);

                                        return (
                                        <tr key={q.id} className="hover:bg-slate-50/80 transition-colors group relative cursor-pointer border-b border-slate-50 last:border-0">
                                            {/* Q# Column with Side Tooltip */}
                                            <td className="p-3 w-16 relative">
                                                <div className="relative inline-block">
                                                    <span className="font-bold text-slate-700 group-hover:text-primary group-hover:underline transition-colors">
                                                        Q{q.id}
                                                    </span>
                                                    
                                                    {/* Tooltip: Right side bubble */}
                                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-slate-600 text-white text-[10px] font-medium rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 flex items-center">
                                                         {/* Arrow pointing left */}
                                                         <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-600"></div>
                                                         Click to view solution
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="p-3 text-slate-600 font-medium">{q.chapter || '-'}</td>
                                            
                                            {/* Status Column with Icons */}
                                            <td className="p-3 text-center">
                                                <div className="flex justify-center">
                                                    {q.result === Status.Correct && (
                                                        <span className="material-symbols-outlined text-xl text-emerald-600">check_circle</span>
                                                    )}
                                                    {q.result === Status.Incorrect && (
                                                        <span className="material-symbols-outlined text-xl text-red-500">close</span>
                                                    )}
                                                    {q.result === Status.Unattempted && (
                                                        <span className="text-slate-300 font-bold text-lg leading-none">—</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-3 text-right">
                                                <span className={`font-bold text-xs ${
                                                    q.marks > 0 ? 'text-emerald-600' : 
                                                    q.marks < 0 ? 'text-red-500' : 'text-slate-400'
                                                }`}>
                                                    {q.marks}
                                                </span>
                                            </td>

                                            {/* Time Column (Online Only) */}
                                            {!isOffline && (
                                                <td className="p-3 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className={`font-bold text-xs ${isSlow ? 'text-amber-600' : 'text-slate-700'}`}>
                                                            {q.timeSpent}
                                                        </span>
                                                        <span className="text-[9px] text-slate-400">
                                                            vs {q.avgPeerTime}
                                                        </span>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};