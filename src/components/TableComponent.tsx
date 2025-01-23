"use client";
import React, { useEffect, useState, useRef } from "react";
import NoContentComponent from "./NoContentComponent";
import TableSkeleton from "./TableSkeleton";
import ActionDropdown from "./ActionDropdown";
import Link from "next/link";
import { TableProps } from "../types";
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
}: TableProps<T>) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedCells, setExpandedCells] = useState<{
    [key: string]: boolean;
  }>({});
  const [sortProp, setSortProp] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [frozenColumns, setFrozenColumns] = useState<{
    [key: string]: "left" | "right" | null;
  }>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [headerDropdown, setHeaderDropdown] = useState<{
    [key: string]: boolean;
  }>({});
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    {}
  );
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const resizingRef = useRef<{ startX: number; startWidth: number } | null>(
    null
  );
  const tableRef = useRef<HTMLTableElement>(null);

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
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && resizingRef.current) {
        const delta = e.clientX - resizingRef.current.startX;
        const newWidth = Math.max(100, resizingRef.current.startWidth + delta);
        setColumnWidths((prev) => ({
          ...prev,
          [isResizing]: newWidth,
        }));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      resizingRef.current = null;
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      Object.keys(headerDropdown).forEach((key) => {
        if (headerDropdown[key]) {
          const element = document.getElementById(`header-dropdown-${key}`);
          if (element && !element.contains(target)) {
            setHeaderDropdown((prev) => ({ ...prev, [key]: false }));
          }
        }
      });
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [headerDropdown]);

  const startResize = (prop: string, e: React.MouseEvent) => {
    e.preventDefault();
    const column = document.querySelector(`[data-column="${prop}"]`);
    if (column) {
      setIsResizing(prop);
      resizingRef.current = {
        startX: e.clientX,
        startWidth: column.getBoundingClientRect().width,
      };
    }
  };

  const toggleHeaderDropdown = (prop: string, e: React.MouseEvent) => {
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
        [prop]: !prev[prop],
      };
    });
  };

  const toggleFreeze = (prop: string, position: "left" | "right") => {
    setFrozenColumns((prev) => {
      const current = prev[prop];
      return {
        ...prev,
        [prop]: current === position ? null : position,
      };
    });
    setHeaderDropdown((prev) => ({ ...prev, [prop]: false }));
  };

  const toggleColumnVisibility = (prop: string) => {
    setHiddenColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(prop)) {
        newSet.delete(prop);
      } else {
        newSet.add(prop);
      }
      return newSet;
    });
    setHeaderDropdown((prev) => ({ ...prev, [prop]: false }));
  };

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
        const value = item[prop as keyof T];
        return String(value).toLowerCase().includes(searchValue.toLowerCase());
      });
    });
  }

  if (filteredData.length === 0) {
    return <NoContentComponent {...noContentProps} />;
  }

  const handleSort = (col: string) => {
    if (!sortableProps.includes(col as keyof T)) return;
    if (sortProp === col) {
      if (sortOrder === "none") {
        setSortOrder("asc");
      } else if (sortOrder === "asc") {
        setSortOrder("desc");
      } else {
        setSortOrder("none");
      }
    } else {
      setSortProp(col);
      setSortOrder("asc");
    }
  };

  let sortedData = [...filteredData];
  if (sortProp && sortOrder !== "none") {
    sortedData.sort((a, b) => {
      const aVal = a[sortProp as keyof T];
      const bVal = b[sortProp as keyof T];
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

  const getFreezeClass = (prop: string): string => {
    const freezePosition = frozenColumns[prop];
    return freezePosition ? `freeze-${freezePosition}` : "";
  };

  const getSortIndicator = (prop: string) => {
    if (!sortableProps.includes(prop as keyof T)) return null;
    const isActive = prop === sortProp;
    const icon = isActive && sortOrder === "desc" ? "▼" : "▲";
    return (
      <span
        className={`sort-indicator ${
          isActive ? "text-blue-500" : "text-gray-400"
        }`}
      >
        {icon}
      </span>
    );
  };

  const visibleProps = props.filter((prop) => !hiddenColumns.has(String(prop)));

  return (
    <>
      <div className="overflow-x-auto pb-6">
        <table ref={tableRef} className={tableClassName}>
          <thead className={theadClassName}>
            <tr>
              {columns.map((col, i) => {
                const prop = String(props[i]);
                if (hiddenColumns.has(prop)) return null;
                return (
                  <th
                    key={col}
                    data-column={prop}
                    className={`relative ${getFreezeClass(prop)}`}
                    style={{
                      width: columnWidths[prop] || "auto",
                      cursor: sortableProps.includes(prop as keyof T)
                        ? "pointer"
                        : "default",
                    }}
                  >
                    <div className="header-content">
                      <div
                        className="header-text"
                        onClick={() => handleSort(prop)}
                      >
                        {getSortIndicator(prop)}
                        {col}
                      </div>
                      <div className="header-actions">
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
                        {headerDropdown[prop] && (
                          <div
                            id={`header-dropdown-${prop}`}
                            className="dropdown-menu"
                          >
                            <button
                              onClick={() => toggleFreeze(prop, "left")}
                              className="dropdown-item"
                            >
                              {frozenColumns[prop] === "left"
                                ? "Unfreeze"
                                : "Freeze Left"}
                            </button>
                            <button
                              onClick={() => toggleFreeze(prop, "right")}
                              className="dropdown-item"
                            >
                              {frozenColumns[prop] === "right"
                                ? "Unfreeze"
                                : "Freeze Right"}
                            </button>
                            <button
                              onClick={() => toggleColumnVisibility(prop)}
                              className="dropdown-item"
                            >
                              Hide Column
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`resizer ${
                        isResizing === prop ? "resizing" : ""
                      }`}
                      onMouseDown={(e) => startResize(prop, e)}
                    />
                  </th>
                );
              })}
              {actions && actionTexts && (
                <th className="relative">
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
                    className={`${baseTrClassName(dataIndex)} ${
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
                  className={`${baseTrClassName(dataIndex)} ${
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

                    if (formatValue) {
                      displayValue = formatValue(
                        String(value),
                        String(prop),
                        item
                      );
                    } else {
                      if (typeof value === "string" && isDateString(value)) {
                        displayValue = formatDate(new Date(value), true);
                      } else if (Array.isArray(value)) {
                        let displayArray: any[] = value;
                        if (!isExpanded && displayArray.length > 5) {
                          displayArray = displayArray.slice(0, 5);
                        }
                        displayValue = (
                          <div className="chip-container">
                            {displayArray.map((chip, idx) => (
                              <span key={idx} className="chip">
                                {trimText(String(chip), 20)}
                              </span>
                            ))}
                            {!isExpanded && value.length > 5 && (
                              <span
                                className="more-chip"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedCells((prev) => ({
                                    ...prev,
                                    [cellKey]: true,
                                  }));
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
                            >
                              {isExpanded ? value : trimText(value, 30)}
                            </span>
                          </Link>
                        );
                      } else {
                        displayValue = isExpanded
                          ? String(value)
                          : trimText(String(value), 30);
                      }
                    }

                    return (
                      <td
                        key={String(prop)}
                        data-column={String(prop)}
                        className={`table-cell ${getFreezeClass(String(prop))}`}
                        style={{
                          width: columnWidths[String(prop)] || "auto",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCells((prev) => ({
                            ...prev,
                            [cellKey]: !prev[cellKey],
                          }));
                        }}
                      >
                        {displayValue}
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
