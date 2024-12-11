"use client";

import React from "react";

interface NoContentProps {
  name: string;
  text?: string;
  icon?: React.ReactNode;
  component?: React.ReactNode;
}

const NoContentComponent: React.FC<NoContentProps> = ({
  name,
  text,
  icon,
  component,
}) => {
  if (component) return <>{component}</>;
  return (
    <div className="text-center py-10">
      {icon || (
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      )}
      <p className="text-gray-500">{text || `No ${name} found.`}</p>
    </div>
  );
};

export default NoContentComponent;
