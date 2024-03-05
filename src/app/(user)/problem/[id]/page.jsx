"use client";
import React, { useEffect, useState } from "react";
import { Box , Flex} from "@chakra-ui/react";
import Split from "react-split";
import "./style.css";
import ReactCodeMirror from "@uiw/react-codemirror";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { Divider, Spinner } from "@nextui-org/react";
import { getProblemById } from "@/services/userService";
import { isLoggedIn } from "@/services/authService";
import { useRouter } from "next/navigation";
import { ScrollShadow } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const page = ({ params }) => {
  const [problem, setProblem] = useState({});
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const programmingLanguage = [
    {
      key: "cpp",
      label: "C++",
    },
    {
      key: "python",
      label: "Python",
    },
    {
      key: "javaScript",
      label: "JavaScript",
    },
  ];
  const fetchProblem = async () => {
    try {
      const { data } = await getProblemById(params.id);
      setProblem(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isLoggedIn()) {
      setLoggedIn(true);
    } else router.push("/login");
    fetchProblem();
  }, [params.id]);
  if (loading) {
    return (
      <Box
        h={"100vh"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}>
        <Spinner size="large" />
      </Box>
    );
  }
  return (
    <Box h={"100vh"}>
      <Split
        className="wrap"
        sizes={[50, 50]}
        minSize={100}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize">
        <Box h={"100vh"}>
          <Box h={"100vh"}>
            <div className="bg-dark-layer-1">
              <ScrollShadow
                hideScrollBar
                className="flex px-2 py-4 h-[calc(100vh-80px)] overflow-y-auto">
                <div className="px-5">
                  <div className="w-full">
                    <div className="flex space-x-4">
                      <div className="flex-1 mr-2 text-lg text-white font-medium">
                        {problem.title}
                      </div>
                    </div>
                    <Divider />
                    <div className="flex items-center mt-2">
                      <div
                        className={`inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize bg-white`}>
                        {problem.difficulty == 1
                          ? "Easy"
                          : problem.difficulty == 2
                          ? "Medium"
                          : "Hard"}
                      </div>
                    </div>
                    <div className="text-white text-base my-3">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: problem.description,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </ScrollShadow>
              <div className="h-[80px]">
                <Divider />
                <div className="flex px-2 py-4 h-full overflow-x-auto justify-between items-center">
                  <div>Number of test cases: {problem.numberOfTestCases}</div>
                  <Button color="primary">Submit</Button>
                </div>
              </div>
            </div>
          </Box>
        </Box>
        <Box h={"100vh"}>
          <Box h={"100vh"} overflow={"auto"}>
            <Flex h={"55px"} justify={"flex-end"} alignItems={"center"} mr={5}>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">Select Language</Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Dynamic Actions"
                  items={programmingLanguage}>
                  {(item) => (
                    <DropdownItem
                      key={item.key}
                      color={item.key === "delete" ? "danger" : "default"}
                      className={item.key === "delete" ? "text-danger" : ""}>
                      {item.label}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </Flex>
            <ReactCodeMirror width="100%" height={"calc(100vh - 55px)"} theme={tokyoNight} />
          </Box>
        </Box>
      </Split>
    </Box>
  );
};

export default page;
