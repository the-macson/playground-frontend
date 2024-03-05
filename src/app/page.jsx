"use client";
import Image from 'next/image'
import styles from './page.module.css'
import { Box , Text } from '@chakra-ui/react'
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import {isLoggedIn} from "@/services/authService";
import { Spinner } from "@nextui-org/react";
import { getAllProblems } from "@/services/userService";
import ReactTable from "@/components/ReactTable";
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
      setLoggedIn(true);
    } else return Router.push("/login");
    getProblemsData();
  }, []);
  if(loadder){
    return <Spinner/>
  }
  return (
    <Box p={3}>
      <Box fontSize={32}>All Problem</Box>
      {problems.length > 0 && (
        <ReactTable dataArray={problems} />
      )}
    </Box>
  );
}
