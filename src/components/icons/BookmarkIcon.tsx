import React from "react";

type BookmarkIconProps = React.SVGProps<SVGSVGElement> & {
  className?: string;
  filled?: boolean;
};

export const BookmarkIcon: React.FC<BookmarkIconProps> = ({
  className = "",
  filled = false,
  ...props
}) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
};
