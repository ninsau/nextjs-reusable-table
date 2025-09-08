"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ActionDropdown: () => ActionDropdown_default,
  NoContentComponent: () => NoContentComponent_default,
  TableComponent: () => TableComponent_default,
  TableSkeleton: () => TableSkeleton_default
});
module.exports = __toCommonJS(index_exports);

// src/components/ActionDropdown.tsx
var import_react = require("react");
var import_react_dom = require("react-dom");
var import_jsx_runtime = require("react/jsx-runtime");
var ActionDropdown = ({
  item,
  actionTexts,
  actionFunctions,
  disableDefaultStyles = false,
  customClassNames = {},
  enableDarkMode = true
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = (0, import_react.useState)(false);
  const [_isDarkMode, setIsDarkMode] = (0, import_react.useState)(false);
  const [dropdownPosition, setDropdownPosition] = (0, import_react.useState)({ top: 0, left: 0 });
  const buttonRef = (0, import_react.useRef)(null);
  const dropdownRef = (0, import_react.useRef)(null);
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
  (0, import_react.useEffect)(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);
  (0, import_react.useEffect)(() => {
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
  const dropdownMenuClassName = disableDefaultStyles ? customClassNames.actionDropdown?.menu || customClassNames.dropdownMenu || "" : `${baseDropdownMenuClassName} ${customClassNames.actionDropdown?.menu || customClassNames.dropdownMenu || ""}`;
  const dropdownItemClassName = disableDefaultStyles ? customClassNames.actionDropdown?.item || customClassNames.dropdownItem || "" : `${baseDropdownItemClassName} ${customClassNames.actionDropdown?.item || customClassNames.dropdownItem || ""}`;
  const dropdownMenu = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
      children: actionTexts.map((text, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        ref: buttonRef,
        onClick: toggleDropdown,
        className: buttonClassName,
        type: "button",
        "aria-label": "Actions",
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleDropdown();
          }
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            className: svgClassName,
            role: "presentation",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    isDropdownOpen && (0, import_react_dom.createPortal)(dropdownMenu, document.body)
  ] });
};
var ActionDropdown_default = ActionDropdown;

// src/components/NoContentComponent.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var NoContentComponent = ({
  name = "No data",
  text,
  icon
}) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex flex-col items-center justify-center space-y-4 text-center py-10", children: [
  icon === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "svg",
    {
      className: "mx-auto h-16 w-16 text-gray-400",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      role: "img",
      "aria-label": name,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("title", { children: name }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M13 10V3L4 14h7v7l9-11h-7z"
          }
        )
      ]
    }
  ) : icon,
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-gray-500 text-lg", children: text !== void 0 ? text : "No data available" })
] });
var NoContentComponent_default = NoContentComponent;

// src/components/TableComponent.tsx
var import_link = __toESM(require("next/link"));
var import_react3 = require("react");

// src/utils/helpers.ts
var formatDate = (date, includeTime = false) => {
  const options = includeTime ? {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  } : { year: "numeric", month: "short", day: "numeric" };
  try {
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch {
    return "Invalid Date";
  }
};
var isDateString = (str) => {
  if (typeof str !== "string" || str.length < 8) return false;
  if (/^\d+$/.test(str.trim())) return false;
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)?)?$/,
    // ISO format with timezone
    /^\d{4}-\d{1,2}-\d{1,2}$/,
    // YYYY-M-D or YYYY-MM-DD
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    // M/D/YYYY or MM/DD/YYYY
    /^\d{1,2}-\d{1,2}-\d{4}$/,
    // M-D-YYYY or MM-DD-YYYY
    /^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}$/i
    // Month DD, YYYY
  ];
  const hasDatePattern = datePatterns.some((pattern) => pattern.test(str.trim()));
  if (!hasDatePattern) return false;
  const parsedDate = Date.parse(str);
  if (Number.isNaN(parsedDate)) return false;
  const date = new Date(parsedDate);
  if (Number.isNaN(date.getTime())) return false;
  const ymd = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const isoWithTime = str.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  const mdy = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (ymd || mdy || isoWithTime) {
    let inputYear;
    let inputMonth;
    let inputDay;
    let parsedYear;
    let parsedMonth;
    let parsedDay;
    if (isoWithTime) {
      inputYear = Number(isoWithTime[1]);
      inputMonth = Number(isoWithTime[2]);
      inputDay = Number(isoWithTime[3]);
      parsedYear = date.getUTCFullYear();
      parsedMonth = date.getUTCMonth() + 1;
      parsedDay = date.getUTCDate();
    } else if (ymd) {
      inputYear = Number(ymd[1]);
      inputMonth = Number(ymd[2]);
      inputDay = Number(ymd[3]);
      parsedYear = date.getUTCFullYear();
      parsedMonth = date.getUTCMonth() + 1;
      parsedDay = date.getUTCDate();
    } else {
      inputMonth = Number(mdy?.[1]);
      inputDay = Number(mdy?.[2]);
      inputYear = Number(mdy?.[3]);
      parsedYear = date.getFullYear();
      parsedMonth = date.getMonth() + 1;
      parsedDay = date.getDate();
    }
    if (parsedYear !== inputYear || parsedMonth !== inputMonth || parsedDay !== inputDay) {
      return false;
    }
  }
  const year = ymd || isoWithTime ? date.getUTCFullYear() : date.getFullYear();
  return year >= 1900 && year <= 2100;
};
var trimText = (text, maxLength) => {
  if (maxLength <= 0) return "...";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// src/components/PaginationComponent.tsx
var import_react2 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var PaginationComponent = ({
  page,
  setPage,
  totalPages,
  disableDefaultStyles = false,
  customClassNames = {},
  enableDarkMode = true
}) => {
  const [isDarkMode, setIsDarkModeState] = (0, import_react2.useState)(false);
  (0, import_react2.useEffect)(() => {
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
  const baseButtonClassName = disableDefaultStyles ? customClassNames.button || "" : `px-3 py-1 mx-1 rounded-md ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"} ${customClassNames.button || ""}`;
  const disabledButtonClassName = disableDefaultStyles ? customClassNames.buttonDisabled || "" : `opacity-50 cursor-not-allowed px-3 py-1 mx-1 rounded-md ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"} ${customClassNames.buttonDisabled || ""}`;
  const firstButtonClassName = customClassNames.navigation?.first || baseButtonClassName;
  const previousButtonClassName = customClassNames.navigation?.previous || baseButtonClassName;
  const nextButtonClassName = customClassNames.navigation?.next || baseButtonClassName;
  const lastButtonClassName = customClassNames.navigation?.last || baseButtonClassName;
  const pageInfoClassName = disableDefaultStyles ? customClassNames.pageInfo || "" : `px-3 py-1 mx-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} ${customClassNames.pageInfo || ""}`;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      className: disableDefaultStyles ? customClassNames?.container || "" : `flex justify-center items-center mt-4 ${customClassNames?.container || ""}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            disabled: page === 1,
            onClick: () => setPage(1),
            className: page === 1 ? disabledButtonClassName : firstButtonClassName,
            type: "button",
            children: "First"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            disabled: page === 1,
            onClick: () => setPage(page - 1),
            className: page === 1 ? disabledButtonClassName : previousButtonClassName,
            type: "button",
            children: "Previous"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: pageInfoClassName, children: [
          "Page ",
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: page }),
          " of ",
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { children: totalPages })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            disabled: page >= totalPages || totalPages <= 0,
            onClick: () => setPage(page + 1),
            className: page >= totalPages || totalPages <= 0 ? disabledButtonClassName : nextButtonClassName,
            type: "button",
            children: "Next"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            disabled: page >= totalPages || totalPages <= 0,
            onClick: () => setPage(totalPages),
            className: page >= totalPages || totalPages <= 0 ? disabledButtonClassName : lastButtonClassName,
            type: "button",
            children: "Last"
          }
        )
      ]
    }
  );
};
var PaginationComponent_default = PaginationComponent;

// src/components/TableComponent.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
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
  formatHeader,
  renderPagination,
  maxHeight = "600px",
  customStyles = {},
  scrollBehavior = "auto",
  tableLayout,
  cellExpansion = { enabled: true, maxWidth: 200, behavior: "truncate" },
  accessibility = { keyboardNavigation: true }
}) {
  const [isDarkMode, setIsDarkMode] = (0, import_react3.useState)(false);
  const [expandedCells, setExpandedCells] = (0, import_react3.useState)({});
  const [headerDropdown, setHeaderDropdown] = (0, import_react3.useState)({});
  const [hiddenColumns, setHiddenColumns] = (0, import_react3.useState)({});
  (0, import_react3.useEffect)(() => {
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
  (0, import_react3.useEffect)(() => {
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
    const loadingSkeletonClasses = customClassNames.loadingSkeleton;
    const baseLoadingClassName = disableDefaultStyles ? customClassNames.loadingContainer || "" : `p-4 animate-pulse ${customClassNames.loadingContainer || ""}`;
    const baseSkeletonBarClass = loadingSkeletonClasses?.skeletonBar || "h-6 bg-gray-300 mb-3 rounded";
    const baseSkeletonItemClass = loadingSkeletonClasses?.skeletonItem || "h-4 bg-gray-200 mb-2 rounded";
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "div",
      {
        className: baseLoadingClassName,
        style: customStyles.loading,
        "aria-busy": "true",
        "aria-live": "polite",
        role: "status",
        "aria-label": accessibility.screenReaderLabels?.loading || "Loading table data",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: baseSkeletonBarClass }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: baseSkeletonItemClass }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: baseSkeletonItemClass }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: baseSkeletonItemClass })
        ]
      }
    );
  }
  if (!data || data.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(NoContentComponent_default, { ...noContentProps });
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
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(NoContentComponent_default, { text: "No items found.", name: noContentProps?.name, icon: noContentProps?.icon });
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "rt-table-wrapper", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "div",
      {
        className: disableDefaultStyles ? customClassNames.scrollContainer || "" : `table-scroll-container pb-6 ${customClassNames.scrollContainer || ""}`,
        style: {
          maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
          overflow: scrollBehavior,
          ...customStyles.scrollContainer
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "table",
          {
            className: tableClassName,
            style: {
              margin: 0,
              padding: 0,
              tableLayout,
              ...customStyles.table
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("thead", { className: theadClassName, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("tr", { children: [
                displayedColumns.map(({ col, indicator, prop, index }) => {
                  if (hiddenColumns[String(prop)]) return null;
                  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                    "th",
                    {
                      scope: "col",
                      className: thClassName(String(prop)),
                      style: {
                        cursor: sortableProps.includes(prop) ? customClassNames.interactive?.sortableCursor || "pointer" : customClassNames.interactive?.clickableCursor || "default"
                      },
                      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
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
                              indicator && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-xs text-gray-400", children: indicator })
                            ]
                          }
                        ),
                        showRemoveColumns && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "relative", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
                              children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                                "svg",
                                {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  stroke: "currentColor",
                                  className: "w-4 h-4",
                                  role: "presentation",
                                  children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
                          headerDropdown[String(prop)] && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                            "div",
                            {
                              id: `header-dropdown-${String(prop)}`,
                              className: "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50",
                              children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
                actions && actionTexts && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("th", { scope: "col", className: thClassName(""), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "sr-only", children: actionTexts.join(", ") }) })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("tbody", { className: tbodyClassName, children: paginatedData.map((item, dataIndex) => {
                const rowClassNames = `${trClassName(dataIndex)} ${rowOnClick ? "cursor-pointer" : ""}`;
                if (renderRow) {
                  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
                return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
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
                        if (formatValue) {
                          const customFormatted = formatValue(
                            valToFormat,
                            String(prop),
                            item
                          );
                          if (customFormatted !== void 0 && customFormatted !== null) {
                            displayValue = customFormatted;
                          }
                        }
                        if (displayValue === void 0) {
                          if (typeof value === "string" && isDateString(value)) {
                            valToFormat = formatDate(new Date(value), true);
                          } else if (Array.isArray(value)) {
                            let displayArray = value;
                            if (!isExpanded && displayArray.length > 5) {
                              displayArray = displayArray.slice(0, 5);
                            }
                            displayValue = /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
                              "div",
                              {
                                className: disableDefaultStyles ? customClassNames.cellExpansion?.container || "" : `flex flex-wrap gap-1 ${customClassNames.cellExpansion?.container || ""}`,
                                style: {
                                  maxWidth: cellExpansion.enabled ? typeof cellExpansion.maxWidth === "number" ? `${cellExpansion.maxWidth}px` : cellExpansion.maxWidth || "200px" : void 0,
                                  overflowX: cellExpansion.behavior === "truncate" ? "auto" : void 0
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
                                  displayArray.map((chip, idx) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                                    "span",
                                    {
                                      className: "inline-block bg-indigo-100 text-gray-800 px-2 py-1 rounded-full text-xs",
                                      children: trimText(String(chip), 20)
                                    },
                                    typeof chip === "object" && chip !== null ? JSON.stringify(chip) : `${String(chip)}-${idx}`
                                  )),
                                  !isExpanded && value.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
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
                            displayValue = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_link.default, { href: value, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                              "span",
                              {
                                className: "text-blue-500 hover:underline",
                                onClick: (e) => e.stopPropagation(),
                                onKeyDown: (e) => {
                                  if (e.key === "Enter") {
                                    e.stopPropagation();
                                  }
                                },
                                children: isExpanded ? value : trimText(value, 30)
                              }
                            ) });
                          } else {
                            if (!Array.isArray(value) && !isExpanded) {
                              valToFormat = trimText(valToFormat, 30);
                            }
                            displayValue = valToFormat;
                          }
                        }
                        if (!displayValue && !Array.isArray(value)) {
                          displayValue = valToFormat;
                        }
                        return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
                      actions && actionTexts && actionFunctions && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                        "div",
                        {
                          onClick: (e) => e.stopPropagation(),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") {
                              e.stopPropagation();
                            }
                          },
                          role: "presentation",
                          children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
            ]
          }
        )
      }
    ),
    enablePagination && page !== void 0 && setPage && (renderPagination ? renderPagination({
      page,
      setPage,
      totalPages: totalPages ?? calculatedTotalPages,
      calculatedTotalPages: Math.ceil(sortedData.length / itemsPerPage),
      itemsPerPage
    }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      PaginationComponent_default,
      {
        page,
        setPage,
        totalPages: calculatedTotalPages,
        disableDefaultStyles,
        customClassNames: customClassNames.pagination,
        enableDarkMode
      }
    ))
  ] });
}
var TableComponent_default = TableComponent;

// src/components/TableSkeleton.tsx
var import_react5 = require("react");

// node_modules/react-loading-skeleton/dist/index.js
var import_react4 = __toESM(require("react"), 1);
var SkeletonThemeContext = import_react4.default.createContext({});
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
  const contextStyleOptions = import_react4.default.useContext(SkeletonThemeContext);
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
    const skeletonSpan = import_react4.default.createElement("span", { className, style: thisStyle, key: i }, "\u200C");
    if (inline) {
      elements.push(skeletonSpan);
    } else {
      elements.push(import_react4.default.createElement(
        import_react4.default.Fragment,
        { key: i },
        skeletonSpan,
        import_react4.default.createElement("br", null)
      ));
    }
  }
  return import_react4.default.createElement("span", { className: containerClassName, "data-testid": containerTestId, "aria-live": "polite", "aria-busy": (_c = styleOptions.enableAnimation) !== null && _c !== void 0 ? _c : defaultEnableAnimation }, Wrapper ? elements.map((el, i) => import_react4.default.createElement(Wrapper, { key: i }, el)) : elements);
}

// src/components/TableSkeleton.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var TableSkeleton = ({
  disableDefaultStyles = false,
  customClassNames = {},
  enableDarkMode = true
}) => {
  const [isDarkMode, setIsDarkMode] = (0, import_react5.useState)(false);
  (0, import_react5.useEffect)(() => {
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
  const tableClassName = disableDefaultStyles ? customClassNames.table || "" : `${baseTableClassName} w-full min-w-full divide-y ${customClassNames.table || ""}`;
  const thClassName = disableDefaultStyles ? customClassNames.th || "" : `${baseThClassName} py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3 ${customClassNames.th || ""}`;
  const trClassName = (index) => disableDefaultStyles ? customClassNames.tr || "" : `${baseTrClassName(index)} ${customClassNames.tr || ""}`;
  const tdClassName = disableDefaultStyles ? customClassNames.td || "" : `${baseTdClassName} whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-3 ${customClassNames.td || ""}`;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: containerClassName, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "mt-8 flow-root", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("table", { className: tableClassName, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("tr", { children: [
      Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "th",
        {
          scope: "col",
          className: thClassName,
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "animate-pulse bg-gray-300", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Skeleton, { width: 100 }) })
        },
        `${index + 1}-header`
      )),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { scope: "col", className: thClassName, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "animate-pulse bg-gray-300", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Skeleton, { width: 50 }) }) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("tbody", { children: Array.from({ length: 10 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("tr", { className: trClassName(index), children: [
      Array.from({ length: 4 }).map((_2, colIndex) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "td",
        {
          className: tdClassName,
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "animate-pulse bg-gray-300", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Skeleton, { width: 150 }) })
        },
        `${index + 1}-${colIndex + 1}-cell`
      )),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { className: tdClassName, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "animate-pulse bg-gray-300", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Skeleton, { width: 50 }) }) })
    ] }, `${index + 1}-row`)) })
  ] }) }) }) }) });
};
var TableSkeleton_default = TableSkeleton;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionDropdown,
  NoContentComponent,
  TableComponent,
  TableSkeleton
});
