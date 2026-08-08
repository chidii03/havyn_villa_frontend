declare module "@phosphor-icons/react" {
  import type { ComponentType, SVGProps } from "react";

  export type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  export type Icon = ComponentType<
    SVGProps<SVGSVGElement> & {
      alt?: string;
      color?: string;
      mirrored?: boolean;
      size?: number | string;
      weight?: IconWeight;
    }
  >;
}

declare module "@phosphor-icons/react/ssr" {
  import type { Icon } from "@phosphor-icons/react";

  export const ArrowUp: Icon;
  export const ArrowsOut: Icon;
  export const Barbell: Icon;
  export const Bathtub: Icon;
  export const Bed: Icon;
  export const Bell: Icon;
  export const Building: Icon;
  export const Calendar: Icon;
  export const CalendarCheck: Icon;
  export const CaretLeft: Icon;
  export const CaretRight: Icon;
  export const CarSimple: Icon;
  export const ChartBar: Icon;
  export const ChatCircle: Icon;
  export const Check: Icon;
  export const CheckCircle: Icon;
  export const Coffee: Icon;
  export const Compass: Icon;
  export const CookingPot: Icon;
  export const FireExtinguisher: Icon;
  export const FunnelSimple: Icon;
  export const GlobeSimple: Icon;
  export const GridFour: Icon;
  export const Heart: Icon;
  export const House: Icon;
  export const ImageSquare: Icon;
  export const Key: Icon;
  export const Lifebuoy: Icon;
  export const List: Icon;
  export const MagnifyingGlass: Icon;
  export const MapPin: Icon;
  export const MapTrifold: Icon;
  export const Minus: Icon;
  export const PawPrint: Icon;
  export const PencilSimple: Icon;
  export const PlayCircle: Icon;
  export const Plus: Icon;
  export const Rows: Icon;
  export const ShieldCheck: Icon;
  export const Snowflake: Icon;
  export const Sparkle: Icon;
  export const Star: Icon;
  export const Suitcase: Icon;
  export const Television: Icon;
  export const Thermometer: Icon;
  export const Trash: Icon;
  export const User: Icon;
  export const UsersThree: Icon;
  export const VideoCamera: Icon;
  export const Wallet: Icon;
  export const Warning: Icon;
  export const WashingMachine: Icon;
  export const Waves: Icon;
  export const WifiHigh: Icon;
  export const X: Icon;
  export const XCircle: Icon;
}
