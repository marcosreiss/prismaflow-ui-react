// dashboardLayout.tsx
import { Box, CssBaseline, useTheme } from '@mui/material';
import { useState } from 'react';
import PFHeader from '../components/PFHeader';
import PFSidebar, { SIDEBAR_WIDTH } from '@/components/pfsidebar/PFSidebar';
import { navData } from '@/routes/nav-config';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      id="dashboardlayout"
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        bgcolor: theme.palette.background.default,
      }}
    >
      <CssBaseline />
      <PFSidebar
        navData={navData}
        openMobile={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          pl: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          transition: 'padding-left 0.3s ease',
        }}
      >
        <PFHeader onToggleSidebar={handleToggleSidebar} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
