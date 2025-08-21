// src/components/ActionDropdown.tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { jsx, jsxs } from "react/jsx-runtime";
var ActionDropdown = ({
  item,
  actionTexts,
  actionFunctions,
  disableDefaultStyles = false,
  customClassNames = {},
  enableDarkMode = true
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [_isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: Math.min(
          rect.left + window.scrollX - 10,
          window.innerWidth - 240
        )
      });
    }
    setIsDropdownOpen((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
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
  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };
  const baseButtonClassName = "focus:outline-none text-gray-700";
  const baseSvgClassName = "w-6 h-6 text-gray-700 hover:text-gray-900";
  const baseDropdownMenuClassName = "absolute z-50 mt-1 w-48 bg-gray-200 shadow-md rounded-lg text-gray-700";
  const baseDropdownItemClassName = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-300";
  const buttonClassName = disableDefaultStyles ? customClassNames.actionButton || "" : `${baseButtonClassName} ${customClassNames.actionButton || ""}`;
  const svgClassName = disableDefaultStyles ? customClassNames.actionSvg || "" : `${baseSvgClassName} ${customClassNames.actionSvg || ""}`;
  const dropdownMenuClassName = disableDefaultStyles ? customClassNames.dropdownMenu || "" : `${baseDropdownMenuClassName} ${customClassNames.dropdownMenu || ""}`;
  const dropdownItemClassName = disableDefaultStyles ? customClassNames.dropdownItem || "" : `${baseDropdownItemClassName} ${customClassNames.dropdownItem || ""}`;
  const dropdownMenu = /* @__PURE__ */ jsx(
    "div",
    {
      ref: dropdownRef,
      className: dropdownMenuClassName,
      style: {
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        transform: "translateX(-10%)"
      },
      onClick: handleDropdownClick,
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          setIsDropdownOpen(false);
        }
      },
      role: "menu",
      tabIndex: -1,
      children: actionTexts.map((text, i) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            actionFunctions[i](item);
            setIsDropdownOpen(false);
          },
          className: dropdownItemClassName,
          type: "button",
          children: text
        },
        `action-${text}`
      ))
    }
  );
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        ref: buttonRef,
        onClick: toggleDropdown,
        className: buttonClassName,
        type: "button",
        children: /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            className: svgClassName,
            role: "presentation",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M12 6h.01M12 12h.01M12 18h.01"
              }
            )
          }
        )
      }
    ),
    isDropdownOpen && createPortal(dropdownMenu, document.body)
  ] });
};
var ActionDropdown_default = ActionDropdown;

// src/components/NoContentComponent.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var NoContentComponent = ({
  name = "items",
  text,
  icon
}) => /* @__PURE__ */ jsxs2("div", { className: "text-center py-10", children: [
  icon ? icon : /* @__PURE__ */ jsx2(
    "svg",
    {
      className: "mx-auto h-12 w-12 text-gray-400",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      role: "presentation",
      children: /* @__PURE__ */ jsx2(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M13 10V3L4 14h7v7l9-11h-7z"
        }
      )
    }
  ),
  /* @__PURE__ */ jsx2("p", { className: "text-gray-500", children: text ? text : `No ${name} found.` })
] });
var NoContentComponent_default = NoContentComponent;

// src/components/TableComponent.tsx
import Link from "next/link";
import { useEffect as useEffect4, useState as useState4 } from "react";

// src/utils/helpers.ts
var formatDate = (date, includeTime = false) => {
  const options = includeTime ? {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  } : { year: "numeric", month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
var isDateString = (str) => {
  if (str.length < 10) return false;
  const parsedDate = Date.parse(str);
  return !Number.isNaN(parsedDate) && !Number.isNaN(new Date(parsedDate).getTime());
};
var trimText = (text, maxLength) => text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

// src/components/PaginationComponent.tsx
import { useEffect as useEffect2, useState as useState2 } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var PaginationComponent = ({
  page,
  setPage,
  totalPages,
  disableDefaultStyles = false,
  customClassNames = {},
  enableDarkMode = true
}) => {
  const [isDarkMode, setIsDarkModeState] = useState2(false);
  useEffect2(() => {
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
  const baseButtonClassName = disableDefaultStyles ? customClassNames.button || "" : `px-3 py-1 mx-1 rounded-md ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`;
  const disabledButtonClassName = disableDefaultStyles ? customClassNames.buttonDisabled || "" : `opacity-50 cursor-not-allowed ${baseButtonClassName}`;
  const pageInfoClassName = disableDefaultStyles ? customClassNames.pageInfo || "" : `px-3 py-1 mx-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`;
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      className: disableDefaultStyles ? customClassNames.container || "" : "flex justify-center items-center mt-4",
      children: [
        /* @__PURE__ */ jsx3(
          "button",
          {
            disabled: page === 1,
            onClick: () => setPage(1),
            className: page === 1 ? disabledButtonClassName : baseButtonClassName,
            type: "button",
            children: "First"
          }
        ),
        /* @__PURE__ */ jsx3(
          "button",
          {
            disabled: page === 1,
            onClick: () => setPage(page - 1),
            className: page === 1 ? disabledButtonClassName : baseButtonClassName,
            type: "button",
            children: "Previous"
          }
        ),
        /* @__PURE__ */ jsxs3("span", { className: pageInfoClassName, children: [
          "Page ",
          /* @__PURE__ */ jsx3("strong", { children: page }),
          " of ",
          /* @__PURE__ */ jsx3("strong", { children: totalPages })
        ] }),
        /* @__PURE__ */ jsx3(
          "button",
          {
            disabled: page === totalPages,
            onClick: () => setPage(page + 1),
            className: page === totalPages ? disabledButtonClassName : baseButtonClassName,
            type: "button",
            children: "Next"
          }
        ),
        /* @__PURE__ */ jsx3(
          "button",
          {
            disabled: page === totalPages,
            onClick: () => setPage(totalPages),
            className: page === totalPages ? disabledButtonClassName : baseButtonClassName,
            type: "button",
            children: "Last"
          }
        )
      ]
    }
  );
};
var PaginationComponent_default = PaginationComponent;

// src/components/TableSkeleton.tsx
import { useEffect as useEffect3, useState as useState3 } from "react";

// node_modules/react-loading-skeleton/dist/index.js
import React from "react";
var SkeletonThemeContext = React.createContext({});
var defaultEnableAnimation = true;
function styleOptionsToCssProperties({ baseColor, highlightColor, width, height, borderRadius, circle, direction, duration, enableAnimation = defaultEnableAnimation, customHighlightBackground }) {
  const style = {};
  if (direction === "rtl")
    style["--animation-direction"] = "reverse";
  if (typeof duration === "number")
    style["--animation-duration"] = `${duration}s`;
  if (!enableAnimation)
    style["--pseudo-element-display"] = "none";
  if (typeof width === "string" || typeof width === "number")
    style.width = width;
  if (typeof height === "string" || typeof height === "number")
    style.height = height;
  if (typeof borderRadius === "string" || typeof borderRadius === "number")
    style.borderRadius = borderRadius;
  if (circle)
    style.borderRadius = "50%";
  if (typeof baseColor !== "undefined")
    style["--base-color"] = baseColor;
  if (typeof highlightColor !== "undefined")
    style["--highlight-color"] = highlightColor;
  if (typeof customHighlightBackground === "string")
    style["--custom-highlight-background"] = customHighlightBackground;
  return style;
}
function Skeleton({ count = 1, wrapper: Wrapper, className: customClassName, containerClassName, containerTestId, circle = false, style: styleProp, ...originalPropsStyleOptions }) {
  var _a, _b, _c;
  const contextStyleOptions = React.useContext(SkeletonThemeContext);
  const propsStyleOptions = { ...originalPropsStyleOptions };
  for (const [key, value] of Object.entries(originalPropsStyleOptions)) {
    if (typeof value === "undefined") {
      delete propsStyleOptions[key];
    }
  }
  const styleOptions = {
    ...contextStyleOptions,
    ...propsStyleOptions,
    circle
  };
  const style = {
    ...styleProp,
    ...styleOptionsToCssProperties(styleOptions)
  };
  let className = "react-loading-skeleton";
  if (customClassName)
    className += ` ${customClassName}`;
  const inline = (_a = styleOptions.inline) !== null && _a !== void 0 ? _a : false;
  const elements = [];
  const countCeil = Math.ceil(count);
  for (let i = 0; i < countCeil; i++) {
    let thisStyle = style;
    if (countCeil > count && i === countCeil - 1) {
      const width = (_b = thisStyle.width) !== null && _b !== void 0 ? _b : "100%";
      const fractionalPart = count % 1;
      const fractionalWidth = typeof width === "number" ? width * fractionalPart : `calc(${width} * ${fractionalPart})`;
      thisStyle = { ...thisStyle, width: fractionalWidth };
    }
    const skeletonSpan = React.createElement("span", { className, style: thisStyle, key: i }, "\u200C");
    if (inline) {
      elements.push(skeletonSpan);
    } else {
      elements.push(React.createElement(
        React.Fragment,
        { key: i },
        skeletonSpan,
        React.createElement("br", null)
      ));
    }
  }
  return React.createElement("span", { className: containerClassName, "data-testid": containerTestId, "aria-live": "polite", "aria-busy": (_c = styleOptions.enableAnimation) !== null && _c !== void 0 ? _c : defaultEnableAnimation }, Wrapper ? elements.map((el, i) => React.createElement(Wrapper, { key: i }, el)) : elements);
}

// src/components/TableSkeleton.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var TableSkeleton = ({
  disableDefaultStyles = false,
  customClassNames = {},
  enableDarkMode = true
}) => {
  const [isDarkMode, setIsDarkMode] = useState3(false);
  useEffect3(() => {
    if (enableDarkMode) {
      const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(matchMedia.matches);
      const handleChange = () => {
        setIsDarkMode(matchMedia.matches);
      };
      matchMedia.addEventListener("change", handleChange);
      return () => {
        matchMedia.removeEventListener("change", handleChange);
      };
    }
  }, [enableDarkMode]);
  const baseContainerClassName = enableDarkMode && isDarkMode ? "bg-gray-900 text-gray-200 border-gray-700" : "bg-white text-gray-900 border-gray-200";
  const baseTableClassName = enableDarkMode && isDarkMode ? "bg-gray-900 text-gray-200 divide-gray-700" : "bg-white text-gray-900 divide-gray-300";
  const baseThClassName = enableDarkMode && isDarkMode ? "text-gray-300" : "text-gray-900";
  const baseTdClassName = enableDarkMode && isDarkMode ? "text-gray-300" : "text-gray-900";
  const baseTrClassName = (index) => index % 2 === 0 ? enableDarkMode && isDarkMode ? "bg-gray-800" : "bg-white" : enableDarkMode && isDarkMode ? "bg-gray-700" : "bg-gray-50";
  const containerClassName = disableDefaultStyles ? customClassNames.container || "" : `${baseContainerClassName} px-4 sm:px-6 lg:px-8 ${customClassNames.container || ""}`;
  const tableClassName = disableDefaultStyles ? customClassNames.table || "" : `${baseTableClassName} min-w-full divide-y ${customClassNames.table || ""}`;
  const thClassName = disableDefaultStyles ? customClassNames.th || "" : `${baseThClassName} py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3 ${customClassNames.th || ""}`;
  const trClassName = (index) => disableDefaultStyles ? customClassNames.tr || "" : `${baseTrClassName(index)} ${customClassNames.tr || ""}`;
  const tdClassName = disableDefaultStyles ? customClassNames.td || "" : `${baseTdClassName} whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-3 ${customClassNames.td || ""}`;
  return /* @__PURE__ */ jsx4("div", { className: containerClassName, children: /* @__PURE__ */ jsx4("div", { className: "mt-8 flow-root", children: /* @__PURE__ */ jsx4("div", { className: "-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8", children: /* @__PURE__ */ jsx4("div", { className: "inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs4("table", { className: tableClassName, children: [
    /* @__PURE__ */ jsx4("thead", { children: /* @__PURE__ */ jsxs4("tr", { children: [
      Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ jsx4(
        "th",
        {
          scope: "col",
          className: thClassName,
          children: /* @__PURE__ */ jsx4(Skeleton, { width: 100 })
        },
        `${index + 1}-header`
      )),
      /* @__PURE__ */ jsx4("th", { scope: "col", className: thClassName, children: /* @__PURE__ */ jsx4(Skeleton, { width: 50 }) })
    ] }) }),
    /* @__PURE__ */ jsx4("tbody", { children: Array.from({ length: 10 }).map((_, index) => /* @__PURE__ */ jsxs4("tr", { className: trClassName(index), children: [
      Array.from({ length: 4 }).map((_2, colIndex) => /* @__PURE__ */ jsx4(
        "td",
        {
          className: tdClassName,
          children: /* @__PURE__ */ jsx4(Skeleton, { width: 150 })
        },
        `${index + 1}-${colIndex + 1}-cell`
      )),
      /* @__PURE__ */ jsx4("td", { className: tdClassName, children: /* @__PURE__ */ jsx4(Skeleton, { width: 50 }) })
    ] }, `${index + 1}-row`)) })
  ] }) }) }) }) });
};
var TableSkeleton_default = TableSkeleton;

// src/components/TableComponent.tsx
import { Fragment, jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function TableComponent({
  columns,
  data,
  props,
  actions,
  actionTexts,
  loading,
  actionFunctions,
  searchValue,
  disableDefaultStyles = false,
  customClassNames = {},
  renderRow,
  rowOnClick,
  enableDarkMode = true,
  enablePagination = false,
  page = 1,
  setPage,
  itemsPerPage = 10,
  totalPages,
  sortableProps = [],
  formatValue,
  noContentProps,
  showRemoveColumns = false,
  onSort,
  formatHeader
}) {
  const [isDarkMode, setIsDarkMode] = useState4(false);
  const [expandedCells, setExpandedCells] = useState4({});
  const [headerDropdown, setHeaderDropdown] = useState4({});
  const [hiddenColumns, setHiddenColumns] = useState4({});
  useEffect4(() => {
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
  useEffect4(() => {
    const handleClickOutside = (event) => {
      for (const key of Object.keys(headerDropdown)) {
        if (headerDropdown[key]) {
          const element = document.getElementById(`header-dropdown-${key}`);
          if (element && !element.contains(event.target)) {
            setHeaderDropdown((prev) => ({ ...prev, [key]: false }));
          }
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [headerDropdown]);
  if (loading) {
    return /* @__PURE__ */ jsx5(TableSkeleton_default, { enableDarkMode });
  }
  if (!data || data.length === 0) {
    return /* @__PURE__ */ jsx5(NoContentComponent_default, { ...noContentProps });
  }
  let filteredData = data;
  if (searchValue) {
    filteredData = data.filter((item) => {
      return props.some((prop) => {
        const value = item[prop];
        return String(value).toLowerCase().includes(searchValue.toLowerCase());
      });
    });
  }
  if (filteredData.length === 0) {
    return /* @__PURE__ */ jsx5(NoContentComponent_default, { ...noContentProps });
  }
  const handleSort = (prop) => {
    if (sortableProps.includes(prop) && onSort) {
      onSort(prop);
    }
  };
  const displayedColumns = columns.map((col, i) => {
    return {
      col,
      indicator: sortableProps.includes(props[i]) ? "\u21C5" : "",
      prop: props[i],
      index: i
    };
  });
  const sortedData = filteredData;
  let paginatedData = sortedData;
  const calculatedTotalPages = totalPages ?? Math.ceil(sortedData.length / itemsPerPage);
  if (enablePagination) {
    if (totalPages !== void 0) {
      paginatedData = sortedData;
    } else {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      paginatedData = sortedData.slice(startIndex, endIndex);
    }
    if (page > calculatedTotalPages && setPage) {
      setPage(calculatedTotalPages);
    }
  }
  const baseTableClassName = !disableDefaultStyles ? `w-full divide-y ${enableDarkMode && isDarkMode ? "bg-gray-900 text-gray-200 divide-gray-700" : "bg-white text-gray-900 divide-gray-200"}` : "";
  const baseTheadClassName = !disableDefaultStyles && enableDarkMode ? isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-500" : "";
  const baseTbodyClassName = !disableDefaultStyles ? `divide-y ${enableDarkMode && isDarkMode ? "divide-gray-700" : "divide-gray-200"}` : "";
  const baseTrClassName = (index) => !disableDefaultStyles ? index % 2 === 0 ? isDarkMode ? "bg-gray-800" : "bg-white" : isDarkMode ? "bg-gray-700" : "bg-gray-100" : "";
  const baseTdClassName = !disableDefaultStyles ? isDarkMode ? "text-gray-300" : "text-gray-700" : "";
  const tableClassName = disableDefaultStyles ? customClassNames.table || "" : `${baseTableClassName} ${customClassNames.table || ""}`;
  const theadClassName = disableDefaultStyles ? customClassNames.thead || "" : `${baseTheadClassName} ${customClassNames.thead || ""} sticky-header`;
  const tbodyClassName = disableDefaultStyles ? customClassNames.tbody || "" : `${baseTbodyClassName} ${customClassNames.tbody || ""}`;
  const thClassName = (_prop) => {
    const baseClass = !disableDefaultStyles ? `px-2 py-2 sm:px-4 sm:py-2 text-left text-xs font-medium uppercase tracking-wider ${customClassNames.th || ""}` : customClassNames.th || "";
    return `${baseClass}`;
  };
  const trClassName = (index) => disableDefaultStyles ? customClassNames.tr || "" : `${baseTrClassName(index)} ${customClassNames.tr || ""}`;
  const tdClassName = (_prop) => {
    const baseClass = !disableDefaultStyles ? `px-2 py-2 sm:px-4 sm:py-2 text-sm ${baseTdClassName} ${customClassNames.td || ""}` : customClassNames.td || "";
    return `${baseClass}`;
  };
  return /* @__PURE__ */ jsxs5(Fragment, { children: [
    /* @__PURE__ */ jsx5(
      "div",
      {
        className: "table-scroll-container pb-6",
        style: { maxHeight: "600px", overflow: "auto" },
        children: /* @__PURE__ */ jsxs5("table", { className: tableClassName, style: { margin: 0, padding: 0 }, children: [
          /* @__PURE__ */ jsx5("thead", { className: theadClassName, children: /* @__PURE__ */ jsxs5("tr", { children: [
            displayedColumns.map(({ col, indicator, prop, index }) => {
              if (hiddenColumns[String(prop)]) return null;
              return /* @__PURE__ */ jsx5(
                "th",
                {
                  scope: "col",
                  className: thClassName(String(prop)),
                  style: {
                    cursor: sortableProps.includes(prop) ? "pointer" : "default"
                  },
                  children: /* @__PURE__ */ jsxs5("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsxs5(
                      "div",
                      {
                        className: "flex-1 flex items-center gap-1",
                        onClick: () => handleSort(String(prop)),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") handleSort(String(prop));
                        },
                        role: "button",
                        tabIndex: 0,
                        children: [
                          formatHeader ? formatHeader(col, String(prop), index) : col,
                          indicator && /* @__PURE__ */ jsx5("span", { className: "text-xs text-gray-400", children: indicator })
                        ]
                      }
                    ),
                    showRemoveColumns && /* @__PURE__ */ jsxs5("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx5(
                        "button",
                        {
                          onClick: (_e) => setHeaderDropdown((prev) => {
                            const newState = {};
                            for (const key of Object.keys(prev)) {
                              newState[key] = false;
                            }
                            return {
                              ...newState,
                              [String(prop)]: !prev[String(prop)]
                            };
                          }),
                          className: "p-1 hover:bg-gray-200 rounded-full dark:hover:bg-gray-600",
                          type: "button",
                          children: /* @__PURE__ */ jsx5(
                            "svg",
                            {
                              xmlns: "http://www.w3.org/2000/svg",
                              fill: "none",
                              viewBox: "0 0 24 24",
                              stroke: "currentColor",
                              className: "w-4 h-4",
                              role: "presentation",
                              children: /* @__PURE__ */ jsx5(
                                "path",
                                {
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  strokeWidth: 2,
                                  d: "M12 6h.01M12 12h.01M12 18h.01"
                                }
                              )
                            }
                          )
                        }
                      ),
                      headerDropdown[String(prop)] && /* @__PURE__ */ jsx5(
                        "div",
                        {
                          id: `header-dropdown-${String(prop)}`,
                          className: "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50",
                          children: /* @__PURE__ */ jsx5(
                            "button",
                            {
                              onClick: () => {
                                setHiddenColumns((prev) => ({
                                  ...prev,
                                  [String(prop)]: !prev[String(prop)]
                                }));
                                setHeaderDropdown((prev) => ({
                                  ...prev,
                                  [String(prop)]: false
                                }));
                              },
                              className: "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left",
                              type: "button",
                              children: hiddenColumns[String(prop)] ? "Unhide Column" : "Remove Column"
                            }
                          )
                        }
                      )
                    ] })
                  ] })
                },
                String(prop)
              );
            }),
            actions && actionTexts && /* @__PURE__ */ jsx5("th", { scope: "col", className: thClassName(""), children: /* @__PURE__ */ jsx5("span", { className: "sr-only", children: actionTexts.join(", ") }) })
          ] }) }),
          /* @__PURE__ */ jsx5("tbody", { className: tbodyClassName, children: paginatedData.map((item, dataIndex) => {
            const rowClassNames = `${trClassName(dataIndex)} ${rowOnClick ? "cursor-pointer" : ""}`;
            if (renderRow) {
              return /* @__PURE__ */ jsx5(
                "tr",
                {
                  onClick: rowOnClick ? () => rowOnClick(item) : void 0,
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && rowOnClick) {
                      rowOnClick(item);
                    }
                  },
                  className: rowClassNames,
                  children: renderRow(item, dataIndex)
                },
                `dataIndex-${dataIndex + 1}`
              );
            }
            return /* @__PURE__ */ jsxs5(
              "tr",
              {
                onClick: rowOnClick ? () => rowOnClick(item) : void 0,
                onKeyDown: (e) => {
                  if (e.key === "Enter" && rowOnClick) {
                    rowOnClick(item);
                  }
                },
                className: rowClassNames,
                children: [
                  props.map((prop) => {
                    if (hiddenColumns[String(prop)]) return null;
                    let value = item[prop];
                    if (value === null || value === void 0 || value === "") {
                      value = "-";
                    }
                    const cellKey = `${dataIndex}-${String(prop)}`;
                    const isExpanded = expandedCells[cellKey];
                    let displayValue;
                    let valToFormat = String(value);
                    if (typeof value === "string" && isDateString(value)) {
                      valToFormat = formatDate(new Date(value), true);
                    } else if (Array.isArray(value)) {
                      let displayArray = value;
                      if (!isExpanded && displayArray.length > 5) {
                        displayArray = displayArray.slice(0, 5);
                      }
                      displayValue = /* @__PURE__ */ jsxs5(
                        "div",
                        {
                          className: "flex flex-wrap gap-1",
                          style: {
                            maxWidth: "200px",
                            overflowX: "auto"
                          },
                          onClick: (e) => e.stopPropagation(),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") {
                              e.stopPropagation();
                              setExpandedCells((prev) => ({
                                ...prev,
                                [cellKey]: !prev[cellKey]
                              }));
                            }
                          },
                          role: "button",
                          tabIndex: 0,
                          children: [
                            displayArray.map((chip, idx) => /* @__PURE__ */ jsx5(
                              "span",
                              {
                                className: "inline-block bg-indigo-100 text-gray-800 px-2 py-1 rounded-full text-xs",
                                children: trimText(String(chip), 20)
                              },
                              typeof chip === "object" && chip !== null ? JSON.stringify(chip) : `${String(chip)}-${idx}`
                            )),
                            !isExpanded && value.length > 5 && /* @__PURE__ */ jsxs5(
                              "span",
                              {
                                className: "inline-block bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs cursor-pointer",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  setExpandedCells((prev) => ({
                                    ...prev,
                                    [cellKey]: true
                                  }));
                                },
                                onKeyDown: (e) => {
                                  if (e.key === "Enter") {
                                    e.stopPropagation();
                                    setExpandedCells((prev) => ({
                                      ...prev,
                                      [cellKey]: true
                                    }));
                                  }
                                },
                                role: "button",
                                tabIndex: 0,
                                children: [
                                  "+",
                                  value.length - 5,
                                  " more"
                                ]
                              }
                            )
                          ]
                        }
                      );
                    } else if (typeof value === "string" && value.startsWith("http")) {
                      displayValue = /* @__PURE__ */ jsx5(Link, { href: value, children: /* @__PURE__ */ jsx5(
                        "span",
                        {
                          className: "text-blue-500 hover:underline",
                          onClick: (e) => e.stopPropagation(),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") {
                              e.stopPropagation();
                            }
                          },
                          role: "link",
                          tabIndex: 0,
                          children: isExpanded ? value : trimText(value, 30)
                        }
                      ) });
                    } else {
                      if (!Array.isArray(value) && !isExpanded) {
                        valToFormat = trimText(valToFormat, 30);
                      }
                      if (formatValue) {
                        displayValue = formatValue(
                          valToFormat,
                          String(prop),
                          item
                        );
                      } else {
                        displayValue = valToFormat;
                      }
                    }
                    if (!displayValue && !Array.isArray(value)) {
                      displayValue = valToFormat;
                    }
                    return /* @__PURE__ */ jsx5(
                      "td",
                      {
                        className: tdClassName(String(prop)),
                        onClick: (e) => {
                          if (!rowOnClick) {
                            e.stopPropagation();
                            setExpandedCells((prev) => ({
                              ...prev,
                              [cellKey]: !prev[cellKey]
                            }));
                          }
                        },
                        onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            setExpandedCells((prev) => ({
                              ...prev,
                              [cellKey]: !prev[cellKey]
                            }));
                          }
                        },
                        children: displayValue
                      },
                      String(prop)
                    );
                  }),
                  actions && actionTexts && actionFunctions && /* @__PURE__ */ jsx5("td", { children: /* @__PURE__ */ jsx5(
                    "div",
                    {
                      onClick: (e) => e.stopPropagation(),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation();
                        }
                      },
                      role: "presentation",
                      children: /* @__PURE__ */ jsx5(
                        ActionDropdown_default,
                        {
                          item,
                          index: dataIndex,
                          actionTexts,
                          actionFunctions,
                          disableDefaultStyles,
                          customClassNames,
                          enableDarkMode
                        }
                      )
                    }
                  ) })
                ]
              },
              `dataIndex-${dataIndex + 1}`
            );
          }) })
        ] })
      }
    ),
    enablePagination && page !== void 0 && setPage && /* @__PURE__ */ jsx5(
      "div",
      {
        style: {
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          background: "transparent",
          padding: "0.75rem 1rem",
          borderRadius: "0.5rem",
          boxShadow: "none",
          maxWidth: "90%"
        },
        children: /* @__PURE__ */ jsx5(
          PaginationComponent_default,
          {
            page,
            setPage,
            totalPages: calculatedTotalPages,
            disableDefaultStyles,
            customClassNames: customClassNames.pagination,
            enableDarkMode
          }
        )
      }
    )
  ] });
}
var TableComponent_default = TableComponent;
export {
  ActionDropdown_default as ActionDropdown,
  NoContentComponent_default as NoContentComponent,
  TableComponent_default as TableComponent,
  TableSkeleton_default as TableSkeleton
};
