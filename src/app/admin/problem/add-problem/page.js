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
} from "@chakra-ui/react";
import Select from "react-select";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";
import { object, string, number, date, InferType, array } from "yup";
import styles from "../../../../assets/style/admin/addProblem.module.css";
import { getTags, addProblem } from "../../../../services/adminService";
const page = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [input, setInput] = useState(["", "", ""]);
  const [output, setOutput] = useState(["", "", ""]);
  const [form, setForm] = useState({});
  const [tags, setTags] = useState([]);
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
  }, []);

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
    setInput([...input, ""]);
    setOutput([...output, ""]);
  };
  const handleRemoveTestCase = (index) => {
    const newInput = [...input];
    const newOutput = [...output];
    newInput.splice(index, 1);
    newOutput.splice(index, 1);
    setInput(newInput);
    setOutput(newOutput);
  };
  const handleInputChange = (e, index) => {
    clearTimeout(inputTimeouts[index]);
    const newInput = [...input];
    newInput[index] = e.target.value;
    inputTimeouts[index] = setTimeout(() => {
      setInput(newInput);
    }, 300); // Adjust the debounce delay as needed
  };
  const handleOutputChange = (e, index) => {
    clearTimeout(outputTimeouts[index]);
    const newOutput = [...output];
    newOutput[index] = e.target.value;
    outputTimeouts[index] = setTimeout(() => {
      setOutput(newOutput);
    }, 300); // Adjust the debounce delay as needed
  };

  const renderInputAndOutput = () => {
    const element = [];
    for (let i = 0; i < input.length; i++) {
      element.push(
        <Grid templateColumns="repeat(11, 1fr)" gap={6} key={i}>
          <GridItem colSpan={5}>
            <FormControl paddingY={2}>
              <Input
                type="text"
                onChange={(e) => {
                  handleInputChange(e, i);
                }}
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
              />
            </FormControl>
          </GridItem>
          <GridItem paddingY={2} colSpan={1}>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => {
                handleRemoveTestCase(i);
              }}>
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
    for (let i = 0; i < input.length; i++) {
      problemIOs.push({
        input: input[i],
        output: output[i],
      });
    }
    const data = {
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      tags: tags,
      problemIOs: problemIOs,
    };
    console.log(data);
    if (!validate(data, problemSchema)) return;
    try {
      await addProblem(data);
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
      {loggedIn ? (
        <Box p={3}>
          <Box fontSize={32}>Add Problem</Box>
          <Box>
            <FormControl paddingY={2}>
              <FormLabel>Title</FormLabel>
              <Input type="text" name="title" onChange={handleOnChange} />
            </FormControl>
            <FormControl paddingY={2}>
              <FormLabel>Description</FormLabel>
              <JoditEditor
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
                onClick={handleAddTestCase}>
                Add Testcase
              </Button>
            </Box>
            <Box display="flex" justifyContent="center">
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={handleOnSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <div></div>
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
