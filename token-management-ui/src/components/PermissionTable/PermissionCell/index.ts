import { styled, TableCell, TableCellProps, Theme } from "@mui/material";

interface PermissionCellProps {
  isParentPermission?: boolean;
  isLastPermission?: boolean;
  isToggleCell?: boolean;
}
interface StyledTableCellProps extends TableCellProps, PermissionCellProps {}

interface HandlePermissionTableCellYPaddingParams extends PermissionCellProps {
  theme: Theme;
}

const handlePermissionTableCellPadding = (params: HandlePermissionTableCellYPaddingParams) => {
  const defaultPadding = params.theme.spacing(2);
  if (params.isParentPermission) {
    if (params.isLastPermission) {
      return defaultPadding;
    }
    return `${defaultPadding} ${defaultPadding} 0 ${defaultPadding}`;
  }
  const childLeftPadding = params.isToggleCell ? params.theme.spacing(5) : defaultPadding;

  if (params.isLastPermission) {
    return `0 ${defaultPadding} ${defaultPadding} ${childLeftPadding}`;
  }
  return `0 ${defaultPadding} 0 ${childLeftPadding}`;
};

const shouldForwardProp = (propName: string) => {
  const interfaceKeys = ["isParentPermission", "isLastPermission", "isToggleCell"];
  return !interfaceKeys.includes(propName);
};

const PermissionTableCell = styled(TableCell, { shouldForwardProp })<StyledTableCellProps>(
  ({ theme, isParentPermission, isLastPermission, isToggleCell }) => ({
    padding: handlePermissionTableCellPadding({
      theme,
      isLastPermission,
      isParentPermission,
      isToggleCell
    }),
    borderBottomWidth: isLastPermission ? 1 : 0,
    borderColor: theme.palette.grey[100]
  })
);

export default PermissionTableCell;
