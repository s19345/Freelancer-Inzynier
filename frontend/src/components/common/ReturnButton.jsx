import {Link as RouterLink} from "react-router";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {Button, Typography} from "@mui/material";
import theme from "../../theme";

const ReturnButton = ({label, to}) => {
    return (
        <Button
            variant="contained"
            component={RouterLink}
            to={to}
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
            <ArrowBackIosNewIcon sx={{mr: 1}}/>
            <Typography noWrap>
                {label}
            </Typography>
        </Button>
    );
}

export default ReturnButton;