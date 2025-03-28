"use client";
import type React from "react";
import type { NoContentProps } from "../types";

const NoContentComponent: React.FC<NoContentProps> = ({
  name = "items",
  text,
  icon,
}) => (
  <div className="text-center py-10">
    {icon ? (
      icon
    ) : (
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        role="presentation"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    )}
    <p className="text-gray-500">{text ? text : `No ${name} found.`}</p>
  </div>
);
export default NoContentComponent;
