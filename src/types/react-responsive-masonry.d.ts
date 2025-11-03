declare module "react-responsive-masonry" {
  import type { ComponentType, ReactNode } from "react";

  export interface ResponsiveMasonryProps {
    columnsCountBreakPoints?: Record<number, number>;
    children: ReactNode;
  }

  export interface MasonryProps {
    children: ReactNode;
    gutter?: string;
    className?: string;
  }

  export const ResponsiveMasonry: ComponentType<ResponsiveMasonryProps>;

  const Masonry: ComponentType<MasonryProps>;
  export default Masonry;
}

