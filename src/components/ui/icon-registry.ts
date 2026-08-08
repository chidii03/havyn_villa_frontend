import {
  ArrowUp,
  ArrowsOut,
  Barbell,
  Bathtub,
  Bed,
  Bell,
  Building,
  Calendar,
  CalendarCheck,
  CaretLeft,
  CaretRight,
  CarSimple,
  ChartBar,
  ChatCircle,
  Check,
  CheckCircle,
  Coffee,
  Compass,
  CookingPot,
  FireExtinguisher,
  FunnelSimple,
  GlobeSimple,
  GridFour,
  Heart,
  House,
  ImageSquare,
  Key,
  Lifebuoy,
  List,
  MagnifyingGlass,
  MapPin,
  MapTrifold,
  Minus,
  PawPrint,
  PencilSimple,
  PlayCircle,
  Plus,
  Rows,
  ShieldCheck,
  Snowflake,
  Sparkle,
  Star,
  Suitcase,
  Television,
  Thermometer,
  Trash,
  User,
  UsersThree,
  VideoCamera,
  Wallet,
  Warning,
  WashingMachine,
  Waves,
  WifiHigh,
  X,
  XCircle,
} from "@phosphor-icons/react/ssr";
// Type-only — erased at build time, so importing from the main (context-based)
// entrypoint is safe even though the runtime icon components above come from /ssr.
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

/**
 * Single source of truth for every icon used in app code — see
 * frontend/02-components-and-patterns.md. Import icons through `<Icon name="..." />`
 * (components/ui/icon.tsx), never straight from @phosphor-icons/react, so the set stays
 * swappable and consistent.
 *
 * iconsax-react was evaluated for the "premium rounded" nav/key-action treatment the
 * design note asked for, but the package hasn't been published since 2022 (single
 * maintainer, abandoned) — shipping it in a production app is a real supply-chain
 * risk for a purely cosmetic upgrade. Phosphor's `duotone`/`fill` weights (see
 * icon.tsx) cover the same "richer than a plain line icon" need without adding an
 * unmaintained dependency; revisit if a maintained alternative appears.
 *
 * Imports from `@phosphor-icons/react/ssr`, not the default export — several
 * consumers of these icons (e.g. EmptyState/ErrorState) render from both Server and
 * Client Components, and the default (`/dist/csr`) variant relies on React Context for
 * its optional global styling, which Server Components can't use at all.
 */
export const ICON_REGISTRY = {
  arrowUp: ArrowUp,
  search: MagnifyingGlass,
  heart: Heart,
  heartFilled: Heart, // same glyph — pass weight="fill" via <Icon> for the filled look
  menu: List,
  globe: GlobeSimple,
  filter: FunnelSimple,
  star: Star,
  mapPin: MapPin,
  calendar: Calendar,
  calendarCheck: CalendarCheck,
  user: User,
  close: X,
  chevronLeft: CaretLeft,
  chevronRight: CaretRight,
  sparkle: Sparkle,
  bell: Bell,
  house: House,
  building: Building,
  shieldCheck: ShieldCheck,
  suitcase: Suitcase,
  chatCircle: ChatCircle,
  lifebuoy: Lifebuoy,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  warning: Warning,
  chartBar: ChartBar,
  minus: Minus,
  plus: Plus,
  compass: Compass,
  // Property discovery (prompt 20).
  image: ImageSquare,
  playCircle: PlayCircle,
  bed: Bed,
  bathtub: Bathtub,
  guests: UsersThree,
  mapView: MapTrifold,
  listView: Rows,
  expand: ArrowsOut,
  gridFour: GridFour,
  // Amenity taxonomy — mirrors apps/api V1__init.sql amenity codes.
  wifi: WifiHigh,
  pool: Waves,
  kitchen: CookingPot,
  ac: Snowflake,
  parking: CarSimple,
  tv: Television,
  washer: WashingMachine,
  heating: Thermometer,
  selfCheckIn: Key,
  petFriendly: PawPrint,
  gym: Barbell,
  securityCamera: VideoCamera,
  safetyAlarm: FireExtinguisher,
  breakfast: Coffee,
  // Host dashboard (prompt 17).
  wallet: Wallet,
  pencil: PencilSimple,
  trash: Trash,
  check: Check,
} satisfies Record<string, PhosphorIcon>;

export type IconName = keyof typeof ICON_REGISTRY;
