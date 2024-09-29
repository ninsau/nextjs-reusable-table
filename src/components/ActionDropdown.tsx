import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ActionDropdownProps } from "../types";

const ActionDropdown = <T,>({
  item,
  index,
  actionTexts,
  actionFunctions,
  disableDefaultStyles = false,
  customClassNames = {},
  enableDarkMode = true, 
}: ActionDropdownProps<T> & { enableDarkMode?: boolean }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: Math.min(
          rect.left + window.scrollX - 10,
          window.innerWidth - 240
        ),
      });
    }
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleDropdownClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  // Base class names for light and dark modes
  const baseTdClassName = isDarkMode
    ? "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 bg-gray-800 text-gray-300"
    : "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 bg-white text-gray-700";

  const baseButtonClassName = isDarkMode
    ? "focus:outline-none text-gray-300"
    : "focus:outline-none text-gray-700";

  const baseSvgClassName = isDarkMode
    ? "w-6 h-6 text-gray-300 hover:text-gray-400"
    : "w-6 h-6 text-gray-500 hover:text-gray-700";

  const baseDropdownMenuClassName = isDarkMode
    ? "absolute z-50 mt-1 w-48 bg-gray-800 shadow-md rounded-lg text-gray-300"
    : "absolute z-50 mt-1 w-48 bg-white shadow-md rounded-lg text-gray-700";

  const baseDropdownItemClassName = isDarkMode
    ? "block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
    : "block w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100";

  const tdClassName = disableDefaultStyles
    ? customClassNames.actionTd || ""
    : `${baseTdClassName} ${customClassNames.actionTd || ""}`;

  const buttonClassName = disableDefaultStyles
    ? customClassNames.actionButton || ""
    : `${baseButtonClassName} ${customClassNames.actionButton || ""}`;

  const svgClassName = disableDefaultStyles
    ? customClassNames.actionSvg || ""
    : `${baseSvgClassName} ${customClassNames.actionSvg || ""}`;

  const dropdownMenuClassName = disableDefaultStyles
    ? customClassNames.dropdownMenu || ""
    : `${baseDropdownMenuClassName} ${customClassNames.dropdownMenu || ""}`;

  const dropdownItemClassName = disableDefaultStyles
    ? customClassNames.dropdownItem || ""
    : `${baseDropdownItemClassName} ${customClassNames.dropdownItem || ""}`;

  const dropdownMenu = (
    <div
      ref={dropdownRef}
      className={dropdownMenuClassName}
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        transform: "translateX(-10%)",
      }}
      onClick={handleDropdownClick}
    >
      {actionTexts.map((text, i) => (
        <button
          key={`action-${text}`}
          onClick={() => {
            actionFunctions[i](item);
            setIsDropdownOpen(false);
          }}
          className={dropdownItemClassName}
        >
          {text}
        </button>
      ))}
    </div>
  );

  return (
    <td key={`actions-${index}`} className={tdClassName}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={buttonClassName}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={svgClassName}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6h.01M12 12h.01M12 18h.01"
          />
        </svg>
      </button>

      {isDropdownOpen && createPortal(dropdownMenu, document.body)}
    </td>
  );
};

export default ActionDropdown;
