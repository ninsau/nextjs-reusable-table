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

  const baseContainerClassName = isDarkMode
    ? "bg-gray-900 text-gray-200 border-t border-gray-700"
    : "bg-white text-gray-900 border-t border-gray-200";

  const baseButtonClassName = isDarkMode
    ? "px-4 py-2 bg-gray-800 text-gray-200 rounded disabled:bg-gray-700 disabled:text-gray-500"
    : "px-4 py-2 bg-gray-100 text-gray-900 rounded disabled:bg-gray-200 disabled:text-gray-500";

  const basePageInfoClassName = isDarkMode ? "text-gray-200" : "text-gray-900";

  const containerClassName = disableDefaultStyles
    ? customClassNames.container || ""
    : `flex justify-between items-center ${baseContainerClassName} ${
        customClassNames.container || ""
      }`;

  const buttonClassName = disableDefaultStyles
    ? customClassNames.button || ""
    : `${baseButtonClassName} ${customClassNames.button || ""}`;

  const pageInfoClassName = disableDefaultStyles
    ? customClassNames.pageInfo || ""
    : `${basePageInfoClassName} ${customClassNames.pageInfo || ""}`;

  const handleNextPage = () =>
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const handlePrevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <div className={containerClassName}>
      <button
        disabled={page === 1}
        onClick={handlePrevPage}
        className={buttonClassName}
      >
        Previous
      </button>
      <span className={pageInfoClassName}>
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={handleNextPage}
        className={buttonClassName}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;
