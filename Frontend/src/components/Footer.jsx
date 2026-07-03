import {
  MailIcon,
  InstagramIcon,
  PinterestIcon,
  TwitterIcon,
} from "./icons/SocialIcons";
import "./Footer.css";

const SOCIAL_LINKS = [
  { label: "Email", href: "mailto:hello@spacedesigngroup.com", Icon: MailIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "Pinterest", href: "#", Icon: PinterestIcon },
  { label: "Twitter", href: "#", Icon: TwitterIcon },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__row">
        <span>© {new Date().getFullYear()} Space Design Group</span>
        <div className="footer__links">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a key={label} href={href} aria-label={label} title={label}>
              <Icon className="footer__icon" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
