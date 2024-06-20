"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { isLoggedIn } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useReactTable } from "@tanstack/react-table";
import ReactTable from "@/components/ReactTable";
import { getAllProblems } from "@/services/adminService";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@chakra-ui/react";
const page = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [problems, setProblems] = useState([]);
  const Router = useRouter();
  const getProblemsData = async () => {
    try {
      const { data } = await getAllProblems();
      setProblems(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isLoggedIn("admin")) {
      setLoggedIn(true);
    } else return Router.push("/login");
    getProblemsData();
  }, []);
  return (
    <div>
      {loggedIn && (
        <Box p={3}>
          <Box fontSize={32}>All Problem</Box>
          {problems.length > 0 && (
            <ReactTable dataArray={problems} />
          )}
          <Box pos={'absolute'}>
            <Button
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 1000,
                fontSize: "30px",
                backgroundColor: "green",
                borderRadius: "50%",
                padding: "10px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
              onClick={() => {
                Router.push("/admin/problem/add-problem");
              }}>
              +
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default page;
