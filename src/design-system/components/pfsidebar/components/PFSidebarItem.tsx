import * as React from "react";
import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import * as LucideIcons from "lucide-react";
import PFSidebarSubItem from "./PFSidebarSubItem";
import type { NavItem } from "../types";

export type PFSidebarItemProps = {
    item: NavItem;
    active: string | null;
    setActive: (val: string) => void;
    onNavigate: (path: string) => void;
};

export default function PFSidebarItem({
    item,
    active,
    setActive,
    onNavigate,
}: PFSidebarItemProps) {
    const theme = useTheme();
    const Icon = LucideIcons[item.icon] as React.ElementType;
    const isActive = active === item.title;

    return (
        <>
            <ListItemButton
                onClick={() => {
                    if (item.path) {
                        setActive(item.title);
                        onNavigate(item.path);
                    }
                }}
                sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    px: 2,
                    py: 1,
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    bgcolor: isActive
                        ? alpha(theme.palette.primary.main, 0.08)
                        : "transparent",
                    borderLeft: isActive ? `3px solid ${theme.palette.primary.main}` : "3px solid transparent",
                    "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                    },
                }}
            >
                <ListItemIcon sx={{ minWidth: 28, color: "inherit" }}>
                    <Icon size={18} />
                </ListItemIcon>
                <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: isActive ? 600 : 400,
                    }}
                />
            </ListItemButton>

            {item.children && (
                <Box sx={{ pl: 3 }}>
                    {item.children.map((child) => (
                        <PFSidebarSubItem
                            key={child.title}
                            child={child}
                            active={active}
                            setActive={setActive}
                            onNavigate={onNavigate}
                        />
                    ))}
                </Box>
            )}
        </>
    );
}
