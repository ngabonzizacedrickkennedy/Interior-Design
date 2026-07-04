function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function ClipboardIcon() {
  return (
    <Icon>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 15h6" />
    </Icon>
  );
}

export function ReceiptIcon() {
  return (
    <Icon>
      <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3Z" />
      <path d="M9 8h6M9 12h6" />
    </Icon>
  );
}

export function FolderIcon() {
  return (
    <Icon>
      <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.5H19.5A1.5 1.5 0 0 1 21 9v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18Z" />
    </Icon>
  );
}

export function StarIcon() {
  return (
    <Icon>
      <path d="m12 3 2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6Z" />
    </Icon>
  );
}

export function BellIcon() {
  return (
    <Icon>
      <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </Icon>
  );
}

export function CheckSquareIcon() {
  return (
    <Icon>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="m8 12 2.5 2.5L16 9" />
    </Icon>
  );
}

export function ImageIcon() {
  return (
    <Icon>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="10" r="1.75" />
      <path d="m5 18 5-5 3 3 3-4 3.5 6" />
    </Icon>
  );
}

export function BarChartIcon() {
  return (
    <Icon>
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </Icon>
  );
}

export function ShieldIcon() {
  return (
    <Icon>
      <path d="M12 3.5c2.5 1.3 4.5 1.8 7 1.8 0 8.4-3 12.4-7 15.2-4-2.8-7-6.8-7-15.2 2.5 0 4.5-.5 7-1.8Z" />
    </Icon>
  );
}

export function UsersIcon() {
  return (
    <Icon>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 4.5a3 3 0 0 1 0 6.9M21 20a5.5 5.5 0 0 0-4.5-6.4" />
    </Icon>
  );
}

export function HomeIcon() {
  return (
    <Icon>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9.5h12V10" />
    </Icon>
  );
}

export function SparkleIcon() {
  return (
    <Icon>
      <path d="M12 3v4M12 17v4M4 12h4M16 12h4" />
      <path d="m7 7 2 2M15 15l2 2M17 7l-2 2M9 15l-2 2" />
    </Icon>
  );
}

export function WalletIcon() {
  return (
    <Icon>
      <rect x="3.5" y="6" width="17" height="13" rx="2" />
      <path d="M3.5 9h17" />
      <circle cx="16.5" cy="13.5" r="1.25" />
    </Icon>
  );
}

export function UserCircleIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6 19c1-3 3.5-4.5 6-4.5s5 1.5 6 4.5" />
    </Icon>
  );
}

export function PaletteIcon() {
  return (
    <Icon>
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-1 1.2-1.9-.4-.6-.1-1.4.6-1.5H15a4 4 0 0 0 4-4c0-5.8-3.6-10.6-7-10.6Z" />
      <circle cx="8" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export const NAV_ICONS = {
  dashboard: HomeIcon,
  requests: ClipboardIcon,
  assessments: SparkleIcon,
  account: WalletIcon,
  quotations: ReceiptIcon,
  projects: FolderIcon,
  feedback: StarIcon,
  notifications: BellIcon,
  tasks: CheckSquareIcon,
  "design-files": ImageIcon,
  analytics: BarChartIcon,
  security: ShieldIcon,
  clients: UsersIcon,
};
