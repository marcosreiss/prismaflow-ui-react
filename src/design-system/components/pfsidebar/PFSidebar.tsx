import * as React from "react";
import { Box, Drawer, List, Toolbar, useTheme } from "@mui/material";
import { useRouter } from "@/routes/hooks";
import PFSidebarLogo from "./components/PFSidebarLogo";
import PFSidebarItem from "./components/PFSidebarItem";
import type { NavItem } from "./types";

export type PFSidebarProps = {
    navData: NavItem[];
    openMobile?: boolean;
    onCloseMobile?: () => void;
};

export const SIDEBAR_WIDTH = 260;

export default function PFSidebar({
    navData,
    openMobile,
    onCloseMobile,
}: PFSidebarProps) {
    const theme = useTheme();
    const router = useRouter();
    const [active, setActive] = React.useState<string | null>(null);

    const content = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Logo */}
            <Toolbar
                sx={{
                    justifyContent: "center",
                    py: 2,
                    minHeight: 64,
                    borderColor: theme.palette.divider,
                }}
            >
                <PFSidebarLogo />
            </Toolbar>

            {/* Itens */}
            <Box sx={{ flexGrow: 1, px: 1.5, pt: 2 }}>
                <List disablePadding>
                    {navData.map((item) => (
                        <PFSidebarItem
                            key={item.title}
                            item={item}
                            active={active}
                            setActive={setActive}
                            onNavigate={(path) => router.push(path)}
                        />
                    ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Mobile */}
            <Drawer
                open={openMobile}
                onClose={onCloseMobile}
                variant="temporary"
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: SIDEBAR_WIDTH,
                        boxSizing: "border-box",
                        borderColor: theme.palette.divider,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: "none",
                    },
                }}
            >
                {content}
            </Drawer>

            {/* Desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    "& .MuiDrawer-paper": {
                        width: SIDEBAR_WIDTH,
                        boxSizing: "border-box",
                        borderRight: "none",
                        borderColor: theme.palette.divider,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: "none",
                    },
                }}
                open
            >
                {content}
            </Drawer>
        </>
    );
}
