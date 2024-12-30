//will remove this line after we get a proper sample data and API response
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  IconButton,
  Stack,
  Container
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PermissionTableCell from "@components/PermissionTable/PermissonRow";
import CenteredLayout from "@components/Layouts/CenteredLayout";

const permissionsData = [
  {
    name: "repo",
    description: "Full control of private repositories",
    children: [
      {
        name: "repo:status",
        description: "Access commit status"
      },
      {
        name: "repo:status",
        description: "Access commit status"
      },
      {
        name: "repo:status",
        description: "Access commit status"
      },
      {
        name: "repo:status",
        description: "Access commit status"
      },
      {
        name: "repo:status",
        description: "Access commit status"
      }
    ]
  },
  {
    name: "repo2222",
    description: "Full control of private repositories",
    children: [
      {
        name: "repo:status",
        description: "Access commit status"
      },
      {
        name: "repo:status",
        description: "Access commit status"
      }
    ]
  },
  {
    name: "repo2222",
    description: "Full control of private repositories"
  }
];

const PermissionProfile = () => {
  const [token] = useState("ibfdzca-puasyosufq-zmmmmvucx-cxcxcx");

  const renderPermissionRow = (permission: any, index: number) => {
    return (
      <React.Fragment key={`permission-${index}`}>
        <TableRow key={`permission-${index}`}>
          <PermissionTableCell isParentPermission isLastPermission={!permission.children}>
            <FormControlLabel control={<Switch />} label={permission.name} />
          </PermissionTableCell>
          <PermissionTableCell isParentPermission isLastPermission={!permission.children}>
            <Typography>{permission.description}</Typography>
          </PermissionTableCell>
        </TableRow>
        {permission.children &&
          permission.children.map((childPermission: any, childIndex: number) => (
            <TableRow key={`permission-child-${childIndex}`}>
              <PermissionTableCell
                isLastPermission={childIndex == permission.children.length - 1}
                isToggleCell
              >
                <FormControlLabel control={<Switch />} label={childPermission.name} />
              </PermissionTableCell>
              <PermissionTableCell isLastPermission={childIndex == permission.children.length - 1}>
                <Typography>{childPermission.description}</Typography>
              </PermissionTableCell>
            </TableRow>
          ))}
      </React.Fragment>
    );
  };

  return (
    <CenteredLayout>
      <Container maxWidth='md'>
        <Stack gap={2}>
          <Box
            sx={{
              borderWidth: 1,
              borderColor: "grey.100",
              borderStyle: "solid",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              overflow: "hidden"
            }}
          >
            <Box padding={2}>
              <Typography fontWeight='bold' sx={{ marginBottom: 2 }}>
                Create an API Permissions Profile
              </Typography>

              <Stack alignItems={"center"}>
                <TextField label='Enter Email Address' variant='outlined' sx={{ width: "50%" }} />
              </Stack>
            </Box>
            <Divider />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Select API Permissions</TableCell>
                    <TableCell>Integrations</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissionsData.map((permisson, index) => renderPermissionRow(permisson, index))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Stack direction='row' justifyContent='space-between'>
            <Button variant='contained' color='primary'>
              Save Profile
            </Button>
            <TextField
              variant='outlined'
              value={token}
              label='API Token'
              sx={{ width: "50%" }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    size='small'
                    sx={{
                      color: "primary.main"
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                )
              }}
            />
          </Stack>
        </Stack>
      </Container>
    </CenteredLayout>
  );
};

export default PermissionProfile;
