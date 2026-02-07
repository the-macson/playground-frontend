"use client";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { getLeaderboard } from "@/services/userService";
import { 
  Card, 
  CardBody, 
  Avatar, 
  Chip, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  ScrollShadow
} from "@nextui-org/react";
import { Trophy, Medal, Crown, Star, Target, Zap } from "lucide-react";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await getLeaderboard();
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <NavBar>
        <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-[#020617]">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </NavBar>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  const getPodiumColor = (index) => {
    if (index === 0) return "from-amber-400 to-yellow-600";
    if (index === 1) return "from-slate-300 to-slate-500";
    return "from-orange-400 to-orange-700";
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="text-amber-400" size={32} />;
    if (index === 1) return <Medal className="text-slate-300" size={32} />;
    if (index === 2) return <Medal className="text-orange-500" size={32} />;
    return null;
  };

  return (
    <NavBar>
      <div className="min-h-screen bg-[#020617] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black tracking-tighter font-heading text-gradient italic">
              HALL OF FAME
            </h1>
            <p className="text-default-500 font-mono text-sm tracking-widest uppercase">
              The elite coders dominating the playground
            </p>
          </div>

          {/* Podium Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end relative">
            {/* 2nd Place */}
            {topThree[1] && (
              <Card className="glass-dark border-white/5 p-6 h-fit md:h-[90%] order-2 md:order-1 hover:scale-[1.02] transition-all">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar 
                      name={topThree[1].user.name} 
                      className="w-24 h-24 text-2xl bg-slate-500 border-4 border-slate-500/20"
                    />
                    <div className="absolute -top-4 -right-2">
                       <Medal className="text-slate-300 drop-shadow-lg" size={40} />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold font-heading line-clamp-1">{topThree[1].user.name}</h3>
                    <p className="text-sky-400/60 font-mono text-xs uppercase tracking-widest">@{topThree[1].user.username}</p>
                  </div>
                  <div className="w-full flex justify-around p-4 rounded-xl bg-white/5 border border-white/5 font-heading">
                    <div className="text-center">
                       <p className="text-2xl font-black">{topThree[1].solvedCount}</p>
                       <p className="text-[10px] text-default-500 uppercase font-bold tracking-widest">Solved</p>
                    </div>
                    <div className="text-center">
                       <p className="text-2xl font-black">{topThree[1].totalScore}</p>
                       <p className="text-[10px] text-default-500 uppercase font-bold tracking-widest">Score</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <div className="order-1 md:order-2 space-y-4">
                <div className="flex justify-center animate-bounce duration-[2000ms]">
                   <Crown className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" size={60} />
                </div>
                <Card className="bg-gradient-to-br from-amber-400/10 to-transparent border-amber-400/20 p-8 h-full relative overflow-visible shadow-[0_0_50px_-12px_rgba(251,191,36,0.3)] hover:scale-[1.05] transition-all">
                   <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                      <Avatar 
                        name={topThree[0].user.name} 
                        className="w-32 h-32 text-4xl bg-gradient-to-br from-amber-400 to-yellow-600 border-4 border-amber-400/40 shadow-2xl"
                      />
                   </div>
                   <div className="pt-24 flex flex-col items-center gap-6">
                      <div className="text-center">
                        <h3 className="text-3xl font-black font-heading line-clamp-1">{topThree[0].user.name}</h3>
                        <p className="text-amber-400 font-mono text-sm uppercase tracking-widest font-bold">@{topThree[0].user.username}</p>
                      </div>
                      <div className="w-full grid grid-cols-2 gap-4 p-6 rounded-2xl bg-amber-400/10 border border-amber-400/20 font-heading">
                        <div className="text-center border-r border-amber-400/10">
                           <p className="text-4xl font-black text-amber-400 drop-shadow-sm">{topThree[0].solvedCount}</p>
                           <p className="text-[12px] text-amber-400/70 uppercase font-bold tracking-widest">Solved</p>
                        </div>
                        <div className="text-center">
                           <p className="text-4xl font-black text-amber-400 drop-shadow-sm">{topThree[0].totalScore}</p>
                           <p className="text-[12px] text-amber-400/70 uppercase font-bold tracking-widest">Score</p>
                        </div>
                      </div>
                   </div>
                </Card>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <Card className="glass-dark border-white/5 p-6 h-fit md:h-[80%] order-3 hover:scale-[1.02] transition-all">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar 
                      name={topThree[2].user.name} 
                      className="w-20 h-20 text-xl bg-orange-700 border-4 border-orange-700/20"
                    />
                    <div className="absolute -top-4 -right-2">
                       <Medal className="text-orange-600 drop-shadow-lg" size={32} />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold font-heading line-clamp-1">{topThree[2].user.name}</h3>
                    <p className="text-sky-400/60 font-mono text-xs uppercase tracking-widest">@{topThree[2].user.username}</p>
                  </div>
                  <div className="w-full flex justify-around p-4 rounded-xl bg-white/5 border border-white/5 font-heading">
                    <div className="text-center">
                       <p className="text-2xl font-black">{topThree[2].solvedCount}</p>
                       <p className="text-[10px] text-default-500 uppercase font-bold tracking-widest">Solved</p>
                    </div>
                    <div className="text-center">
                       <p className="text-2xl font-black">{topThree[2].totalScore}</p>
                       <p className="text-[10px] text-default-500 uppercase font-bold tracking-widest">Score</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-4 px-2">
                <Target className="text-sky-400" size={24} />
                <h2 className="text-2xl font-black font-heading tracking-tight">GLOBAL RANKINGS</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
             </div>
             
             <Card className="glass-dark border-white/5 p-4">
                <Table aria-label="Global rankings table" removeWrapper className="bg-transparent">
                  <TableHeader>
                    <TableColumn className="bg-white/5 text-default-500 font-bold uppercase text-[10px] tracking-widest px-8">RANK</TableColumn>
                    <TableColumn className="bg-white/5 text-default-500 font-bold uppercase text-[10px] tracking-widest">CODER</TableColumn>
                    <TableColumn className="bg-white/5 text-default-500 font-bold uppercase text-[10px] tracking-widest text-center">SOLVED</TableColumn>
                    <TableColumn className="bg-white/5 text-default-500 font-bold uppercase text-[10px] tracking-widest text-right px-8">TOTAL SCORE</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((item, index) => (
                      <TableRow key={item.userId} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                        <TableCell className="px-8 font-black font-heading py-6">
                           <div className="flex items-center gap-3">
                              <span className={`text-xl ${index < 3 ? 'text-sky-400' : 'text-default-400'}`}>
                                #{(index + 1).toString().padStart(2, '0')}
                              </span>
                              {index < 3 && <Star size={14} className="text-amber-400/50 fill-amber-400/20" />}
                           </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                             <Avatar size="sm" name={item.user.name} className="bg-sky-500/10 text-sky-400 border border-sky-400/20" />
                             <div className="flex flex-col">
                                <span className="font-bold text-lg font-heading group-hover:text-sky-400 transition-colors uppercase tracking-tight">{item.user.name}</span>
                                <span className="text-xs text-default-500 font-mono uppercase tracking-widest">@{item.user.username}</span>
                             </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                           <Chip variant="shadow" className="bg-emerald-500/10 text-emerald-400 font-black tabular-nums border border-emerald-500/20 px-4">
                              {item.solvedCount}
                           </Chip>
                        </TableCell>
                        <TableCell className="text-right px-8">
                           <div className="flex flex-col items-end">
                              <span className="text-2xl font-black font-heading text-white">{item.totalScore.toLocaleString()}</span>
                              <span className="text-[10px] text-default-600 font-bold tracking-widest flex items-center gap-1">
                                 <Zap size={10} className="text-amber-500" />
                                 POWER LEVEL
                              </span>
                           </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </Card>
          </div>
        </div>
      </div>
    </NavBar>
  );
}
