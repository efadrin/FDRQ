import { Box, styled } from "@mui/material";

const PermissionTableWrapper = styled(Box)(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.palette.grey[100],
  borderStyle: "solid",
  borderBottomLeftRadius: theme.spacing(1.5),
  borderBottomRightRadius: theme.spacing(1.5),
  overflow: "hidden"
}));
export default PermissionTableWrapper;
