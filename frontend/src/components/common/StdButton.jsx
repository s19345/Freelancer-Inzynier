import {Link as RouterLink} from "react-router";
import {Button, Typography} from "@mui/material";
import theme from "../../theme";

const StdButton = ({label, to, onClick}) => {
    return (
        <Button
            variant="contained"
            component={RouterLink}
            to={to}
            onClick={onClick}
            style={{
                backgroundColor: theme.palette.primary.dark,
                color: 'black',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                textTransform: 'none',
                width: 'auto',
                whiteSpace: 'nowrap',
                minWidth: 'unset',
            }}
        >
            <Typography noWrap>
                {label}
            </Typography>
        </Button>
    );
}

export default StdButton;