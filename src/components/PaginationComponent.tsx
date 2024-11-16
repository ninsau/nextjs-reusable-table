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
  const [isDarkMode, setIsDarkModeState] = useState(false);

  useEffect(() => {
    if (enableDarkMode) {
      const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkModeState(matchMedia.matches);
      const handleChange = () => setIsDarkModeState(matchMedia.matches);
      matchMedia.addEventListener("change", handleChange);
      return () => {
        matchMedia.removeEventListener("change", handleChange);
      };
    }
  }, [enableDarkMode]);

  const buttonClassName = disableDefaultStyles
    ? customClassNames.button || ""
    : `px-4 py-2 rounded ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
      }`;

  const disabledButtonClassName = disableDefaultStyles
    ? customClassNames.buttonDisabled || ""
    : `opacity-50 cursor-not-allowed ${buttonClassName}`;

  return (
    <div
      className={
        disableDefaultStyles
          ? customClassNames.container || ""
          : "flex justify-between items-center"
      }
    >
      <button
        disabled={page === 1}
        onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
        className={page === 1 ? disabledButtonClassName : buttonClassName}
      >
        Previous
      </button>
      <span
        className={
          disableDefaultStyles
            ? customClassNames.pageInfo || ""
            : isDarkMode
            ? "text-white"
            : "text-black"
        }
      >
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() =>
          setPage((prevPage) => Math.min(prevPage + 1, totalPages))
        }
        className={
          page === totalPages ? disabledButtonClassName : buttonClassName
        }
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;
