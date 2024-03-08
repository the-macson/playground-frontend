import React, { useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";

export default function NavBar({ children }) {
  const Router = useRouter();
  const handleLogout = () => {
    logout();
    Router.push("/login");
  };
  const handleProblems = () => {
    Router.push("/");
  };

  return (
    <>
      <Navbar isBordered position="static" style={{
        backgroundColor: "transparent"
      }}>
        <NavbarContent className="hidden sm:flex gap-4" justify="start">
          <NavbarItem>
            <Text
              size={"md"}
              color="foreground"
              cursor={"pointer"}
              onClick={handleProblems}>
              Problems
            </Text>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button color="primary" variant="flat" onClick={handleLogout}>
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {children}
    </>
  );
}
