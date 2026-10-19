import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/Icons";
import type { ContactKind } from "@/lib/contact";

export function ContactIcon({ kind, size = 16 }: { kind: ContactKind; size?: number }) {
  const props = { width: size, height: size };
  switch (kind) {
    case "email":
      return <MailIcon {...props} />;
    case "linkedin":
      return <LinkedInIcon {...props} />;
    case "github":
      return <GitHubIcon {...props} />;
    case "resume":
      return <FileIcon {...props} />;
  }
}
