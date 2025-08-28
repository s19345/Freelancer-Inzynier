import {createTheme} from "@mui/material/styles";
import {green, orange} from "@mui/material/colors";

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
            warning: {
                main: orange[500],
                light: orange[300],
                dark: orange[700],
                background: "#fff9e6"
            },
            success: {
                main: green[500],
                light: green[300],
                dark: green[700],
                background: "rgba(115,221,140,0.2)"
            },
            text: {
                primary: "#000000",
            },
            action: {
                disabled: "rgba(0, 0, 0, 0.45)",
            }
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
