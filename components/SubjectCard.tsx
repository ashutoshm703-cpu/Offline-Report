
import React, { useState, useRef, useEffect } from 'react';
import { SubjectData, SubjectStatus, Status, ChapterStat } from '../types';

// Compact Poster Component for Netflix-style Swimlanes
const ChapterPoster = ({ 
    chapter, 
    variant, 
    isActive, 
    onSelect 
}: { 
    chapter: ChapterStat, 
    variant: 'improve' | 'good' | 'strong', 
    isActive: boolean, 
    onSelect: (name: string) => void 
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
    const strokeWidth = 4; // Thicker for better visibility
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

                {/* Question Count Badge */}
                <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold border border-transparent ${styles.badgeBg} ${styles.badgeText}`}>
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

// Independent Scrollable Swimlane Row Component
const SwimlaneRow = ({ 
    title, 
    chapters, 
    variant, 
    activeChapter, 
    onSelect 
}: { 
    title: string, 
    chapters: ChapterStat[], 
    variant: 'improve' | 'good' | 'strong',
    activeChapter: string | null,
    onSelect: (name: string) => void
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
                {/* Scroll Buttons - Visible on Desktop Hover */}
                {canScrollLeft && (
                    <button 
                        onClick={scrollLeft} 
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur shadow-md border border-slate-100 rounded-full size-7 flex items-center justify-center text-slate-500 hover:text-primary transition-all hidden sm:flex"
                    >
                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                )}
                {canScrollRight && (
                    <button 
                        onClick={scrollRight} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur shadow-md border border-slate-100 rounded-full size-7 flex items-center justify-center text-slate-500 hover:text-primary transition-all hidden sm:flex"
                    >
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                )}

                {/* Fade Gradients */}
                <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

                <div 
                    ref={rowScrollRef}
                    onScroll={checkScroll}
                    className="flex overflow-x-auto gap-3 px-5 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
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

  const getResultIcon = (result: Status) => {
    switch(result) {
      case Status.Correct: return 'check_circle';
      case Status.Incorrect: return 'close';
      default: return 'remove';
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

             {/* Right: Diagnostics Grid (Zone B) - AIR | Accuracy | Time */}
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

                {/* Time (Conditional) */}
                {!isOffline && (
                   <>
                    <div className="w-px h-8 bg-slate-100"></div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-bold text-slate-400 tracking-wider">TIME</span>
                       <span className="text-lg font-bold text-slate-700">{subject.timeSpent}</span>
                    </div>
                   </>
                )}
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
            
            {/* 1. CONTEXT BAR (3 Columns) */}
            <div className="grid grid-cols-3 divide-x divide-slate-50 border-b border-slate-50 bg-white py-1">
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
                        {attemptRate}% <span className="text-[10px] text-slate-400 font-medium ml-0.5">({attemptedCount}/{displayCounts.total})</span>
                    </p>
                 </div>
            </div>

            {/* 2. ATTEMPT & TIME DISTRIBUTION */}
            <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1.5 tracking-wider">
                        <span className="material-symbols-outlined text-base text-slate-300">{isOffline ? 'poll' : 'schedule'}</span>
                        {isOffline ? 'Attempt' : 'Attempt & Time'}
                    </p>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        {displayCounts.total} Qs
                    </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                    {/* Correct Badge */}
                    <div className="p-2 rounded-lg bg-[#F0FDF4] border border-emerald-100/60">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="size-1.5 rounded-full bg-ref-green shrink-0"></span>
                            <span className="text-[9px] font-bold text-green-700 uppercase tracking-wide truncate">Correct</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                             <span className="text-base font-bold text-slate-800 leading-none">
                                {displayCounts.correct}
                                <span className="text-[10px] text-slate-500 font-medium ml-0.5">Qs</span>
                             </span>
                             {!isOffline && (
                                <span className="text-[9px] font-medium text-emerald-600/80">{subject.timeBreakdown.correct}</span>
                             )}
                        </div>
                    </div>

                    {/* Incorrect Badge */}
                    <div className="p-2 rounded-lg bg-[#FEF2F2] border border-red-100/60">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="size-1.5 rounded-full bg-ref-red shrink-0"></span>
                            <span className="text-[9px] font-bold text-red-700 uppercase tracking-wide truncate">Incorrect</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                             <span className="text-base font-bold text-slate-800 leading-none">
                                {displayCounts.incorrect}
                                <span className="text-[10px] text-slate-500 font-medium ml-0.5">Qs</span>
                             </span>
                             {!isOffline && (
                                <span className="text-[9px] font-medium text-red-600/80">{subject.timeBreakdown.incorrect}</span>
                             )}
                        </div>
                    </div>

                    {/* Unattempted Badge */}
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="size-1.5 rounded-full bg-slate-400 shrink-0"></span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide truncate">Unattempted</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                             <span className="text-base font-bold text-slate-800 leading-none">
                                {displayCounts.unattempted}
                                <span className="text-[10px] text-slate-500 font-medium ml-0.5">Qs</span>
                             </span>
                             {!isOffline && (
                                <span className="text-[9px] font-medium text-slate-400">{subject.timeBreakdown.unattempted}</span>
                             )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. NEW CHAPTER INSIGHTS (Netflix Swimlanes) */}
            <div className="border-b border-dashed border-slate-200 bg-white pt-4 pb-2">
                <h5 className="px-5 text-[11px] font-bold text-slate-700 mb-5 flex items-center gap-2 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-base text-primary">topic</span>
                    Chapter Insights
                </h5>
                
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
                                    <tr className="border-b border-slate-100 bg-slate-50">
                                        <th className="pl-4 pr-1 py-3 text-left w-[10%] whitespace-nowrap">Q#</th>
                                        <th className={`px-2 py-3 text-left ${isOffline ? 'w-[50%]' : 'w-[30%]'}`}>Chapter</th>
                                        <th className={`px-1 py-3 text-center ${isOffline ? 'w-[20%]' : 'w-[15%]'}`}>Status</th>
                                        <th className={`px-1 py-3 text-center ${isOffline ? 'w-[20%]' : 'w-[15%]'}`}>Marks</th>
                                        {/* Conditionally Render Time Headers */}
                                        {!isOffline && <th className="px-1 py-3 text-right w-[15%] whitespace-nowrap">Time</th>}
                                        {!isOffline && <th className="pl-1 pr-4 py-3 text-right w-[15%] whitespace-nowrap text-[10px] leading-tight text-slate-400">Peer<br/>Avg</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredQuestions.length > 0 ? (
                                        filteredQuestions.map((q) => (
                                            <tr key={q.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer group">
                                                <td className="pl-4 pr-1 py-2.5 align-middle text-left relative">
                                                    {/* Tooltip Wrapper */}
                                                    <div className="inline-block relative group/tooltip">
                                                        <span 
                                                            className="font-bold text-slate-700 hover:text-primary hover:underline hover:underline-offset-4 transition-colors cursor-pointer"
                                                        >
                                                            Q{q.id}
                                                        </span>
                                                        {/* Custom Tooltip - Right Side, Delayed */}
                                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-1.5 px-1.5 py-0.5 bg-slate-500 text-white text-[9px] rounded shadow-lg whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 group-hover/tooltip:delay-700">
                                                            Click to view solution
                                                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[3px] border-transparent border-r-slate-500"></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2.5 align-middle">
                                                    <span className="text-[10px] font-medium text-slate-600 leading-tight block line-clamp-2">
                                                        {q.chapter || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-1 py-2.5 text-center align-middle">
                                                    <span className={`material-symbols-outlined text-base ${q.result === Status.Correct ? 'text-ref-green-dark' : q.result === Status.Incorrect ? 'text-ref-red' : 'text-slate-300'}`}>
                                                        {getResultIcon(q.result)}
                                                    </span>
                                                </td>
                                                <td className={`px-1 py-2.5 text-center font-bold align-middle ${q.marks > 0 ? 'text-ref-green-dark' : q.marks < 0 ? 'text-ref-red' : 'text-slate-400'}`}>
                                                    {q.marks > 0 ? '+' : ''}{q.marks}
                                                </td>
                                                {/* Conditionally Render Time Data */}
                                                {!isOffline && (
                                                    <td className="px-1 py-2.5 text-right font-medium text-slate-600 align-middle whitespace-nowrap">
                                                        {q.timeSpent}
                                                    </td>
                                                )}
                                                {!isOffline && (
                                                    <td className="pl-1 pr-4 py-2.5 text-right text-slate-400 align-middle whitespace-nowrap">{q.avgPeerTime}</td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={isOffline ? 4 : 6} className="px-4 py-8 text-center text-slate-400 italic">
                                                No questions found for this filter.
                                            </td>
                                        </tr>
                                    )}
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
