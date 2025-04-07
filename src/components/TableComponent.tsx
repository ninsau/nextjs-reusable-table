"use client";
import type React from "react";
import { useEffect, useState } from "react";
import NoContentComponent from "./NoContentComponent";
import TableSkeleton from "./TableSkeleton";
import ActionDropdown from "./ActionDropdown";
import Link from "next/link";
import type { TableProps } from "../types";
import { formatDate, isDateString, trimText } from "../utils/helpers";
import PaginationComponent from "./PaginationComponent";

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
    return <TableSkeleton enableDarkMode={enableDarkMode} />;
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
    return <NoContentComponent {...noContentProps} />;
  }

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
    ? `w-full border rounded-md shadow-sm ${
        enableDarkMode && isDarkMode
          ? "bg-gray-900 text-gray-200 border-gray-700"
          : "bg-white text-gray-900 border-gray-200"
      }`
    : "";
  const baseTheadClassName = !disableDefaultStyles
    ? enableDarkMode && isDarkMode
      ? "bg-gray-800 text-gray-200"
      : "bg-gray-50 text-gray-700"
    : "";
  const baseTbodyClassName = !disableDefaultStyles
    ? enableDarkMode && isDarkMode
      ? "divide-y divide-gray-700"
      : "divide-y divide-gray-200"
    : "";
  const baseTrClassName = (index: number) =>
    !disableDefaultStyles
      ? index % 2 === 0
        ? enableDarkMode && isDarkMode
          ? "bg-gray-900"
          : "bg-white"
        : enableDarkMode && isDarkMode
        ? "bg-gray-800"
        : "bg-gray-50"
      : "";
  const baseTdClassName = !disableDefaultStyles
    ? enableDarkMode && isDarkMode
      ? "text-gray-200"
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
  const thClassName = (prop: string) => {
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
  const tdClassName = (prop: string) => {
    const baseClass = !disableDefaultStyles
      ? `px-2 py-2 sm:px-4 sm:py-2 text-sm ${baseTdClassName} ${
          customClassNames.td || ""
        }`
      : customClassNames.td || "";
    return `${baseClass}`;
  };

  return (
    <>
      <div
        className="table-scroll-container pb-6"
        style={{ maxHeight: "600px", overflow: "auto" }}
      >
        <table className={tableClassName} style={{ margin: 0, padding: 0 }}>
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
                        ? "pointer"
                        : "default",
                    }}
                  >
                    <div className="flex items-center">
                      <div
                        className="flex-1 flex items-center gap-1"
                        onClick={() => handleSort(String(prop))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSort(String(prop));
                        }}
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
                            onClick={(e) =>
                              setHeaderDropdown((prev) => {
                                const newState = Object.keys(prev).reduce(
                                  (acc, key) =>
                                    Object.assign(acc, { [key]: false }),
                                  {}
                                );
                                return Object.assign({}, newState, {
                                  [String(prop)]: !prev[String(prop)],
                                });
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
                    if (typeof value === "string" && isDateString(value)) {
                      valToFormat = formatDate(new Date(value), true);
                    } else if (Array.isArray(value)) {
                      let displayArray: T[keyof T][] = value;
                      if (!isExpanded && displayArray.length > 5) {
                        displayArray = displayArray.slice(0, 5);
                      }
                      displayValue = (
                        <div
                          className="flex flex-wrap gap-1"
                          style={{
                            maxWidth: "200px",
                            overflowX: "auto",
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
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            background: "transparent",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            boxShadow: "none",
            maxWidth: "90%",
          }}
        >
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={calculatedTotalPages}
            disableDefaultStyles={disableDefaultStyles}
            customClassNames={customClassNames.pagination}
            enableDarkMode={enableDarkMode}
          />
        </div>
      )}
    </>
  );
}

export default TableComponent;
