"use client";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { getUserProfile } from "@/services/userService";
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
  Progress,
  ScrollShadow
} from "@nextui-org/react";
import { User, Mail, Calendar, Trophy, Code, Activity } from "lucide-react";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
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

  if (!profileData) return null;

  const { user, stats, recentSubmissions } = profileData;

  return (
    <NavBar>
      <div className="min-h-screen bg-[#020617] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <Card className="glass-dark border-white/5 p-8 overflow-visible">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <Avatar 
                  name={user.name} 
                  className="w-32 h-32 text-4xl bg-gradient-to-br from-sky-500 to-blue-700 font-bold"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h1 className="text-4xl font-black tracking-tight font-heading">{user.name}</h1>
                  <p className="text-sky-400 font-mono text-sm tracking-widest uppercase">@{user.username}</p>
                </div>
                
                <div className="flex flex-wrap gap-6 text-default-400 text-sm justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-sky-400/60" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-sky-400/60" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                  <Chip variant="dot" color="primary" className="border-white/10 text-xs uppercase font-bold tracking-widest">Logic Master</Chip>
                  <Chip variant="dot" color="secondary" className="border-white/10 text-xs uppercase font-bold tracking-widest">Early Adopter</Chip>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass border-white/5 p-6 hover:bg-white/10 transition-colors">
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Trophy className="text-emerald-400" size={24} />
                </div>
                <div>
                  <p className="text-3xl font-black font-heading tracking-tighter tabular-nums">{stats.totalSolved}</p>
                  <p className="text-xs text-default-500 font-bold uppercase tracking-widest pt-1">Problems Solved</p>
                </div>
              </div>
            </Card>

            <Card className="glass border-white/5 p-6 hover:bg-white/10 transition-colors">
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Activity className="text-sky-400" size={24} />
                </div>
                <div>
                  <p className="text-3xl font-black font-heading tracking-tighter tabular-nums">{stats.totalSubmissions}</p>
                  <p className="text-xs text-default-500 font-bold uppercase tracking-widest pt-1">Total Submissions</p>
                </div>
              </div>
            </Card>

            <Card className="glass border-white/5 p-6 hover:bg-white/10 transition-colors">
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Code className="text-amber-400" size={24} />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap justify-center gap-2">
                    {stats.languages.map(lang => (
                      <Chip key={lang.language} size="sm" variant="flat" className="bg-white/5 text-[10px] font-mono uppercase">
                        {lang.language}: {lang.count}
                      </Chip>
                    ))}
                  </div>
                  <p className="text-xs text-default-500 font-bold uppercase tracking-widest">Languages Used</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Submissions */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold font-heading flex items-center gap-3 ml-2">
                <Activity size={20} className="text-sky-400" />
                Recent Submissions
              </h3>
              <Card className="glass-dark border-white/5 border overflow-hidden">
                <Table 
                  aria-label="Recent activity table"
                  removeWrapper
                  className="bg-transparent"
                >
                  <TableHeader>
                    <TableColumn className="bg-white/5 text-default-500 font-bold uppercase text-[10px] tracking-widest px-6 h-12">PROBLEM</TableColumn>
                    <TableColumn className="bg-white/5 text-default-500 font-bold uppercase text-[10px] tracking-widest h-12">STATUS</TableColumn>
                    <TableColumn className="bg-white/5 text-default-500 font-bold uppercase text-[10px] tracking-widest h-12">LANGUAGE</TableColumn>
                    <TableColumn className="bg-white/5 text-default-500 font-bold uppercase text-[10px] tracking-widest text-right px-6 h-12">DATE</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"No submissions yet."}>
                    {recentSubmissions.map((sub) => (
                      <TableRow key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                        <TableCell className="px-6 py-4 font-semibold text-sky-400 underline decoration-sky-400/20 underline-offset-4 cursor-pointer">
                          {sub.problem?.title || "Unknown Problem"}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="sm" 
                            color={sub.status === "Accepted" ? "success" : "danger"} 
                            variant="flat" 
                            className="font-bold uppercase tracking-tighter"
                          >
                            {sub.status}
                          </Chip>
                        </TableCell>
                        <TableCell className="text-default-400 font-mono text-xs uppercase">{sub.language}</TableCell>
                        <TableCell className="text-right px-6 text-default-500 text-xs tabular-nums">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Language Breakdown & Progress */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-heading flex items-center gap-3 ml-2">
                <Code size={20} className="text-amber-400" />
                Language Metrics
              </h3>
              <Card className="glass border-white/5 p-6 space-y-6">
                {stats.languages.map((lang, idx) => {
                  const percentage = (lang.count / stats.totalSubmissions) * 100;
                  return (
                    <div key={lang.language} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="uppercase font-bold text-sky-400">{lang.language}</span>
                        <span className="text-default-500">{lang.count} submissions ({percentage.toFixed(0)}%)</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        size="sm" 
                        radius="full"
                        className="h-1.5"
                        classNames={{
                          indicator: idx % 2 === 0 ? "bg-sky-500" : "bg-blue-600 shadow-[0_0_8px_rgba(2,132,199,0.3)]"
                        }}
                      />
                    </div>
                  );
                })}
                {stats.languages.length === 0 && (
                  <p className="text-center text-default-500 text-sm py-4">No data available</p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </NavBar>
  );
}
