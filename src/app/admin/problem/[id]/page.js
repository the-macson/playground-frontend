"use client";
import React, { useState, useEffect } from "react";
import { isLoggedIn } from "../../../../services/authService";
import { useRouter } from "next/navigation";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Grid,
  GridItem,
  Center,
  Spinner,
} from "@chakra-ui/react";
import Select from "react-select";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";
import { object, string, number, date, InferType, array } from "yup";
import styles from "../../../../assets/style/admin/addProblem.module.css";
import {
  getTags,
  updateProblem,
  getPorblemById,
} from "../../../../services/adminService";
const page = ({ params }) => {
  const { id } = params;
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  //   const [input, setInput] = useState(["", "", ""]);
  //   const [output, setOutput] = useState(["", "", ""]);
  const [inputOutput, setInputOutput] = useState([]);
  const [form, setForm] = useState({});
  const [tags, setTags] = useState([]);
  const [loader, setLoader] = useState(true);
  const [difficulty, setDifficulty] = useState([
    {
      label: "Easy",
      value: "1",
    },
    {
      label: "Medium",
      value: "2",
    },
    {
      label: "Hard",
      value: "3",
    },
  ]);
  const problemSchema = object({
    title: string().required(),
    description: string().required().min(20),
    difficulty: string().required(),
    problemIOs: array().of(
      object({
        input: string().required("Enter the input"),
        output: string().required("Enter the output"),
      })
    ),
    problemTags: array().of(
      object({
        tagId: number(),
      })
    ),
  });
  let inputTimeouts = [];
  let outputTimeouts = [];
  const Router = useRouter();
  useEffect(() => {
    if (isLoggedIn("admin")) {
      setLoggedIn(true);
    } else {
      Router.push("/login");
    }
    fetchTags();
    fetchProblemById();
  }, []);

  const fetchProblemById = async () => {
    try {
      const { data } = await getPorblemById(id);
      console.log(data);
      setForm({
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
      });
      const tags = data.tags.map((tag) => {
        return {
          value: tag.id,
          label: tag.name,
        };
      });
      setSelectedTags(tags);
      const problemIOs = data.problemIOs;
      setInputOutput(problemIOs);
      //   const newInput = [];
      //   const newOutput = [];
      //   for (let i = 0; i < problemIOs.length; i++) {
      //     newInput.push(problemIOs[i].input);
      //     newOutput.push(problemIOs[i].output);
      //   }
      //   setInput(newInput);
      //   setOutput(newOutput);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTags = async () => {
    const { data } = await getTags();
    const options = data.map((tag) => {
      return {
        value: tag.id,
        label: tag.name,
      };
    });
    setTags(options);
  };

  const handleAddTestCase = () => {
    setInputOutput([...inputOutput, { input: "", output: "" }]);
  };
  const handleRemoveTestCase = (index) => {
    const newInputOutput = [...inputOutput];
    newInputOutput.splice(index, 1);
    setInputOutput(newInputOutput);
  };
  const handleInputChange = (e, index) => {
    const newInputOutput = [...inputOutput];
    newInputOutput[index].input = e.target.value;
    setInputOutput(newInputOutput);
  };
  const handleOutputChange = (e, index) => {
    const newInputOutput = [...inputOutput];
    newInputOutput[index].output = e.target.value;
    setInputOutput(newInputOutput);
  };

  const renderInputAndOutput = () => {
    const element = [];
    for (let i = 0; i < inputOutput.length; i++) {
      element.push(
        <Grid templateColumns="repeat(11, 1fr)" gap={6} key={i}>
          <GridItem colSpan={5}>
            <FormControl paddingY={2}>
              <Input
                type="text"
                onChange={(e) => {
                  handleInputChange(e, i);
                }}
                value={inputOutput[i].input}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={5}>
            <FormControl paddingY={2}>
              <Input
                type="text"
                onChange={(e) => {
                  handleOutputChange(e, i);
                }}
                value={inputOutput[i].output}
              />
            </FormControl>
          </GridItem>
          <GridItem paddingY={2} colSpan={1}>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => {
                handleRemoveTestCase(i);
              }}
            >
              Remove
            </Button>
          </GridItem>
        </Grid>
      );
    }
    return element;
  };

  const validate = async (data, schema) => {
    try {
      await schema.validate(data);
      return true;
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.errors[0],
      });
      return false;
    }
  };

  const handleOnSubmit = async () => {
    const tags = selectedTags.map((tag) => {
      return {
        tagId: tag.value,
      };
    });
    const problemIOs = [];
    // for (let i = 0; i < input.length; i++) {
    //   problemIOs.push({
    //     input: input[i],
    //     output: output[i],
    //   });
    // }
    const data = {
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      tags: tags,
      problemIOs: inputOutput,
    };
    console.log(data);
    if (!validate(data, problemSchema)) return;
    try {
      await updateProblem(id, data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Problem added successfully",
      });
      Router.push("/admin/problem");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong",
      });
    }
  };
  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {loggedIn && !loader ? (
        <Box p={3}>
          <Box fontSize={32}>Add Problem</Box>
          <Box>
            <FormControl paddingY={2}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                onChange={handleOnChange}
                value={form?.title}
              />
            </FormControl>
            <FormControl paddingY={2}>
              <FormLabel>Description</FormLabel>
              <JoditEditor
                value={form?.description}
                onChange={(data) => {
                  setForm({ ...form, description: data });
                }}
              />
            </FormControl>
            <FormControl paddingY={2}>
              <FormLabel>Tag</FormLabel>
              <Select
                classNamePrefix={"tagSelect"}
                isMulti
                className="tagSelect"
                options={tags}
                value={selectedTags}
                onChange={(value) => {
                  setSelectedTags(value);
                }}
              />
            </FormControl>
            <FormControl paddingY={2}>
              <FormLabel>Difficulty</FormLabel>
              <Select
                classNamePrefix={"tagSelect"}
                className="tagSelect"
                options={difficulty}
                value={difficulty.find(
                  (option) => option.value === form?.difficulty
                )}
                onChange={({ value }) => {
                  setForm({ ...form, difficulty: value });
                }}
              />
            </FormControl>
            <Grid templateColumns="repeat(11, 1fr)" gap={6}>
              <GridItem colSpan={5}>
                <FormControl paddingY={2}>
                  <FormLabel>Input</FormLabel>
                </FormControl>
              </GridItem>
              <GridItem colSpan={5}>
                <FormControl paddingY={2}>
                  <FormLabel>Output</FormLabel>
                </FormControl>
              </GridItem>
            </Grid>
            {renderInputAndOutput()}
            <Box paddingY={2}>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={handleAddTestCase}
              >
                Add Testcase
              </Button>
            </Box>
            <Box display="flex" justifyContent="center">
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={handleOnSubmit}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          justifyContent={"center"}
          display={"flex"}
          alignItems={"center"}
          height={"100vh"}
        >
          <Center>
            <Spinner size="xl" />
          </Center>
        </Box>
      )}
      <style>{`
       .jodit-toolbar__box {
          background-color: #1A202C !important;
       }
        .jodit-container {
          border: 1px solid rgb(118, 118, 118) !important;
        }
        .jodit-icon {
          fill: rgba(255, 255, 255, 0.92) !important;
        }
        .jodit-toolbar-button__trigger svg {
          fill: rgba(255, 255, 255, 0.92) !important;
        }
        .jodit-workplace {
          background-color: #1A202C !important;
        }
        .jodit-status-bar {
          background-color: #1A202C !important;
          color: rgba(255, 255, 255, 0.92) !important;
        }
        .jodit-status-bar-link {
          display: none !important;
        }
        .tagSelect__control {
          background-color: #1A202C !important;
          color: rgba(255, 255, 255, 0.92) !important;
        }
        .tagSelect__menu {
          background-color: #1A202C !important;
          color: rgba(255, 255, 255, 0.92) !important;
        }
      `}</style>
    </div>
  );
};

export default page;
