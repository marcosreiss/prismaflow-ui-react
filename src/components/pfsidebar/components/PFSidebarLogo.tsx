import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function PFSidebarLogo() {
  const theme = useTheme();
  const [imgError, setImgError] = useState(false);

  const logoSrc =
    theme.palette.mode === "dark"
      ? "/images/logo_prismaflow_dark.webp"
      : "/images/logo_prismaflow.webp";

  return (
    <Box
      component="a"
      href="/"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
      }}
    >
      {!imgError ? (
        <img
          src={logoSrc}
          alt="PrismaFlow"
          style={{
            width: 160,
            height: 40,
            objectFit: "contain",
          }}
          onError={() => setImgError(true)}
        />
      ) : (
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: theme.palette.text.primary }}
        >
          PrismaFlow
        </Typography>
      )}
    </Box>
  );
}
