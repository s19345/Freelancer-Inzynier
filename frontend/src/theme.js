import {createTheme} from "@mui/material/styles";
import {green, orange, red} from "@mui/material/colors";

const theme = createTheme(
    {
        palette: {
            mode: "light",
            primary: {
                main: "#9E4BDC",
                dark: "#be78f0",
                light: "#9E4BDC",
            },
            secondary: {
                light: "#9c9c9c",
                main: "#7c7c7c",
            },
            // error: {
            //     main: red.A400,
            //     dark: "black"
            // },
            warning: {
                main: orange[500],
                light: orange[300],
                dark: orange[700],
                background: "#fff9e6"
            },
            // info: {
            //     main: "#2563EB",
            // },
            success: {
                main: green[500],
                light: green[300],
                dark: green[700],
                background: "rgba(115,221,140,0.2)"
                // background: green[100],
            },
            // text: {
            //     primary: "#000000",
            //     secondary: "#000000",
            // },
            // background: {
            //     default: "#202020",
            //     paper: "#202020",
            // },
        },
        components: {
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: "12px",
                    },
                },
            },
        },
    }
)
export default theme
