
import React, { useState } from 'react';
import { TEST_DATA } from './constants';
import { SubjectCard } from './components/SubjectCard';

const App: React.FC = () => {
  const data = TEST_DATA;
  const [activeSubject, setActiveSubject] = useState(data.subjects[0].name);

  const activeSubjectData = data.subjects.find(s => s.name === activeSubject) || data.subjects[0];

  return (
    <div className="bg-background-light min-h-screen text-text-dark pb-12 font-sans selection:bg-blue-100">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-colors">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
            <div className="flex items-center gap-3">
                <button className="flex items-center justify-center size-8 rounded-full hover:bg-slate-50 transition-colors text-slate-700">
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>
                <h2 className="text-slate-800 text-lg font-bold tracking-tight">Report</h2>
            </div>
            <button className="text-primary hover:text-blue-700 text-sm font-semibold transition-colors">
                View Solutions
            </button>
        </div>
      </div>

      <div className="px-4 pt-6 flex flex-col gap-6 max-w-md mx-auto w-full relative">
        
        {/* Title Section */}
        <div>
            <h1 className="text-2xl font-bold text-slate-800">{data.meta.testName}</h1>
            <p className="text-sm text-slate-500 mt-1">{data.meta.date} • Detailed analysis</p>
        </div>

        {/* Score Card with Integrated Benchmark & AIR */}
        <div className="flex flex-col rounded-2xl bg-white p-6 shadow-soft border border-slate-100">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Score</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-slate-800 tracking-tight">{data.snapshot.score}</span>
                        <span className="text-lg text-slate-400 font-medium">/{data.snapshot.totalScore}</span>
                    </div>
                </div>
            </div>
            
            {/* Key Stats Grid: AIR, Percentile, Accuracy */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-5">
                 <div className="flex flex-col gap-1">
                    <p className="text-xs text-slate-500 font-medium">AIR</p>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-amber-500">emoji_events</span>
                        <p className="text-xl font-bold text-slate-800">
                            #{data.competition.air}
                            <span className="text-xs text-slate-400 font-medium ml-1">/ {data.snapshot.totalStudents}</span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-1 border-l border-slate-50 pl-4">
                    <p className="text-xs text-slate-500 font-medium">Percentile</p>
                    <p className="text-xl font-bold text-primary">{data.snapshot.percentile}%</p>
                </div>
                <div className="flex flex-col gap-1 border-l border-slate-50 pl-4">
                    <p className="text-xs text-slate-500 font-medium">Accuracy</p>
                    <p className={`text-xl font-bold ${data.snapshot.accuracy < 70 ? 'text-ref-red' : 'text-ref-yellow'}`}>{data.snapshot.accuracy}%</p>
                </div>
            </div>

            {/* Integrated Benchmark Section with Average */}
            <div className="mt-6 pt-6 border-t border-slate-50">
                <p className="text-[10px] uppercase text-slate-400 font-bold mb-8">Score Benchmark</p>
                <div className="relative px-2 mb-4">
                    <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-slate-200 -translate-y-1/2"></div>
                    <div className="relative flex justify-between items-center h-8">
                        {/* Low */}
                        <div className="flex flex-col items-center absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 group">
                            <span className="material-symbols-outlined text-red-400 bg-white px-1 text-xl relative z-10">arrow_drop_down</span>
                            <div className="absolute top-6 flex flex-col items-center w-16">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Low</span>
                                <span className="text-xs font-bold text-slate-600">{data.benchmarking.lowest}</span>
                            </div>
                        </div>

                         {/* Average - Added */}
                         <div 
                            className="flex flex-col items-center absolute top-1/2 -translate-y-1/2 z-10"
                            style={{ left: `${((data.benchmarking.average - data.benchmarking.lowest) / (data.benchmarking.highest - data.benchmarking.lowest)) * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                        >
                            <div className="size-2.5 bg-slate-300 rounded-full border-2 border-white shadow-sm relative z-10"></div>
                            <div className="absolute top-6 flex flex-col items-center w-16">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Avg</span>
                                <span className="text-xs font-bold text-slate-500">{data.benchmarking.average}</span>
                            </div>
                        </div>

                        {/* User Position */}
                        <div 
                            className="flex flex-col items-center absolute top-1/2 -translate-y-1/2 z-20"
                            style={{ left: `${((data.benchmarking.user - data.benchmarking.lowest) / (data.benchmarking.highest - data.benchmarking.lowest)) * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                        >
                            <div className="bg-ref-green/20 p-1 rounded-full backdrop-blur-sm">
                                <div className="size-4 bg-ref-green rounded-full border-2 border-white shadow-sm"></div>
                            </div>
                            <div className="absolute -top-9 flex flex-col items-center w-20">
                                <span className="bg-ref-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">You</span>
                                <span className="text-sm font-bold text-ref-green-dark">{data.benchmarking.user}</span>
                            </div>
                        </div>

                        {/* High */}
                        <div className="flex flex-col items-center absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2">
                            <span className="material-symbols-outlined text-slate-400 bg-white px-1 text-lg relative z-10">flag</span>
                            <div className="absolute top-6 flex flex-col items-center w-16">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">High</span>
                                <span className="text-xs font-bold text-slate-600">{data.benchmarking.highest}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed Rank Analysis */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">trophy</span>
                Rank Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">State</p>
                    <p className="text-lg font-bold text-slate-600">{data.competition.stateRank}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">City</p>
                    <p className="text-lg font-bold text-slate-600">{data.competition.cityRank}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Batch</p>
                    <p className="text-lg font-bold text-slate-600">{data.competition.batchRank}</p>
                </div>
            </div>
        </div>

        {/* Unified Strategy & Efficiency Card */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-slate-500">
                        {data.isOffline ? 'poll' : 'timelapse'}
                    </span>
                    {data.isOffline ? 'Attempt' : 'Attempt & Time'}
                </h3>
                
                <div className="flex items-center gap-3">
                     <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        {data.usage.total} Qs
                    </span>
                    {!data.isOffline && (
                        <div className="flex items-baseline gap-1.5 pl-2 border-l border-slate-100">
                            <span className="text-sm font-bold text-slate-800">{data.time.totalUsed}</span>
                            <span className="text-xs text-slate-400 font-medium">/ {data.time.allowed}</span>
                        </div>
                    )}
                </div>
            </div>

            {data.isOffline ? (
                // Offline View: Compact Clean Row
                <div className="flex flex-col gap-5 pt-2">
                    {/* 1. Visual Distribution Bar */}
                    <div className="w-full h-2.5 flex rounded-full overflow-hidden bg-slate-100">
                        <div className="bg-ref-green" style={{ width: `${(data.usage.correct / data.usage.total) * 100}%` }}></div>
                        <div className="bg-ref-red" style={{ width: `${(data.usage.incorrect / data.usage.total) * 100}%` }}></div>
                        {/* Remaining space is implicitly unattempted/slate-100 background */}
                    </div>

                    {/* 2. Minimal Stats Row - Cleaner Look */}
                    <div className="flex items-center justify-between px-2">
                        {/* Correct */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-ref-green"></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correct</span>
                            </div>
                            <span className="text-xl font-bold text-slate-800 leading-none">
                                {data.usage.correct}
                                <span className="text-[10px] text-slate-400 font-medium ml-1">Qs</span>
                            </span>
                        </div>

                        {/* Incorrect */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-ref-red"></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incorrect</span>
                            </div>
                            <span className="text-xl font-bold text-slate-800 leading-none">
                                {data.usage.incorrect}
                                <span className="text-[10px] text-slate-400 font-medium ml-1">Qs</span>
                            </span>
                        </div>

                        {/* Unattempted */}
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-slate-300"></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unattempted</span>
                            </div>
                            <span className="text-xl font-bold text-slate-800 leading-none">
                                {data.usage.unattempted}
                                <span className="text-[10px] text-slate-400 font-medium ml-1">Qs</span>
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                // Online View: Matrix View
                <div className="flex flex-col gap-3">
                    {/* Header Row - ADJUSTED GRID COLS (5-4-3) */}
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase text-slate-400 px-3 border-b border-slate-50 pb-2">
                        <div className="col-span-5">Status</div>
                        <div className="col-span-4">Time</div>
                        <div className="col-span-3 text-right">Avg Speed</div>
                    </div>

                    {/* Correct Row - Cleaner White Card Style */}
                    <div className="grid grid-cols-12 gap-2 items-center bg-white rounded-lg p-2 border border-slate-100 shadow-sm border-l-[3px] border-l-ref-green">
                        <div className="col-span-5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-ref-green-dark">check_circle</span>
                                <div>
                                    <span className="block text-xl font-bold text-slate-800 leading-none">
                                        {data.usage.correct} <span className="text-[10px] font-medium text-slate-400">Qs</span>
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Correct</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4">
                            <div className="flex flex-col justify-center h-full">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-xs font-bold text-slate-700">{data.time.breakdown.correct}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-ref-green" style={{ width: `${data.time.correctTimePercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 text-right">
                            <span className="text-xs font-bold text-slate-600">{data.time.avgBreakdown.correct}</span>
                            <span className="block text-[10px] text-slate-400">per Q</span>
                        </div>
                    </div>

                    {/* Incorrect Row - Cleaner White Card Style */}
                    <div className="grid grid-cols-12 gap-2 items-center bg-white rounded-lg p-2 border border-slate-100 shadow-sm border-l-[3px] border-l-ref-red">
                        <div className="col-span-5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-ref-red">cancel</span>
                                <div>
                                    <span className="block text-xl font-bold text-slate-800 leading-none">
                                        {data.usage.incorrect} <span className="text-[10px] font-medium text-slate-400">Qs</span>
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Incorrect</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4">
                            <div className="flex flex-col justify-center h-full">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-xs font-bold text-slate-700">{data.time.breakdown.incorrect}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-ref-red" style={{ width: `${data.time.incorrectTimePercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 text-right">
                            <span className="text-xs font-bold text-ref-red-dark">{data.time.avgBreakdown.incorrect}</span>
                            <span className="block text-[10px] text-slate-400">per Q</span>
                        </div>
                    </div>

                    {/* Unattempted Row - Cleaner White Card Style */}
                    <div className="grid grid-cols-12 gap-2 items-center bg-white rounded-lg p-2 border border-slate-100 shadow-sm border-l-[3px] border-l-slate-300">
                        <div className="col-span-5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-slate-400">do_not_disturb_on</span>
                                <div>
                                    <span className="block text-xl font-bold text-slate-800 leading-none">
                                        {data.usage.unattempted} <span className="text-[10px] font-medium text-slate-400">Qs</span>
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Unattempted</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4">
                            <div className="flex flex-col justify-center h-full">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-xs font-bold text-slate-500">{data.time.breakdown.unattempted}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-400" style={{ width: `${data.time.unattemptedTimePercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 text-right">
                            <span className="text-xs font-bold text-slate-400">-</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Sticky Tabs for Subjects */}
        <div className="sticky top-[57px] z-40 bg-background-light/95 backdrop-blur pt-2 pb-2 -mx-4 px-4 border-b border-slate-200/50">
           <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {data.subjects.map((s) => (
                    <button
                        key={s.name}
                        onClick={() => setActiveSubject(s.name)}
                        className={`
                            whitespace-nowrap flex-1 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border
                            ${activeSubject === s.name 
                                ? 'bg-white border-primary/20 text-slate-800 shadow-sm ring-1 ring-primary/5' 
                                : 'bg-slate-100/50 text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-600'
                            }
                        `}
                    >
                        {s.name}
                    </button>
                ))}
           </div>
        </div>

        {/* Subject Detail View */}
        <div className="flex flex-col gap-4 min-h-[500px]">
            <SubjectCard 
                key={activeSubject} 
                subject={activeSubjectData} 
                isOffline={data.isOffline} 
            />
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default App;
