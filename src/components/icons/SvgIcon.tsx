import React from "react";

type SvgIconProps = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

export const SvgIcon: React.FC<SvgIconProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E4DD3B] flex-shrink-0 ${className}`}
      {...props}
    >
      {children}
    </svg>
  );
};
