import * as React from "react";
import {
    Box,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import * as LucideIcons from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import PFSidebarSubItem from "./PFSidebarSubItem";
import type { NavItem } from "../types";

export type PFSidebarItemProps = {
    item: NavItem;
    active: string | null;
    setActive: (val: string) => void;
    onNavigate: (path: string) => void;
    isMobile?: boolean;
    onCloseMobile?: () => void;
};

export default function PFSidebarItem({
    item,
    active,
    setActive,
    onNavigate,
    isMobile,
    onCloseMobile,
}: PFSidebarItemProps) {
    const theme = useTheme();
    const Icon = LucideIcons[item.icon] as React.ElementType;
    const isActive = active === item.title;
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        if (item.children) {
            // apenas abre/fecha dropdown
            setOpen((prev) => !prev);
        } else if (item.path) {
            setActive(item.title);
            onNavigate(item.path);
            // 🔥 Fecha Drawer se estiver no mobile
            if (isMobile && onCloseMobile) onCloseMobile();
        }
    };

    return (
        <>
            <ListItemButton
                onClick={handleClick}
                sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    px: 2,
                    py: 1,
                    color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    bgcolor: isActive
                        ? alpha(theme.palette.primary.main, 0.08)
                        : "transparent",
                    borderLeft: isActive
                        ? `3px solid ${theme.palette.primary.main}`
                        : "3px solid transparent",
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

                {item.children && (
                    <Box sx={{ ml: 1, color: "text.secondary" }}>
                        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </Box>
                )}
            </ListItemButton>

            {item.children && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 3 }}>
                        {item.children.map((child) => (
                            <PFSidebarSubItem
                                key={child.title}
                                child={child}
                                active={active}
                                setActive={setActive}
                                onNavigate={(path) => {
                                    onNavigate(path);
                                    // 🔥 fecha Drawer no mobile ao clicar em subitem
                                    if (isMobile && onCloseMobile) onCloseMobile();
                                }}
                            />
                        ))}
                    </Box>
                </Collapse>
            )}
        </>
    );
}
