import * as LucideIcons from "lucide-react";

export type LucideIconName = keyof typeof LucideIcons;

export type NavChild = {
  title: string;
  path: string;
  icon: LucideIconName;
};

export type NavItem = {
  title: string;
  path?: string;
  icon: LucideIconName;
  children?: NavChild[];
};
