"use client";
import React, {
  useEffect,
  useState,
  isValidElement,
  cloneElement,
} from "react";
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
  const [headerDropdown, setHeaderDropdown] = useState<{
    [key: string]: boolean;
  }>({});
  const [stickyColumns, setStickyColumns] = useState<{
    [key: string]: "left" | "right" | null;
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

  const toggleHeaderDropdown = (prop: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeaderDropdown((prev) => {
      const newState = Object.keys(prev).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {}
      );
      return {
        ...newState,
        [prop]: !prev[prop],
      };
    });
  };

  const toggleSticky = (prop: string, position: "left" | "right") => {
    setStickyColumns((prev) => {
      const current = prev[prop];
      return {
        ...prev,
        [prop]: current === position ? null : position,
      };
    });
    setHeaderDropdown((prev) => ({ ...prev, [prop]: false }));
  };

  const toggleHideColumn = (prop: string) => {
    setHiddenColumns((prev) => ({ ...prev, [prop]: !prev[prop] }));
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
    : `${baseTheadClassName} ${customClassNames.thead || ""} sticky-header`;

  const tbodyClassName = disableDefaultStyles
    ? customClassNames.tbody || ""
    : `${baseTbodyClassName} ${customClassNames.tbody || ""}`;

  const getColumnClass = (prop: string): string => {
    const stickyPosition = stickyColumns[prop];
    return stickyPosition ? `sticky-${stickyPosition}` : "";
  };

  const thClassName = (prop: string) => {
    const baseClass = !disableDefaultStyles
      ? `px-2 py-2 sm:px-4 sm:py-2 text-left text-xs font-medium uppercase tracking-wider ${
          customClassNames.th || ""
        }`
      : customClassNames.th || "";
    return `${baseClass} ${getColumnClass(prop)}`;
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
    return `${baseClass} ${getColumnClass(prop)}`;
  };

  const displayedColumns = columns.map((col, i) => {
    let indicator = "";
    if (sortableProps.includes(props[i])) {
      if (props[i] === sortProp) {
        if (sortOrder === "asc") indicator = "▲";
        else if (sortOrder === "desc") indicator = "▼";
      }
    }
    return { col, indicator, prop: props[i] };
  });

  return (
    <>
      <div
        className="table-scroll-container pb-6"
        style={{
          maxHeight: "600px",
          maxWidth: "100%",
          overflow: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <table
          className={tableClassName}
          style={{ margin: 0, padding: 0, minWidth: "fit-content" }}
        >
          <thead className={theadClassName}>
            <tr>
              {displayedColumns.map(({ col, indicator, prop }) => {
                if (hiddenColumns[String(prop)]) return null;
                return (
                  <th
                    key={col}
                    scope="col"
                    className={thClassName(String(prop))}
                    style={{
                      cursor: sortableProps.includes(prop)
                        ? "pointer"
                        : "default",
                      verticalAlign: "middle",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex-1"
                        onClick={() => handleSort(String(prop))}
                      >
                        {col} {indicator}
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => toggleHeaderDropdown(String(prop), e)}
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
                          <div
                            id={`header-dropdown-${String(prop)}`}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-[100]"
                          >
                            <button
                              onClick={() => toggleSticky(String(prop), "left")}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                            >
                              {stickyColumns[String(prop)] === "left"
                                ? "Unstick"
                                : "Stick Left"}
                            </button>
                            <button
                              onClick={() =>
                                toggleSticky(String(prop), "right")
                              }
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                            >
                              {stickyColumns[String(prop)] === "right"
                                ? "Unstick"
                                : "Stick Right"}
                            </button>
                            <button
                              onClick={() => toggleHideColumn(String(prop))}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                            >
                              {hiddenColumns[String(prop)]
                                ? "Unhide Column"
                                : "Hide Column"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}
              {actions && actionTexts && (
                <th
                  scope="col"
                  className={`${thClassName("")}`}
                  style={{ verticalAlign: "middle" }}
                >
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
                      let displayArray: any[] = [...value];
                      if (!isExpanded && displayArray.length > 5) {
                        displayArray = displayArray.slice(0, 5);
                      }
                      displayValue = (
                        <div
                          className="flex flex-wrap gap-1"
                          style={{ maxWidth: "200px", overflowX: "auto" }}
                        >
                          {displayArray.map((chip, idx) => {
                            const rawChip = trimText(String(chip), 20);
                            if (formatValue) {
                              const possiblyNode = formatValue(
                                String(chip),
                                String(prop),
                                item
                              );
                              if (isValidElement(possiblyNode)) {
                                return cloneElement(possiblyNode, { key: idx });
                              }
                              return (
                                <span
                                  key={idx}
                                  className="inline-block bg-indigo-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                                >
                                  {possiblyNode}
                                </span>
                              );
                            }
                            return (
                              <span
                                key={idx}
                                className="inline-block bg-indigo-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                              >
                                {rawChip}
                              </span>
                            );
                          })}
                          {!isExpanded && (value as any[]).length > 5 && (
                            <span
                              className="inline-block bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs cursor-pointer"
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
                      if (!Array.isArray(value) && !isExpanded) {
                        valToFormat = trimText(valToFormat, 30);
                      }
                      if (formatValue) {
                        const possiblyNode = formatValue(
                          valToFormat,
                          String(prop),
                          item
                        );
                        displayValue = isValidElement(possiblyNode)
                          ? possiblyNode
                          : possiblyNode ?? valToFormat;
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
                          e.stopPropagation();
                          setExpandedCells((prev) => ({
                            ...prev,
                            [cellKey]: !prev[cellKey],
                          }));
                        }}
                        style={{ verticalAlign: "middle" }}
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
