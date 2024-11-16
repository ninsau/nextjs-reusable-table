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

  const baseButtonClassName = disableDefaultStyles
    ? customClassNames.button || ""
    : `px-3 py-1 mx-1 rounded-md ${
        isDarkMode
          ? "bg-gray-800 text-white hover:bg-gray-700"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`;

  const disabledButtonClassName = disableDefaultStyles
    ? customClassNames.buttonDisabled || ""
    : `opacity-50 cursor-not-allowed ${baseButtonClassName}`;

  const pageInfoClassName = disableDefaultStyles
    ? customClassNames.pageInfo || ""
    : `px-3 py-1 mx-1 text-sm ${
        isDarkMode ? "text-gray-300" : "text-gray-700"
      }`;

  return (
    <div
      className={
        disableDefaultStyles
          ? customClassNames.container || ""
          : "flex justify-center items-center mt-4"
      }
    >
      <button
        disabled={page === 1}
        onClick={() => setPage(1)}
        className={page === 1 ? disabledButtonClassName : baseButtonClassName}
      >
        First
      </button>
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={page === 1 ? disabledButtonClassName : baseButtonClassName}
      >
        Previous
      </button>
      <span className={pageInfoClassName}>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className={
          page === totalPages ? disabledButtonClassName : baseButtonClassName
        }
      >
        Next
      </button>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(totalPages)}
        className={
          page === totalPages ? disabledButtonClassName : baseButtonClassName
        }
      >
        Last
      </button>
    </div>
  );
};

export default PaginationComponent;
