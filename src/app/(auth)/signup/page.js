"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import ThemeToggle from "../../../components/ThemeToggle";
import {
  register,
  setToken,
  setRole,
  isLoggedIn,
} from "@/services/authService";
import { useRouter } from "next/navigation";
const page = () => {
  const Router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      setLoggedIn(true);
      Router.push("/");
    }
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const errorHandling = () => {
    var error = {};
    if (!form.name || form.name === "") {
      error["name"] = "Name is required";
    }
    if (!form.username || form.username === "") {
      error["username"] = "username is required";
    }
    if (!form.email || form.email === "") {
      error["email"] = "Email is required";
    }
    if (!form.password || form.password === "") {
      error["password"] = "Password is required";
    }
    if (!form.confirmPassword || form.confirmPassword === "") {
      error["confirmPassword"] = "Confirm Password is required";
    }
    if (form.password !== form.confirmPassword) {
      error["confirmPassword"] = "Password and Confirm Password should be same";
    }
    setError(error);
    if (Object.keys(error).length > 0) {
      return true;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    console.log(error);
    if (errorHandling()) {
      console.log(error);
      return;
    }
    register(form)
      .then(({ data }) => {
        setToken(data.authtoken);
        setRole(data.role);
        Router.push("/");
      })
      .catch((err) => {
        var error = {};
        error["submission"] = err.response.data.message;
        setError(error);
      });
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}>
      <ThemeToggle />
      <Stack spacing={4} mx={"auto"} maxW={"lg"} py={4} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired isInvalid={error.name}>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" name="name" onChange={handleChange} />
                  <FormErrorMessage>{error.name}</FormErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <FormControl
                  id="username"
                  isRequired
                  isInvalid={error.username}>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" name="username" onChange={handleChange} />
                  <FormErrorMessage>{error.username}</FormErrorMessage>
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired isInvalid={error.email}>
              <FormLabel>Email address</FormLabel>
              <Input type="email" name="email" onChange={handleChange} />
              <FormErrorMessage>{error.email}</FormErrorMessage>
            </FormControl>
            <FormControl id="password" isRequired isInvalid={error.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{error.password}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="confirmpassword"
              isRequired
              isInvalid={error.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  onChange={handleChange}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{error.confirmPassword}</FormErrorMessage>
            </FormControl>
            <p style={{ color: "#FC8181" }}>{error.submission}</p>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSubmit}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Text
                  as={"span"}
                  color={"blue.400"}
                  cursor={"pointer"}
                  onClick={() => {
                    Router.push("login");
                  }}>
                  Sign In
                </Text>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default page;
