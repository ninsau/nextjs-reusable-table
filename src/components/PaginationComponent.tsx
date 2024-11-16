"use client";

import React, { useState, useEffect } from "react";
import { PaginationComponentProps } from "../types";

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  page,
  setPage,
  totalPages,
  disableDefaultStyles = false,
  customClassNames = {},
  enableDarkMode = true,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (enableDarkMode) {
      const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(matchMedia.matches);
      const handleChange = () => setIsDarkMode(matchMedia.matches);
      matchMedia.addEventListener("change", handleChange);
      return () => {
        matchMedia.removeEventListener("change", handleChange);
      };
    }
  }, [enableDarkMode]);

  const buttonClassName = `px-4 py-2 rounded ${
    disableDefaultStyles
      ? customClassNames.button || ""
      : isDarkMode
      ? "bg-gray-800 text-white"
      : "bg-gray-200 text-black"
  }`;

  return (
    <div className="flex justify-between items-center">
      <button
        disabled={page === 1}
        onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
        className={buttonClassName}
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() =>
          setPage((prevPage) => Math.min(prevPage + 1, totalPages))
        }
        className={buttonClassName}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;
