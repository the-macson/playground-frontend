"use client";
import Image from "next/image";
// import styles from "./page.module.css";
import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn } from "@/services/authService";
import { Spinner } from "@nextui-org/react";
import { getAllProblems } from "@/services/userService";
import ReactTable from "@/components/user/ReactTable";
import NavBar from "@/components/NavBar";
export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [problems, setProblems] = useState([]);
  const [loadder, setLoader] = useState(true);
  const Router = useRouter();
  const getProblemsData = async () => {
    try {
      const { data } = await getAllProblems();
      setProblems(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (isLoggedIn()) {
      if(isLoggedIn("admin")){
        Router.push("/admin/problem");
      }
      setLoggedIn(true);
    } else return Router.push("/login");
    getProblemsData();
  }, []);
  if (loadder) {
    return <Spinner />;
  }
  return (
    <NavBar>
      <div className="flex flex-col gap-12 pb-20">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-6 mt-12 py-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Master the <span className="text-gradient">Logic</span>
          </h1>
          <p className="text-default-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Solve world-class coding challenges, pick your favorite language, 
            and track your progress in real-time.
          </p>
          <div className="flex gap-4 mt-2">
            <div className="glass px-6 py-2 rounded-full text-sm font-medium border-sky-500/20">
              <span className="text-sky-400">●</span> {problems.length} Challenges
            </div>
            <div className="glass px-6 py-2 rounded-full text-sm font-medium border-emerald-500/20">
              <span className="text-emerald-400">●</span> Multi-language support
            </div>
          </div>
        </section>

        {/* Problems Table Section */}
        <div className="w-full animate-in fade-in duration-1000 delay-300">
          {problems.length > 0 && <ReactTable dataArray={problems} />}
        </div>
      </div>
    </NavBar>
  );
}

