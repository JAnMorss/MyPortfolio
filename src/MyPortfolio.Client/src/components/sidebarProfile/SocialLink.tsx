"use client";

type SocialLinkProps = {
  icon: React.ElementType;
  url?: string;
  label: string;
};

export default function SocialLink({ icon: Icon, url, label }: SocialLinkProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate"
        >
          {label}
        </a>
      ) : (
        <span>{label}</span>
      )}
    </div>
  );
}