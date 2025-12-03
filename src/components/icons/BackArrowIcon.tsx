import { SvgIcon } from "./SvgIcon";

export const BackArrowIcon = ({ className = "", ...props }) => {
  return (
    <SvgIcon
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
        clipRule="evenodd"
      />
    </SvgIcon>
  );
};
