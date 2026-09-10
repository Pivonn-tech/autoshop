declare module "next/font/google" {
  interface FontOptions {
    subsets?: string[];
    variable?: string;
    display?: string;
    weight?: string | string[];
    style?: string | string[];
    preload?: boolean;
  }

  interface FontResult {
    className: string;
    variable: string;
    style: { fontFamily: string; fontWeight?: number; fontStyle?: string };
  }

  export function Inter(options: FontOptions): FontResult;
  export function Space_Grotesk(options: FontOptions): FontResult;
  export function Roboto(options: FontOptions): FontResult;
  export function Open_Sans(options: FontOptions): FontResult;
  export function Lato(options: FontOptions): FontResult;
  export function Montserrat(options: FontOptions): FontResult;
  export function Poppins(options: FontOptions): FontResult;
  export function Raleway(options: FontOptions): FontResult;
  export function Nunito(options: FontOptions): FontResult;
  export function Source_Sans_3(options: FontOptions): FontResult;
}
