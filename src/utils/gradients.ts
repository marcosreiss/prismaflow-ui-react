import { useTheme, type Theme } from '@mui/material/styles';

export const usePrismGradient = () => {
  const theme = useTheme<Theme>();
  return {
    prism: theme.palette.gradient.prism,
    prismHover: theme.palette.gradient.prismHover,
  };
};
