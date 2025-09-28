import * as React from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import * as LucideIcons from "lucide-react";
import type { NavChild } from "../types";

export type PFSidebarSubItemProps = {
    child: NavChild;
    active: string | null;
    setActive: (val: string) => void;
    onNavigate: (path: string) => void;
};

export default function PFSidebarSubItem({
    child,
    active,
    setActive,
    onNavigate,
}: PFSidebarSubItemProps) {
    const theme = useTheme();
    const ChildIcon = LucideIcons[child.icon] as React.ElementType;
    const isChildActive = active === child.title;

    return (
        <ListItemButton
            onClick={() => {
                setActive(child.title);
                onNavigate(child.path);
            }}
            sx={{
                borderRadius: 2,
                mb: 0.5,
                px: 2,
                py: 0.75,
                color: isChildActive ? theme.palette.primary.main : theme.palette.text.secondary,
                bgcolor: isChildActive
                    ? alpha(theme.palette.primary.main, 0.08)
                    : "transparent",
                borderLeft: isChildActive
                    ? `3px solid ${theme.palette.primary.main}`
                    : "3px solid transparent",
                "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                },
            }}
        >
            <ListItemIcon sx={{ minWidth: 28, color: "inherit" }}>
                <ChildIcon size={16} />
            </ListItemIcon>
            <ListItemText
                primary={child.title}
                primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: isChildActive ? 600 : 400,
                }}
            />
        </ListItemButton>
    );
}
