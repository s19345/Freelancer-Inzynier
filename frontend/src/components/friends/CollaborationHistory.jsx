import {Card, CardContent, Typography, Box, Divider} from "@mui/material";

const CollaborationHistory = ({history}) => {

    return (
        <Box sx={{mt: 4}}>
            <Typography variant="h6" gutterBottom>
                Collaboration History
            </Typography>
            <Card sx={{maxWidth: 400, borderRadius: 3, boxShadow: 2}}>
                <CardContent>


                    <Box sx={{display: "flex", justifyContent: "left", mb: 1}}>
                        <Typography variant="body2">Total projects</Typography>
                        <Typography sx={{ml: 3}} variant="body2"
                                    fontStyle="italic">{history.common_projects_count}</Typography>
                    </Box>

                    <Divider sx={{mb: 1}}/>
                    <Box sx={{display: "flex", justifyContent: "left", mb: 1}}>
                        <Typography variant="body2">First collaboration date</Typography>
                        <Typography sx={{ml: 3}} variant="body2"
                                    fontStyle="italic">{history.first_project_date}</Typography>
                    </Box>
                    <Divider sx={{mb: 1}}/>

                    <Box sx={{display: "flex", justifyContent: "left", mb: 1}}>
                        <Typography variant="body2">Last project date</Typography>
                        <Typography sx={{ml: 3}} variant="body2"
                                    fontStyle="italic">{history.last_project_date}</Typography>
                    </Box>
                    <Divider sx={{mb: 1}}/>

                    <Box sx={{display: "flex", justifyContent: "left"}}>
                        <Typography variant="body2">Total hours worked</Typography>
                        <Typography sx={{ml: 3}} variant="body2" fontStyle="italic">{history.total_hours}</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CollaborationHistory;