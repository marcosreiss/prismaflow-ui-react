import * as React from "react";
import { Box, Drawer, List, Toolbar, useTheme } from "@mui/material";
import { usePathname } from "@/routes/hooks/use-pathname";
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
    const pathname = usePathname();
    const router = useRouter();
    const [active, setActive] = React.useState<string | null>(null);

    React.useEffect(() => {
        const current = findActiveByPath(navData, pathname);
        if (current) setActive(current);
    }, [pathname, navData]);

    const handleNavigate = (path: string) => {
        router.push(path);
        if (onCloseMobile) onCloseMobile(); // 🔥 fecha drawer ao navegar (mobile)
    };

    const content = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar
                sx={{
                    justifyContent: "center",
                    py: 2,
                    minHeight: 64,
                    borderBottom: "1px solid",
                    borderColor: theme.palette.divider,
                }}
            >
                <PFSidebarLogo />
            </Toolbar>

            <Box sx={{ flexGrow: 1, px: 1.5, pt: 2 }}>
                <List disablePadding>
                    {navData.map((item) => (
                        <PFSidebarItem
                            key={item.title}
                            item={item}
                            active={active}
                            setActive={setActive}
                            onNavigate={handleNavigate}
                            isMobile={!!openMobile}
                            onCloseMobile={onCloseMobile}
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
                        borderRight: "1px solid",
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
                        borderRight: "1px solid",
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

function findActiveByPath(navData: NavItem[], path: string): string | null {
    for (const item of navData) {
        if (item.path === path) return item.title;
        if (item.children) {
            for (const child of item.children) {
                if (child.path === path) return child.title;
            }
        }
    }
    return null;
}
