import { FC } from "react";

export const LoadingFallback: FC = () => (
  <div className="loadingfallback flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
  </div>
);
