import { extendTheme } from "@chakra-ui/react"

const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
}
const theme = extendTheme({ config })
export default theme;

// export function setTheme(theme){
//     localStorage.setItem("chakra-ui-color-mode",theme)
// }
// export function getTheme(){
//     return localStorage.getItem("chakra-ui-color-mode")
// }