"use client";

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
  Link,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ThemeToggle from "../../../components/ThemeToggle";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  login,
  setToken,
  setRole,
  isLoggedIn,
} from "../../../services/authService";
import { useRouter } from "next/navigation";
export default function Login() {
  const Router = useRouter();
  const [form, setForm] = useState({});
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      if (isLoggedIn("admin")) {
        Router.push("/admin/problem");
      }
      setLoggedIn(true);
      Router.push("/");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const errorHandling = () => {
    var error = {};
    if (!form.email || form.email === "") {
      error["email"] = "Email is required";
    }
    if (!form.password || form.password === "") {
      error["password"] = "Password is required";
    }
    setError(error);
    console.log(error);
    if (Object.keys(error).length > 0) {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorHandling()) {
      return;
    }
    login(form)
      .then((res) => {
        setToken(res.data.authtoken);
        setRole(res.data.role);
        Router.push("/");
      })
      .catch((err) => {
        console.log(err);
        var error = {};
        error["submission"] = "Invalid email or password";
        setError(error);
      });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      position={"relative"}
    >
      <ThemeToggle />
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool feature ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
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
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{error.password}</FormErrorMessage>
            </FormControl>
            <p style={{ color: "#FC8181" }}>{error.submission}</p>
            <Stack spacing={10}>
              {/* <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Text color={"blue.400"}>Forgot password?</Text>
              </Stack> */}
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSubmit}
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Don't have an account?{" "}
                <Text
                  as={"span"}
                  color={"blue.400"}
                  cursor={"pointer"}
                  onClick={() => {
                    Router.push("/signup");
                  }}
                >
                  Sign up
                </Text>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
