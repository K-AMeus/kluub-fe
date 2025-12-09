import React from "react";

type BeeIconProps = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

export const BeeIcon: React.FC<BeeIconProps> = ({
  className = "",
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12 2c-1.1 0-2 .9-2 2 0 .3.1.6.2.9C8.5 5.5 7.3 6.8 6.5 8.5c-.5-.2-1-.3-1.5-.3-1.7 0-3 1.3-3 3s1.3 3 3 3c.5 0 1-.1 1.5-.3.8 1.7 2 3 3.7 3.6-.1.3-.2.6-.2.9 0 1.1.9 2 2 2s2-.9 2-2c0-.3-.1-.6-.2-.9 1.7-.6 2.9-1.9 3.7-3.6.5.2 1 .3 1.5.3 1.7 0 3-1.3 3-3s-1.3-3-3-3c-.5 0-1 .1-1.5.3-.8-1.7-2-3-3.7-3.6.1-.3.2-.6.2-.9 0-1.1-.9-2-2-2zm0 6c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"/>
      <circle cx="10" cy="11" r="1"/>
      <circle cx="14" cy="11" r="1"/>
      <path d="M12 14c.8 0 1.5-.3 2-.9-.6-.1-1.3-.1-2-.1s-1.4 0-2 .1c.5.6 1.2.9 2 .9z"/>
    </svg>
  );
};
