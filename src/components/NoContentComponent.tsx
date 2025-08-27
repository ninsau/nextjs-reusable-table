"use client";
import type React from "react";
import type { NoContentProps } from "../types";

const NoContentComponent: React.FC<NoContentProps> = ({
  name = "No data",
  text,
  icon,
}) => (
  <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
    {icon === undefined ? (
      <svg
        className="mx-auto h-16 w-16 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        role="img"
        aria-label={name}
      >
        <title>{name}</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ) : (
      icon
    )}
    <p className="text-gray-500 text-lg">{text !== undefined ? text : "No data available"}</p>
  </div>
);
export default NoContentComponent;
