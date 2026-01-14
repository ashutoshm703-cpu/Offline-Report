
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SubjectData, SubjectStatus, Status, ChapterStat } from '../types';

interface ChapterRowProps {
  chapter: ChapterStat;
  activeChapterFilter: string | null;
  onSelect: (chapterName: string) => void;
}

const ChapterRow: React.FC<ChapterRowProps> = ({ chapter, activeChapterFilter, onSelect }) => (
  <div className="flex items-start justify-between py-2 text-xs border-b border-white/10 last:border-0 group">
      <div className="font-medium truncate pr-2 flex flex-col">
          <span>{chapter.name}</span>
          <div className="flex items-center gap-2 whitespace-nowrap text-[10px] opacity-90 mt-0.5">
              <span className="font-bold">{chapter.total} Qs</span>
              <span className="flex items-center gap-0.5"><span className="size-1 bg-white rounded-full"></span> {chapter.correct} Correct</span>
              <span className="flex items-center gap-0.5"><span className="size-1 bg-white/60 rounded-full"></span> {chapter.incorrect} Incorrect</span>
          </div>
      </div>
      <div className="relative flex items-center group/btn">
          <button 
              onClick={() => onSelect(chapter.name)}
              className={`text-[10px] font-bold transition-colors px-2 py-1 rounded flex items-center gap-1 ${activeChapterFilter === chapter.name ? 'bg-white text-slate-800 shadow-sm' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
              {activeChapterFilter === chapter.name ? 'Active' : 'View Qs'}
              <span className="material-symbols-outlined text-xs">{activeChapterFilter === chapter.name ? 'check' : 'arrow_forward'}</span>
          </button>
      </div>
  </div>
);

interface SubjectCardProps {
  subject: SubjectData;
  isOffline?: boolean;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, isOffline = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuestionTable, setShowQuestionTable] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | Status>('All');
  const [activeChapterFilter, setActiveChapterFilter] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Ref for auto-scrolling to table
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Custom styling based on subject status for visual variety
  // Master UI: Square Icon with Borders
  let iconBg = 'bg-slate-50 text-slate-500 border border-slate-200';
  let borderColor = 'border-slate-100';
  
  if (subject.name === 'Biology') {
      iconBg = 'bg-red-50 text-red-600 border border-red-100';
      borderColor = isExpanded ? 'border-l-4 border-l-ref-red' : '';
  } else if (subject.name === 'Physics') {
      iconBg = 'bg-yellow-50 text-yellow-600 border border-yellow-100';
      borderColor = isExpanded ? 'border-l-4 border-l-ref-yellow' : '';
  } else if (subject.name === 'Chemistry') {
      iconBg = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      borderColor = isExpanded ? 'border-l-4 border-l-ref-green' : '';
  }

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

  // TIME PARSING UTILS
  const parseTimeToSeconds = (timeStr: string) => {
    let totalSeconds = 0;
    const hours = timeStr.match(/(\d+)h/);
    const minutes = timeStr.match(/(\d+)m/);
    const seconds = timeStr.match(/(\d+)s/);
    
    if (hours) totalSeconds += parseInt(hours[1]) * 3600;
    if (minutes) totalSeconds += parseInt(minutes[1]) * 60;
    if (seconds) totalSeconds += parseInt(seconds[1]);
    
    return totalSeconds;
  };

  const formatSeconds = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '0s';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 && h === 0) parts.push(`${s}s`);
    if (parts.length === 0) return '0s';
    return parts.join(' ');
  };

  const getAvgTime = (totalTimeStr: string, count: number) => {
    if (count === 0) return '-';
    const totalSeconds = parseTimeToSeconds(totalTimeStr);
    const avgSeconds = totalSeconds / count;
    return formatSeconds(avgSeconds);
  };

  // Calculate percentages for bars
  const totalTimeSeconds = parseTimeToSeconds(subject.timeSpent) || 1;
  const correctTimeSeconds = parseTimeToSeconds(subject.timeBreakdown.correct);
  const incorrectTimeSeconds = parseTimeToSeconds(subject.timeBreakdown.incorrect);
  const unattemptedTimeSeconds = parseTimeToSeconds(subject.timeBreakdown.unattempted);
  
  const correctTimePercent = Math.round((correctTimeSeconds / totalTimeSeconds) * 100);
  const incorrectTimePercent = Math.round((incorrectTimeSeconds / totalTimeSeconds) * 100);
  const unattemptedTimePercent = Math.round((unattemptedTimeSeconds / totalTimeSeconds) * 100);

  // New calculation for Attempt Rate
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

  const handleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    // Smooth scroll back to card top to maintain context
    setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  return (
    <div 
        ref={cardRef}
        className={`bg-white rounded-xl border border-slate-100 shadow-soft overflow-visible transition-all duration-300 ${isExpanded ? `border-y border-r ${borderColor} my-3` : 'hover:bg-slate-50'}`}
    >
      {/* HEADER: Boxed Metrics with Intrinsic Sizing (Flex) */}
      <div 
        className="p-4 cursor-pointer bg-white rounded-xl relative z-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
            {/* 1. Icon Anchor */}
            <div className={`size-10 rounded-lg flex shrink-0 items-center justify-center font-bold text-lg ${iconBg}`}>
                {subject.name.charAt(0)}
            </div>

            {/* 2. Structured Content */}
            <div className="flex-1 min-w-0 pt-0.5">
                
                {/* Row 1: Name and Primary Score */}
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight">{subject.name}</h4>
                    <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-slate-900">{subject.score}</span>
                        <span className="text-[10px] text-slate-400 font-medium">/ {subject.totalMarks}</span>
                    </div>
                </div>

                {/* Row 2: Metrics Flex - Use flex to hug content instead of grid stretching */}
                <div className="flex flex-row items-center gap-2">
                    {/* Rank */}
                    <div className="bg-slate-50 border border-slate-100 rounded-md py-1.5 px-3 flex items-center gap-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rank</span>
                         <span className="text-xs font-bold text-slate-700">#{subject.subjectAir}</span>
                    </div>

                    {/* Time (Conditional) */}
                    {!isOffline && (
                        <div className="bg-slate-50 border border-slate-100 rounded-md py-1.5 px-3 flex items-center gap-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</span>
                             <span className="text-xs font-bold text-slate-700">{subject.timeSpent}</span>
                        </div>
                    )}

                    {/* Accuracy */}
                    <div className="bg-slate-50 border border-slate-100 rounded-md py-1.5 px-3 flex items-center gap-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
                         <span className={`text-xs font-bold ${subject.accuracy < 75 ? 'text-ref-red' : subject.accuracy >= 90 ? 'text-ref-green-dark' : 'text-slate-700'}`}>
                            {Math.round(subject.accuracy)}%
                         </span>
                    </div>
                </div>
            </div>

            {/* Expand Chevron */}
            <div className="mt-1 flex items-start pl-1">
                 <span className={`material-symbols-outlined text-slate-300 text-lg transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    expand_more
                 </span>
            </div>
        </div>
      </div>

      <div 
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
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

            {/* 2. ATTEMPT & TIME DISTRIBUTION - VISUAL BADGES (COMPACT) */}
            <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1.5 tracking-wider">
                        <span className="material-symbols-outlined text-base text-slate-300">{isOffline ? 'poll' : 'schedule'}</span>
                        {isOffline ? 'Attempt Details' : 'Attempt & Time'}
                    </p>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        {displayCounts.total} Questions
                    </span>
                </div>
                
                {/* Visual Grid Layout - Compact Badges */}
                <div className="grid grid-cols-3 gap-2">
                    {/* Correct Badge */}
                    <div className="p-2 rounded-lg bg-[#F0FDF4] border border-emerald-100/60">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="size-1.5 rounded-full bg-ref-green shrink-0"></span>
                            <span className="text-[9px] font-bold text-green-700 uppercase tracking-wide truncate">Correct</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                             <span className="text-base font-bold text-slate-800 leading-none">{displayCounts.correct}</span>
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
                             <span className="text-base font-bold text-slate-800 leading-none">{displayCounts.incorrect}</span>
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
                             <span className="text-base font-bold text-slate-800 leading-none">{displayCounts.unattempted}</span>
                             {!isOffline && (
                                <span className="text-[9px] font-medium text-slate-400">{subject.timeBreakdown.unattempted}</span>
                             )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Chapter Insights */}
            <div className="px-5 py-6 border-b border-dashed border-slate-200 bg-white">
                <h5 className="text-[11px] font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-base">topic</span>
                    Chapter Insights
                </h5>
                <div className="flex flex-col gap-3">
                    {subject.chapters.strong.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
                            </div>
                            <div className="relative z-10 text-white p-4">
                                <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90 border-b border-white/20 pb-1">Strong Chapters</p>
                                <div className="flex flex-col">
                                    {subject.chapters.strong.map((c, i) => (
                                        <ChapterRow 
                                            key={i} 
                                            chapter={c} 
                                            activeChapterFilter={activeChapterFilter} 
                                            onSelect={handleChapterSelect} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {subject.chapters.good.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 shadow-sm">
                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                <span className="material-symbols-outlined text-white text-4xl">thumb_up</span>
                            </div>
                            <div className="relative z-10 text-white p-4">
                                <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90 border-b border-white/20 pb-1">Good Chapters</p>
                                <div className="flex flex-col">
                                    {subject.chapters.good.map((c, i) => (
                                        <ChapterRow 
                                            key={i} 
                                            chapter={c} 
                                            activeChapterFilter={activeChapterFilter} 
                                            onSelect={handleChapterSelect} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {subject.chapters.improve.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 shadow-sm">
                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                <span className="material-symbols-outlined text-white text-4xl">error</span>
                            </div>
                            <div className="relative z-10 text-white p-4">
                                <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90 border-b border-white/20 pb-1">Needs Improvement</p>
                                <div className="flex flex-col">
                                    {subject.chapters.improve.map((c, i) => (
                                        <ChapterRow 
                                            key={i} 
                                            chapter={c} 
                                            activeChapterFilter={activeChapterFilter} 
                                            onSelect={handleChapterSelect} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
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
                            className={`size-8 rounded ${getResultColor(q.result)} text-xs font-bold flex items-center justify-center cursor-default shadow-sm relative group`}
                            title={`Q${q.id}: ${q.result}`}
                         >
                             {q.id}
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 hidden sm:block">
                                {q.chapter || 'Unknown Topic'}
                             </div>
                         </div>
                    ))}
                    {[...Array(5)].map((_, i) => (
                        <div key={`mock-${i}`} className="size-8 rounded bg-slate-100 text-slate-300 text-xs font-bold flex items-center justify-center cursor-default">
                            •
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-ref-green"></span> Correct</div>
                    <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-ref-red"></span> Incorrect</div>
                    <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-ref-gray"></span> Unattempted</div>
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
                                            <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="pl-4 pr-1 py-2.5 align-middle text-left">
                                                    <span className="font-bold text-slate-700">Q{q.id}</span>
                                                </td>
                                                <td className="px-2 py-2.5 align-middle">
                                                    <span className="text-[10px] font-medium text-slate-600 leading-tight block line-clamp-2" title={q.chapter}>
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
      
      {/* FLOATING COLLAPSE ACTION BUTTON (FAB) */}
      {isExpanded && mounted && createPortal(
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
            <button 
                onClick={handleCollapse}
                className="flex items-center gap-2 bg-white text-slate-700 pl-4 pr-5 py-3 rounded-full shadow-xl hover:bg-slate-50 active:scale-95 transition-all border border-slate-200"
            >
                <span className="material-symbols-outlined text-xl text-slate-400">unfold_less</span>
                <span className="text-xs font-bold uppercase tracking-wide">Close</span>
            </button>
        </div>,
        document.body
      )}
    </div>
  );
};
