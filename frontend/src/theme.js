import {createTheme} from "@mui/material/styles";
import {green, red} from "@mui/material/colors";

const theme = createTheme(
    {
        palette: {
            mode: "light",
            primary: {
                main: "#9E4BDC",
                dark: "#be78f0",
                light: "#9E4BDC",
            },
            // secondary: {
            //     // light: "#ff7961",
            //     main: "#FFD700",
            // },
            // error: {
            //     main: red.A400,
            //     dark: "black"
            // },
            // warning: {
            //     main: red[800],
            //     dark: "black"
            // },
            // info: {
            //     main: "#2563EB",
            // },
            // success: {
            //     light: red[700],
            //     main: green[600],
            // },
            // text: {
            //     primary: "#000000",
            //     secondary: "#000000",
            // },
            // background: {
            //     default: "#202020",
            //     paper: "#202020",
            // },
        }
    }
)
export default theme
