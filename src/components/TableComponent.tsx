"use client";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import type { TableProps } from "../types";
import { formatDate, isDateString, trimText } from "../utils/helpers";
import ActionDropdown from "./ActionDropdown";
import NoContentComponent from "./NoContentComponent";
import PaginationComponent from "./PaginationComponent";

/**
 * A highly customizable, headless table component for React/Next.js applications.
 *
 * @template T - The data type for table rows
 * @param props - Configuration object for the table component
 * @returns A fully functional table with sorting, pagination, search, and customization options
 */
function TableComponent<T>({
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
  cellExpansion = { enabled: true, maxWidth: 200, behavior: 'truncate' },
  accessibility = { keyboardNavigation: true },
}: TableProps<T>) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedCells, setExpandedCells] = useState<{
    [key: string]: boolean;
  }>({});
  const [headerDropdown, setHeaderDropdown] = useState<{
    [key: string]: boolean;
  }>({});
  const [hiddenColumns, setHiddenColumns] = useState<{
    [key: string]: boolean;
  }>({});

  // Dark mode detection
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

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      for (const key of Object.keys(headerDropdown)) {
        if (headerDropdown[key]) {
          const element = document.getElementById(`header-dropdown-${key}`);
          if (element && !element.contains(event.target as Node)) {
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
    const baseLoadingClassName = disableDefaultStyles
      ? customClassNames.loadingContainer || ""
      : `p-4 animate-pulse ${customClassNames.loadingContainer || ""}`;

    const baseSkeletonBarClass = loadingSkeletonClasses?.skeletonBar || "h-6 bg-gray-300 mb-3 rounded";
    const baseSkeletonItemClass = loadingSkeletonClasses?.skeletonItem || "h-4 bg-gray-200 mb-2 rounded";

    return (
      <div
        className={baseLoadingClassName}
        style={customStyles.loading}
        aria-busy="true"
        aria-live="polite"
        role="status"
        aria-label={accessibility.screenReaderLabels?.loading || "Loading table data"}
      >
        <div className={baseSkeletonBarClass} />
        <div className={baseSkeletonItemClass} />
        <div className={baseSkeletonItemClass} />
        <div className={baseSkeletonItemClass} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <NoContentComponent {...noContentProps} />;
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
    return <NoContentComponent text="No items found." name={noContentProps?.name} icon={noContentProps?.icon} />;
  }

  /**
   * Handles column sorting when a sortable column header is clicked
   * @param prop - The property name to sort by
   */
  const handleSort = (prop: string) => {
    if (sortableProps.includes(prop as keyof T) && onSort) {
      onSort(prop as keyof T);
    }
  };

  const displayedColumns = columns.map((col, i) => {
    return {
      col,
      indicator: sortableProps.includes(props[i]) ? "⇅" : "",
      prop: props[i],
      index: i,
    };
  });

  const sortedData = filteredData;

  let paginatedData = sortedData;
  const calculatedTotalPages =
    totalPages ?? Math.ceil(sortedData.length / itemsPerPage);

  if (enablePagination) {
    if (totalPages !== undefined) {
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

  const baseTableClassName = !disableDefaultStyles
    ? `w-full divide-y ${
        enableDarkMode && isDarkMode
          ? "bg-gray-900 text-gray-200 divide-gray-700"
          : "bg-white text-gray-900 divide-gray-200"
      }`
    : "";

  const baseTheadClassName =
    !disableDefaultStyles && enableDarkMode
      ? isDarkMode
        ? "bg-gray-700 text-gray-300"
        : "bg-gray-50 text-gray-500"
      : "";

  const baseTbodyClassName = !disableDefaultStyles
    ? `divide-y ${
        enableDarkMode && isDarkMode ? "divide-gray-700" : "divide-gray-200"
      }`
    : "";

  const baseTrClassName = (index: number) =>
    !disableDefaultStyles
      ? index % 2 === 0
        ? isDarkMode
          ? "bg-gray-800"
          : "bg-white"
        : isDarkMode
          ? "bg-gray-700"
          : "bg-gray-100"
      : "";

  const baseTdClassName = !disableDefaultStyles
    ? isDarkMode
      ? "text-gray-300"
      : "text-gray-700"
    : "";

  const tableClassName = disableDefaultStyles
    ? customClassNames.table || ""
    : `${baseTableClassName} ${customClassNames.table || ""}`;

  const theadClassName = disableDefaultStyles
    ? customClassNames.thead || ""
    : `${baseTheadClassName} ${customClassNames.thead || ""} sticky-header`;

  const tbodyClassName = disableDefaultStyles
    ? customClassNames.tbody || ""
    : `${baseTbodyClassName} ${customClassNames.tbody || ""}`;

  const thClassName = (_prop: string) => {
    const baseClass = !disableDefaultStyles
      ? `px-2 py-2 sm:px-4 sm:py-2 text-left text-xs font-medium uppercase tracking-wider ${
          customClassNames.th || ""
        }`
      : customClassNames.th || "";
    return `${baseClass}`;
  };

  const trClassName = (index: number) =>
    disableDefaultStyles
      ? customClassNames.tr || ""
      : `${baseTrClassName(index)} ${customClassNames.tr || ""}`;

  const tdClassName = (_prop: string) => {
    const baseClass = !disableDefaultStyles
      ? `px-2 py-2 sm:px-4 sm:py-2 text-sm ${baseTdClassName} ${
          customClassNames.td || ""
        }`
      : customClassNames.td || "";
    return `${baseClass}`;
  };

  return (
    <div className="rt-table-wrapper">
      <div
        className={
          disableDefaultStyles
            ? customClassNames.scrollContainer || ""
            : `table-scroll-container pb-6 ${customClassNames.scrollContainer || ""}`
        }
        style={{
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
          overflow: scrollBehavior,
          ...customStyles.scrollContainer,
        }}
      >
        <table
          className={tableClassName}
          style={{
            margin: 0,
            padding: 0,
            tableLayout: tableLayout,
            ...customStyles.table,
          }}
        >
          <thead className={theadClassName}>
            <tr>
              {displayedColumns.map(({ col, indicator, prop, index }) => {
                if (hiddenColumns[String(prop)]) return null;
                return (
                  <th
                    key={String(prop)}
                    scope="col"
                    className={thClassName(String(prop))}
                    style={{
                      cursor: sortableProps.includes(prop as keyof T)
                        ? customClassNames.interactive?.sortableCursor || "pointer"
                        : customClassNames.interactive?.clickableCursor || "default",
                    }}
                  >
                    <div className="flex items-center">
                      <div
                        className="flex-1 flex items-center gap-1"
                        onClick={() => handleSort(String(prop))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSort(String(prop));
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        {formatHeader
                          ? formatHeader(col, String(prop), index)
                          : col}
                        {indicator && (
                          <span className="text-xs text-gray-400">
                            {indicator}
                          </span>
                        )}
                      </div>
                      {showRemoveColumns && (
                        <div className="relative">
                          <button
                            onClick={(_e) =>
                              setHeaderDropdown((prev) => {
                                const newState: { [key: string]: boolean } = {};
                                for (const key of Object.keys(prev)) {
                                  newState[key] = false;
                                }
                                return {
                                  ...newState,
                                  [String(prop)]: !prev[String(prop)],
                                };
                              })
                            }
                            className="p-1 hover:bg-gray-200 rounded-full dark:hover:bg-gray-600"
                            type="button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-4 h-4"
                              role="presentation"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6h.01M12 12h.01M12 18h.01"
                              />
                            </svg>
                          </button>
                          {headerDropdown[String(prop)] && (
                            <div
                              id={`header-dropdown-${String(prop)}`}
                              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50"
                            >
                              <button
                                onClick={() => {
                                  setHiddenColumns((prev) => ({
                                    ...prev,
                                    [String(prop)]: !prev[String(prop)],
                                  }));
                                  setHeaderDropdown((prev) => ({
                                    ...prev,
                                    [String(prop)]: false,
                                  }));
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                type="button"
                              >
                                {hiddenColumns[String(prop)]
                                  ? "Unhide Column"
                                  : "Remove Column"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
              {actions && actionTexts && (
                <th scope="col" className={thClassName("")}>
                  <span className="sr-only">{actionTexts.join(", ")}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className={tbodyClassName}>
            {paginatedData.map((item, dataIndex) => {
              const rowClassNames = `${trClassName(dataIndex)} ${
                rowOnClick ? "cursor-pointer" : ""
              }`;

              if (renderRow) {
                return (
                  <tr
                    key={`dataIndex-${dataIndex + 1}`}
                    onClick={rowOnClick ? () => rowOnClick(item) : undefined}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && rowOnClick) {
                        rowOnClick(item);
                      }
                    }}
                    className={rowClassNames}
                  >
                    {renderRow(item, dataIndex)}
                  </tr>
                );
              }

              return (
                <tr
                  key={`dataIndex-${dataIndex + 1}`}
                  onClick={rowOnClick ? () => rowOnClick(item) : undefined}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && rowOnClick) {
                      rowOnClick(item);
                    }
                  }}
                  className={rowClassNames}
                >
                  {props.map((prop) => {
                    if (hiddenColumns[String(prop)]) return null;
                    let value = item[prop];
                    if (value === null || value === undefined || value === "") {
                      value = "-" as T[keyof T];
                    }
                    const cellKey = `${dataIndex}-${String(prop)}`;
                    const isExpanded = expandedCells[cellKey];
                    let displayValue: React.ReactNode;
                    let valToFormat = String(value);

                    // First check if formatValue is provided and let it override all formatting
                    if (formatValue) {
                      const customFormatted = formatValue(
                        valToFormat,
                        String(prop),
                        item,
                      );
                      if (customFormatted !== undefined && customFormatted !== null) {
                        displayValue = customFormatted;
                      }
                    }

                    // If formatValue didn't provide a value, fall back to internal formatting
                    if (displayValue === undefined) {
                      if (typeof value === "string" && isDateString(value)) {
                        valToFormat = formatDate(new Date(value), true);
                      } else if (Array.isArray(value)) {
                      let displayArray: T[keyof T][] = value;
                      if (!isExpanded && displayArray.length > 5) {
                        displayArray = displayArray.slice(0, 5);
                      }
                      displayValue = (
                        <div
                          className={
                            disableDefaultStyles
                              ? customClassNames.cellExpansion?.container || ""
                              : `flex flex-wrap gap-1 ${customClassNames.cellExpansion?.container || ""}`
                          }
                          style={{
                            maxWidth: cellExpansion.enabled
                              ? (typeof cellExpansion.maxWidth === 'number'
                                  ? `${cellExpansion.maxWidth}px`
                                  : cellExpansion.maxWidth || "200px")
                              : undefined,
                            overflowX: cellExpansion.behavior === 'truncate' ? "auto" : undefined,
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.stopPropagation();
                              setExpandedCells((prev) => ({
                                ...prev,
                                [cellKey]: !prev[cellKey],
                              }));
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          {displayArray.map((chip, idx) => (
                            <span
                              key={
                                typeof chip === "object" && chip !== null
                                  ? JSON.stringify(chip)
                                  : `${String(chip)}-${idx}`
                              }
                              className="inline-block bg-indigo-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                            >
                              {trimText(String(chip), 20)}
                            </span>
                          ))}
                          {!isExpanded && value.length > 5 && (
                            <span
                              className="inline-block bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCells((prev) => ({
                                  ...prev,
                                  [cellKey]: true,
                                }));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.stopPropagation();
                                  setExpandedCells((prev) => ({
                                    ...prev,
                                    [cellKey]: true,
                                  }));
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              +{value.length - 5} more
                            </span>
                          )}
                        </div>
                      );
                    } else if (
                      typeof value === "string" &&
                      value.startsWith("http")
                    ) {
                      displayValue = (
                        <Link href={value}>
                          <span
                            className="text-blue-500 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.stopPropagation();
                              }
                            }}
                          >
                            {isExpanded ? value : trimText(value, 30)}
                          </span>
                        </Link>
                      );
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
                    return (
                      <td
                        key={String(prop)}
                        className={tdClassName(String(prop))}
                        onClick={(e) => {
                          if (!rowOnClick) {
                            e.stopPropagation();
                            setExpandedCells((prev) => ({
                              ...prev,
                              [cellKey]: !prev[cellKey],
                            }));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            setExpandedCells((prev) => ({
                              ...prev,
                              [cellKey]: !prev[cellKey],
                            }));
                          }
                        }}
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                  {actions && actionTexts && actionFunctions && (
                    <td>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                          }
                        }}
                        role="presentation"
                      >
                        <ActionDropdown
                          item={item}
                          index={dataIndex}
                          actionTexts={actionTexts}
                          actionFunctions={actionFunctions}
                          disableDefaultStyles={disableDefaultStyles}
                          customClassNames={customClassNames}
                          enableDarkMode={enableDarkMode}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {enablePagination && page !== undefined && setPage && (
        renderPagination ? (
          renderPagination({
            page,
            setPage,
            totalPages: totalPages ?? calculatedTotalPages,
            calculatedTotalPages: Math.ceil(sortedData.length / itemsPerPage),
            itemsPerPage,
          })
        ) : (
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={calculatedTotalPages}
            disableDefaultStyles={disableDefaultStyles}
            customClassNames={customClassNames.pagination}
            enableDarkMode={enableDarkMode}
          />
        )
      )}
    </div>
  );
}

export default TableComponent;
