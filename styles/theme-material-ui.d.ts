import { Theme, ThemeOptions } from '@mui/material/styles';
import type {
  LabComponents
} from '@mui/lab/themeAugmentation';


declare module '@mui/material/styles' {
  interface CustomTheme extends Theme, LabComponents {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions, LabComponents {
    status?: {
      danger?: string;
    };
  }
  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}