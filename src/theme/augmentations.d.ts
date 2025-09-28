import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    gradient: {
      prism: string;
      prismHover: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      prism?: string;
      prismHover?: string;
    };
  }

  interface TypographyVariants {
    hero: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    hero?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    hero: true;
  }
}
