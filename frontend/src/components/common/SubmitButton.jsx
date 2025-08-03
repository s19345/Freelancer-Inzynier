import {useNavigate} from "react-router";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import {Button, Typography} from "@mui/material";
import theme from "../../theme";

const SubmitButton = ({label, type}) => {

    return (
        <Button
            variant="contained"
            type={type}
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
            <AddCircleOutlineRoundedIcon sx={{mr: 1}}/>
            <Typography noWrap>
                {label}
            </Typography>
        </Button>
    );
}

export default SubmitButton;