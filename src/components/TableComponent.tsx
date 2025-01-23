"use client";
import React, { useEffect, useState } from "react";
import NoContentComponent from "./NoContentComponent";
import TableSkeleton from "./TableSkeleton";
import ActionDropdown from "./ActionDropdown";
import Link from "next/link";
import { TableProps } from "../types";
import { formatDate, isDateString, trimText } from "../utils/helpers";
import PaginationComponent from "./PaginationComponent";

function TableComponent<T extends Record<string, any>>({
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
}: TableProps<T>) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedCells, setExpandedCells] = useState<{
    [key: string]: boolean;
  }>({});
  const [sortProp, setSortProp] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [frozenColumns, setFrozenColumns] = useState<{
    [key: string]: "left" | "right" | null;
  }>({});
  const [headerDropdown, setHeaderDropdown] = useState<{
    [key: string]: boolean;
  }>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<keyof T>>(new Set());
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    {}
  );

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
      Object.keys(headerDropdown).forEach((key) => {
        if (headerDropdown[key]) {
          const element = document.getElementById(`header-dropdown-${key}`);
          if (element && !element.contains(event.target as Node)) {
            setHeaderDropdown((prev) => ({ ...prev, [key]: false }));
          }
        }
      });
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [headerDropdown]);

  useEffect(() => {
    const setInitialColumnWidths = () => {
      const widths: { [key: string]: number } = {};
      props.forEach((prop) => {
        const headerElement = document.getElementById(`header-${String(prop)}`);
        if (headerElement) {
          widths[String(prop)] = headerElement.offsetWidth;
        }
      });
      setColumnWidths(widths);
    };

    setInitialColumnWidths();
  }, [props]);

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

  const handleSort = (prop: keyof T) => {
    if (!sortableProps.includes(prop)) return;
    if (sortProp === prop) {
      if (sortOrder === "none") {
        setSortOrder("asc");
      } else if (sortOrder === "asc") {
        setSortOrder("desc");
      } else {
        setSortOrder("none");
      }
    } else {
      setSortProp(prop);
      setSortOrder("asc");
    }
  };

  const toggleHeaderDropdown = (prop: keyof T, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeaderDropdown((prev) => {
      const newState = Object.keys(prev).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {}
      );
      return {
        ...newState,
        [String(prop)]: !prev[String(prop)],
      };
    });
  };

  const toggleColumnVisibility = (prop: keyof T, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(prop)) {
        newSet.delete(prop);
      } else {
        newSet.add(prop);
      }
      return newSet;
    });
    setHeaderDropdown((prev) => ({ ...prev, [String(prop)]: false }));
  };

  const toggleFreezeColumn = (
    prop: keyof T,
    position: "left" | "right",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setFrozenColumns((prev) => {
      const current = prev[prop as string];
      let newValue: "left" | "right" | null = null;

      if (current === position) {
        newValue = null;
      } else {
        newValue = position;
      }

      return { ...prev, [prop as string]: newValue };
    });
    setHeaderDropdown((prev) => ({ ...prev, [String(prop)]: false }));
  };

  const autoFitColumn = (prop: keyof T) => {
    const cells = document.querySelectorAll(
      `td[data-column="${String(prop)}"]`
    );
    let maxWidth = 0;

    cells.forEach((cell) => {
      const width = (cell as HTMLElement).scrollWidth;
      maxWidth = Math.max(maxWidth, width);
    });

    setColumnWidths((prev) => ({
      ...prev,
      [String(prop)]: maxWidth + 32,
    }));
  };

  let sortedData = [...filteredData];
  if (sortProp && sortOrder !== "none") {
    sortedData.sort((a, b) => {
      const aVal = a[sortProp];
      const bVal = b[sortProp];
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortOrder === "asc" ? -1 : 1;
      if (aStr > bStr) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  let paginatedData = sortedData;
  let calculatedTotalPages =
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
    : `${baseTheadClassName} ${customClassNames.thead || ""}`;

  const tbodyClassName = disableDefaultStyles
    ? customClassNames.tbody || ""
    : `${baseTbodyClassName} ${customClassNames.tbody || ""}`;

  const getFreezeClass = (prop: keyof T): string => {
    const freezePosition = frozenColumns[prop as string];
    if (!freezePosition) return "";

    return freezePosition === "left" ? "freeze-left" : "freeze-right";
  };

  const thClassName = (prop: keyof T) => {
    const baseClass = !disableDefaultStyles
      ? `px-2 py-2 sm:px-4 sm:py-2 text-left text-xs font-medium uppercase tracking-wider ${
          customClassNames.th || ""
        }`
      : customClassNames.th || "";

    return `${baseClass} ${getFreezeClass(prop)}`;
  };

  const trClassName = (index: number) =>
    disableDefaultStyles
      ? customClassNames.tr || ""
      : `${baseTrClassName(index)} ${customClassNames.tr || ""}`;

  const tdClassName = (prop: keyof T) => {
    const baseClass = !disableDefaultStyles
      ? `px-2 py-2 sm:px-4 sm:py-2 text-sm ${baseTdClassName} ${
          customClassNames.td || ""
        }`
      : customClassNames.td || "";

    return `${baseClass} ${getFreezeClass(prop)}`;
  };

  const getSortIndicator = (prop: keyof T) => {
    if (!sortableProps.includes(prop)) return "";
    if (prop === sortProp) {
      return sortOrder === "asc" ? "▲" : sortOrder === "desc" ? "▼" : "▲";
    }
    return sortableProps.includes(prop) ? "▲" : "";
  };

  const visibleProps = props.filter((prop) => !hiddenColumns.has(prop));

  return (
    <>
      <div className="relative overflow-x-auto">
        <table className={tableClassName}>
          <thead className={theadClassName}>
            <tr>
              {columns.map((col, i) => {
                const prop = props[i];
                if (hiddenColumns.has(prop)) return null;
                return (
                  <th
                    key={col}
                    id={`header-${String(prop)}`}
                    scope="col"
                    className={`${thClassName(prop)} relative`}
                    style={{
                      cursor: sortableProps.includes(prop)
                        ? "pointer"
                        : "default",
                      width: columnWidths[String(prop)] || "auto",
                      minWidth: "150px",
                      maxWidth: "300px",
                    }}
                  >
                    <div className="flex items-center justify-between space-x-2 p-1">
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleSort(prop)}
                      >
                        <span className="block truncate">
                          {col} {getSortIndicator(prop)}
                        </span>
                      </div>
                      <div className="flex-shrink-0 relative">
                        <button
                          onClick={(e) => toggleHeaderDropdown(prop, e)}
                          className="p-1 hover:bg-gray-200 rounded-full dark:hover:bg-gray-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4"
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
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[100] dark:bg-gray-700">
                            <button
                              onClick={(e) =>
                                toggleFreezeColumn(prop, "left", e)
                              }
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                              {frozenColumns[prop as string] === "left"
                                ? "Unfreeze"
                                : "Freeze Left"}
                            </button>
                            <button
                              onClick={(e) =>
                                toggleFreezeColumn(prop, "right", e)
                              }
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                              {frozenColumns[prop as string] === "right"
                                ? "Unfreeze"
                                : "Freeze Right"}
                            </button>
                            <button
                              onClick={() => autoFitColumn(prop)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                              Auto-fit Column
                            </button>
                            <button
                              onClick={(e) => toggleColumnVisibility(prop, e)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                              Hide Column
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}
              {actions && actionTexts && (
                <th scope="col" className={thClassName(props[0])}>
                  <span className="sr-only">{actionTexts.join(", ")}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className={tbodyClassName}>
            {paginatedData.map((item, dataIndex) => {
              if (renderRow) {
                return (
                  <tr
                    key={dataIndex}
                    onClick={() => rowOnClick && rowOnClick(item)}
                    className={`${trClassName(dataIndex)} ${
                      rowOnClick ? "cursor-pointer" : ""
                    }`}
                  >
                    {renderRow(item, dataIndex)}
                  </tr>
                );
              }
              return (
                <tr
                  key={dataIndex}
                  onClick={() => rowOnClick && rowOnClick(item)}
                  className={`${trClassName(dataIndex)} ${
                    rowOnClick ? "cursor-pointer" : ""
                  }`}
                >
                  {visibleProps.map((prop) => {
                    let value = item[prop];
                    if (value === null || value === undefined || value === "") {
                      value = "-" as T[keyof T];
                    }
                    const cellKey = `${dataIndex}-${String(prop)}`;
                    const isExpanded = expandedCells[cellKey];
                    let displayValue: React.ReactNode;
                    let valToFormat = String(value);

                    if (formatValue && !Array.isArray(value)) {
                      displayValue = formatValue(
                        valToFormat,
                        String(prop),
                        item
                      );
                    } else if (
                      typeof value === "string" &&
                      isDateString(value)
                    ) {
                      valToFormat = formatDate(new Date(value), true);
                      displayValue = valToFormat;
                    } else if (Array.isArray(value)) {
                      let displayArray: any[] = value as any[];
                      if (!isExpanded && displayArray.length > 5) {
                        displayArray = displayArray.slice(0, 5);
                      }
                      displayValue = (
                        <div
                          className="cell-content flex flex-wrap gap-1"
                          style={{
                            maxWidth: "200px",
                            overflowX: "auto",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {displayArray.map((chip, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-indigo-100 text-gray-800 px-2 py-1 rounded-full text-xs dark:bg-indigo-900 dark:text-gray-200"
                            >
                              {trimText(String(chip), 20)}
                            </span>
                          ))}
                          {!isExpanded && (value as any[]).length > 5 && (
                            <span
                              className="inline-block bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs cursor-pointer dark:bg-gray-700 dark:text-gray-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCells((prev) => ({
                                  ...prev,
                                  [cellKey]: true,
                                }));
                              }}
                            >
                              +{(value as any[]).length - 5} more
                            </span>
                          )}
                        </div>
                      );
                    } else if (
                      typeof value === "string" &&
                      value.startsWith("http")
                    ) {
                      displayValue = (
                        <Link href={value} className="cell-content">
                          <span
                            className="text-blue-500 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isExpanded ? value : trimText(value, 30)}
                          </span>
                        </Link>
                      );
                    } else {
                      if (!Array.isArray(value)) {
                        if (!isExpanded) {
                          valToFormat = trimText(valToFormat, 30);
                        }
                      }
                      displayValue = valToFormat;
                    }

                    if (!displayValue && !Array.isArray(value)) {
                      displayValue = valToFormat;
                    }

                    return (
                      <td
                        key={String(prop)}
                        className={tdClassName(prop)}
                        data-column={String(prop)}
                        style={{
                          width: columnWidths[String(prop)] || "auto",
                          minWidth: "150px",
                          maxWidth: "300px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCells((prev) => ({
                            ...prev,
                            [cellKey]: !prev[cellKey],
                          }));
                        }}
                      >
                        <div className="cell-content whitespace-normal break-words">
                          {displayValue}
                        </div>
                      </td>
                    );
                  })}
                  {actions && actionTexts && actionFunctions && (
                    <ActionDropdown<T>
                      item={item}
                      index={dataIndex}
                      actionTexts={actionTexts}
                      actionFunctions={actionFunctions}
                      disableDefaultStyles={disableDefaultStyles}
                      customClassNames={customClassNames}
                      enableDarkMode={enableDarkMode}
                    />
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {enablePagination && page !== undefined && setPage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
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
