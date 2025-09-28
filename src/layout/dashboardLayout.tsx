import { Box, CssBaseline, useTheme } from '@mui/material';
import PFHeader from '../design-system/components/PFHeader';
import PFSidebar, { SIDEBAR_WIDTH } from '@/design-system/components/pfsidebar/PFSidebar';
import { navData } from '@/routes/nav-config';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme(); // Forçar a aplicação do tema MUI
  return (
    <Box
      id="dashboardlayout"
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%', // <- corrige overflow-x causado pelo 100vw
        overflowX: 'hidden', // <- garante que não apareça barra lateral horizontal
        bgcolor: theme.palette.background.default,
      }}
    >
      <CssBaseline />
      <PFSidebar navData={navData} />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          pl: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          transition: 'padding-left 0.3s ease',
        }}
      >
        <PFHeader />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
