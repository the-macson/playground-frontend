"use client";
import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Split from "react-split";
import "./style.css";
import ReactCodeMirror from "@uiw/react-codemirror";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { Divider, Spinner } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  ButtonGroup,
  ScrollShadow,
} from "@nextui-org/react";
import { getProblemById, getSubmissions } from "@/services/userService";
import { submitSolution } from "@/services/userService";
import { StreamLanguage } from "@codemirror/language";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import Swal from "sweetalert2";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/services/authService";

const Page = ({ params }) => {
  const [problem, setProblem] = useState({});
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [passedTestCase, setPassedTestCase] = useState(null);
  const [code, setCode] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState({
    key: "cpp",
    label: "C++",
  });
  const router = useRouter();

  // ... (keeping state and fetch logic same)
  const programmingLanguage = [
    { key: "cpp", label: "C++" },
    { key: "python", label: "Python" },
    { key: "javascript", label: "JavaScript" },
  ];

  const getExtensions = () => {
    switch (selectedLanguage.key) {
      case "cpp": return [cpp()];
      case "python": return [python()];
      case "javascript": return [javascript()];
      default: return [cpp()];
    }
  };

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

  const fetchSubmissions = async () => {
    try {
      const { data } = await getSubmissions(params.id);
      setSubmissions(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      setLoggedIn(true);
    } else router.push("/login");
    fetchProblem();
    fetchSubmissions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleSubmit = async () => {
    const body = {
      id: params.id,
      code: code,
      language: selectedLanguage.key,
    };
    try {
      const { data } = await submitSolution(body);
      setPassedTestCase(data.passedTestCases);
      fetchSubmissions();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: JSON.stringify(error.response?.data?.error || "Submission failed"),
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <NavBar fullWidth={true}>
      <div className="h-[calc(100vh-56px)] overflow-hidden bg-[#020617]">

        <Split
          className="flex h-full"
          sizes={[45, 55]}
          minSize={300}
          gutterSize={8}
          gutter={(index, direction) => {
            const gutter = document.createElement("div");
            gutter.className = `gutter gutter-${direction} hover:bg-sky-400/50 transition-colors cursor-col-resize flex items-center justify-center`;
            const handle = document.createElement("div");
            handle.className = "w-1 h-8 bg-white/10 rounded-full";
            gutter.appendChild(handle);
            return gutter;
          }}
          snapOffset={30}
          dragInterval={1}
          direction="horizontal">
          
          {/* Left Panel: Description & Submissions */}
          <div className="flex flex-col h-full bg-[#030712] border-r border-white/5 shadow-2xl">
            <ScrollShadow hideScrollBar className="flex-1 px-8 py-8 overflow-y-auto">
              <div className="max-w-3xl mx-auto w-full">
                <div className="flex flex-col gap-2 mb-8">
                   <div className="flex items-center gap-2 text-sky-400/80 font-mono text-xs uppercase tracking-widest">
                      <span>Problem {params.id}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20"></span>
                      <span>Classic</span>
                   </div>
                   <h1 className="text-3xl font-bold tracking-tight text-white">
                    {problem.title}
                  </h1>
                </div>
                
                <Tabs
                  aria-label="Problem details"
                  selectedKey={activeTab}
                  onSelectionChange={setActiveTab}
                  variant="underlined"
                  classNames={{
                    tabList: "gap-8 w-full relative rounded-none p-0 border-b border-white/10",
                    cursor: "w-full bg-sky-500 shadow-[0_-4px_12px_rgba(14,165,233,0.3)]",
                    tab: "max-w-fit px-0 h-10 pb-4 mt-2",
                    tabContent: "group-data-[selected=true]:text-sky-400 text-default-400 font-semibold transition-all",
                  }}>
                  <Tab key="description" title="Description" />
                  <Tab key="submissions" title="Submissions" />
                </Tabs>

                <div className="mt-8">
                  {activeTab === "description" ? (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
                      <div className="flex items-center gap-4">
                        <Chip
                          size="sm"
                          variant="shadow"
                          className={
                            problem.difficulty === 1 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" :
                            problem.difficulty === 2 ? "bg-amber-500/20 text-amber-400 border-amber-500/20" :
                            "bg-rose-500/20 text-rose-400 border-rose-500/20"
                          }>
                          {problem.difficulty === 1 ? "Easy" : problem.difficulty === 2 ? "Medium" : "Hard"}
                        </Chip>
                        <div className="flex gap-2 flex-wrap">
                          {problem.tags?.map((tag) => (
                            <Chip key={tag.name} size="sm" variant="dot" className="border-white/10 text-default-400 bg-white/5">
                              {tag.name}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      
                      <article className="text-default-300 leading-relaxed text-lg prose prose-invert max-w-none">
                        <div 
                          className="problem-description"
                          dangerouslySetInnerHTML={{ __html: problem.description }} 
                        />
                      </article>

                      {/* Mock Constraints Section to fill space and look professional */}
                      <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                           Implementation Constraints
                        </h3>
                        <ul className="text-sm text-default-500 space-y-2 font-mono">
                          <li>• Time limit: 2.0s</li>
                          <li>• Memory limit: 256MB</li>
                          <li>• Standard input/output only</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                      <Table aria-label="Submissions" shadow="none" className="bg-transparent" removeWrapper>
                        <TableHeader>
                          <TableColumn className="bg-transparent text-default-500 font-bold">STATUS</TableColumn>
                          <TableColumn className="bg-transparent text-default-500 font-bold">LANGUAGE</TableColumn>
                          <TableColumn className="bg-transparent text-default-500 font-bold">SCORE</TableColumn>
                          <TableColumn className="bg-transparent text-default-500 font-bold text-right">DATE</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"No submissions yet."}>
                          {submissions.map((sub) => (
                            <TableRow key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                              <TableCell>
                                <Chip
                                  color={sub.status === "Accepted" ? "success" : "danger"}
                                  variant="flat"
                                  className="font-bold tracking-tight"
                                  size="sm">
                                  {sub.status}
                                </Chip>
                              </TableCell>
                              <TableCell className="text-default-400 text-xs font-mono uppercase">{sub.language}</TableCell>
                              <TableCell className="text-default-300 font-medium">
                                <span className={sub.status === "Accepted" ? "text-emerald-400" : "text-default-300"}>
                                  {sub.passedTestCases}
                                </span>
                                <span className="text-default-600 mx-1">/</span>
                                {sub.totalTestCases}
                              </TableCell>
                              <TableCell className="text-default-500 text-xs text-right font-mono">
                                {new Date(sub.createdAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </ScrollShadow>

            {/* Bottom Info Bar */}
            <div className="px-8 py-6 border-t border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="flex justify-between items-center gap-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-default-500 font-bold uppercase tracking-widest text-shadow font-heading">Current Progress</p>
                    <div className="flex items-center gap-3">
                       <p className="text-lg text-white font-bold tabular-nums font-heading">
                        {passedTestCase !== null ? passedTestCase : "0"}
                        <span className="text-default-600 font-medium ml-1">/ {problem.numberOfTestCases}</span>
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                  <div className="hidden md:block">
                     <p className="text-[10px] text-default-500 font-bold uppercase tracking-widest text-shadow font-heading">Status</p>
                     <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider font-heading">Ready to Execute</p>
                  </div>
                </div>

                
                <Button 
                  onClick={handleSubmit} 
                  variant="shadow"
                  className="bg-white text-black font-black px-10 h-12 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group">
                  SUBMIT CODE
                  <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel: Editor */}
          <div className="flex flex-col h-full bg-[#030712]">
            <div className="flex justify-between items-center h-14 px-6 border-b border-white/5 bg-black/20">
              <div className="flex gap-4 items-center">
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
                 </div>
                 <div className="h-4 w-px bg-white/10 mx-1"></div>
                 <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white/40 tracking-widest uppercase">IntelliSense Enabled</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Dropdown className="glass-dark border border-white/10">
                  <DropdownTrigger>
                    <Button size="sm" variant="flat" className="bg-white/5 text-sky-400 font-mono text-xs border border-white/5 px-4 font-bold">
                      {selectedLanguage.label}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Language selection"
                    items={programmingLanguage}
                    onAction={(key) => {
                      const lang = programmingLanguage.find((l) => l.key === key);
                      setSelectedLanguage(lang);
                    }}>
                    {(item) => (
                      <DropdownItem key={item.key} className="font-mono text-xs">
                        {item.label}
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0 pointer-events-none border-l border-white/5 shadow-[inset_12px_0_24px_-12px_rgba(0,0,0,0.5)] z-10"></div>
              <ReactCodeMirror
                width="100%"
                height="100%"
                theme={tokyoNight}
                extensions={getExtensions()}
                onChange={(value) => setCode(value)}
                className="text-base editor-custom"
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  highlightSpecialChars: true,
                  history: true,
                  foldGutter: true,
                  drawSelection: true,
                  dropCursor: true,
                  allowMultipleSelections: true,
                  indentOnInput: true,
                  syntaxHighlighting: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                  rectangularSelection: true,
                  crosshairCursor: true,
                  highlightActiveLine: true,
                  highlightSelectionMatches: true,
                  closeBracketsKeymap: true,
                  defaultKeymap: true,
                  searchKeymap: true,
                  historyKeymap: true,
                  foldKeymap: true,
                  completionKeymap: true,
                  lintKeymap: true,
                }}
              />
            </div>
          </div>
        </Split>
      </div>
      
      <style jsx global>{`
        .gutter {
          background-color: transparent;
          background-repeat: no-repeat;
          background-position: 50%;
        }
        .gutter.gutter-horizontal {
          cursor: col-resize;
        }
        .problem-description p {
          margin-bottom: 1.5rem;
        }
        .problem-description code {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.9em;
          color: #38bdf8;
        }
        .editor-custom .cm-editor {
           background-color: transparent !important;
        }
        .editor-custom .cm-gutters {
           background-color: rgba(0,0,0,0.2) !important;
           border-right: 1px solid rgba(255,255,255,0.05) !important;
           color: rgba(255,255,255,0.2) !important;
        }
        .editor-custom .cm-activeLineGutter {
           background-color: rgba(56, 189, 248, 0.1) !important;
           color: #38bdf8 !important;
        }
      `}</style>
    </NavBar>
  );
};


export default Page;
