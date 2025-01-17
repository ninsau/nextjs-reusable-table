"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { TableProps } from "../types";
import NoContentComponent from "./NoContentComponent";
import TableSkeleton from "./TableSkeleton";
import ActionDropdown from "./ActionDropdown";
import Link from "next/link";
import { formatDate, isDateString, trimText } from "../utils/helpers";
import PaginationComponent from "./PaginationComponent";

// Sticky styles with proper z-index and backgrounds
const stickyStyles = {
  left: `
    position: sticky;
    background: inherit;
    z-index: 20;
    box-shadow: 2px 0 4px -2px rgba(0, 0, 0, 0.15);
  `,
  right: `
    position: sticky;
    background: inherit;
    z-index: 20;
    box-shadow: -2px 0 4px -2px rgba(0, 0, 0, 0.15);
  `,
  header: `
    position: sticky;
    background: inherit;
    z-index: 30;
    top: 0;
  `,
};

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
  formatCell,
  stickyColumns,
  stickyHeader = false,
  groupBy,
  groupRenderer,
  columnResizable = false,
  multiSelect = false,
  selectedRows = [],
  onSelectionChange,
  columnVisibility,
  cellEditable = false,
  onCellEdit,
  maxHeight = "100vh",
  noContentProps,
}: TableProps<T>) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedCells, setExpandedCells] = useState<{
    [key: string]: boolean;
  }>({});
  const [sortProp, setSortProp] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    {}
  );
  const [isResizing, setIsResizing] = useState(false);
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const tableRef = useRef<HTMLDivElement>(null);

  // Column resize handling
  const handleColumnResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizingColumn.current) return;
      const diff = e.clientX - startX.current;
      const newWidth = Math.max(100, startWidth.current + diff);
      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn.current!]: newWidth,
      }));
    },
    [isResizing]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    resizingColumn.current = null;
    document.removeEventListener("mousemove", handleColumnResize);
    document.removeEventListener("mouseup", handleResizeEnd);
  }, [handleColumnResize]);

  const startResize = useCallback(
    (columnId: string, e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      resizingColumn.current = columnId;
      startX.current = e.clientX;
      startWidth.current = columnWidths[columnId] || 150;
      document.addEventListener("mousemove", handleColumnResize);
      document.addEventListener("mouseup", handleResizeEnd);
    },
    [columnWidths, handleColumnResize, handleResizeEnd]
  );

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

  if (loading) {
    return <TableSkeleton enableDarkMode={enableDarkMode} />;
  }

  if (!data || data.length === 0) {
    return <NoContentComponent {...noContentProps} />;
  }

  // Search handling
  let filteredData = data;
  if (searchValue) {
    filteredData = data.filter((item) => {
      return props.some((prop) => {
        if (!columnVisibility || columnVisibility[prop]) {
          const value = item[prop as keyof T];
          return String(value)
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        }
        return false;
      });
    });
  }

  if (filteredData.length === 0) {
    return <NoContentComponent {...noContentProps} />;
  }

  // Sort handling
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

  // Group handling
  let groupedData = sortedData;
  if (groupBy) {
    const groups = new Map<any, T[]>();
    sortedData.forEach((item) => {
      const groupValue = item[groupBy];
      if (!groups.has(groupValue)) {
        groups.set(groupValue, []);
      }
      groups.get(groupValue)!.push(item);
    });
    groupedData = Array.from(groups.entries()).flatMap(
      ([groupValue, items]) => {
        const groupHeader = groupRenderer
          ? [{ isGroupHeader: true, content: groupRenderer(groupValue, items) }]
          : [];
        return [...groupHeader, ...items];
      }
    ) as T[];
  }

  // Pagination handling
  let paginatedData = groupedData;
  let calculatedTotalPages =
    totalPages ?? Math.ceil(groupedData.length / itemsPerPage);

  if (enablePagination) {
    if (totalPages !== undefined) {
      paginatedData = groupedData;
    } else {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      paginatedData = groupedData.slice(startIndex, endIndex);
    }
    if (page > calculatedTotalPages && setPage) {
      setPage(calculatedTotalPages);
    }
  }

  // Cell editing
  const handleCellEdit = (
    newValue: any,
    prop: keyof T,
    item: T,
    index: number
  ) => {
    if (onCellEdit) {
      onCellEdit(newValue, prop, item, index);
    }
  };

  // Selection handling with proper comparison
  const handleSelectionChange = (item: T) => {
    if (multiSelect && onSelectionChange) {
      const isSelected = selectedRows.some(
        (row) => JSON.stringify(row) === JSON.stringify(item)
      );
      const newSelection = isSelected
        ? selectedRows.filter(
            (row) => JSON.stringify(row) !== JSON.stringify(item)
          )
        : [...selectedRows, item];
      onSelectionChange(newSelection);
    }
  };

  const allSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) =>
      selectedRows.some((row) => JSON.stringify(row) === JSON.stringify(item))
    );

  // Cell rendering with sticky support
  const renderCell = (
    item: T,
    prop: keyof T,
    dataIndex: number,
    isSticky?: boolean
  ) => {
    let value = item[prop];
    if (value === null || value === undefined || value === "") {
      value = "-" as T[keyof T];
    }

    const cellKey = `${dataIndex}-${String(prop)}`;
    const isExpanded = expandedCells[cellKey];
    let displayValue: React.ReactNode;
    let valToFormat = String(value);

    if (formatCell) {
      const formattedCell = formatCell(
        valToFormat,
        String(prop),
        item,
        dataIndex
      );
      if (formattedCell) {
        return (
          <td
            key={String(prop)}
            className={`${tdClassName} ${formattedCell.className || ""} ${
              isSticky
                ? `${stickyStyles.left} ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`
                : ""
            }`}
            style={{
              ...formattedCell.style,
              width: columnWidths[String(prop)] || "auto",
              left: isSticky ? `${multiSelect ? 40 : 0}px` : undefined,
              right: isSticky ? "0px" : undefined,
            }}
          >
            {formattedCell.content || displayValue}
          </td>
        );
      }
    }

    if (typeof value === "string" && isDateString(value)) {
      valToFormat = formatDate(new Date(value), true);
    } else if (Array.isArray(value)) {
      let displayArray: any[] = value as any[];
      if (!isExpanded && displayArray.length > 5) {
        displayArray = displayArray.slice(0, 5);
      }
      displayValue = (
        <div className="flex flex-wrap gap-1" style={{ maxWidth: "200px" }}>
          {displayArray.map((chip, idx) => (
            <span
              key={idx}
              className="inline-block bg-indigo-100 text-gray-800 px-2 py-1 rounded-full text-xs"
            >
              {trimText(String(chip), 20)}
            </span>
          ))}
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
    } else if (typeof value === "string" && value.startsWith("http")) {
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
      if (!Array.isArray(value)) {
        if (!isExpanded) {
          valToFormat = trimText(valToFormat, 30);
        }
      }
      if (formatValue) {
        displayValue = formatValue(valToFormat, String(prop), item);
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
        className={`${tdClassName} ${
          isSticky
            ? `${stickyStyles.left} ${isDarkMode ? "bg-gray-800" : "bg-white"}`
            : ""
        }`}
        style={{
          width: columnWidths[String(prop)] || "auto",
          left: isSticky ? `${multiSelect ? 40 : 0}px` : undefined,
          right: isSticky ? "0px" : undefined,
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (cellEditable) {
            const newValue = prompt("Edit value:", String(value));
            if (newValue !== null) {
              handleCellEdit(newValue, prop, item, dataIndex);
            }
          } else {
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
  };

  // Class name handling
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
      ? `${
          index % 2 === 0
            ? isDarkMode
              ? "bg-gray-800"
              : "bg-white"
            : isDarkMode
            ? "bg-gray-700"
            : "bg-gray-100"
        } hover:bg-gray-50 dark:hover:bg-gray-700`
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
    : `${baseTheadClassName} ${customClassNames.thead || ""} ${
        stickyHeader ? stickyStyles.header : ""
      }`;

  const tbodyClassName = disableDefaultStyles
    ? customClassNames.tbody || ""
    : `${baseTbodyClassName} ${customClassNames.tbody || ""}`;

  const thClassName = disableDefaultStyles
    ? customClassNames.th || ""
    : `px-2 py-2 sm:px-4 sm:py-2 text-left text-xs font-medium uppercase tracking-wider ${
        customClassNames.th || ""
      }`;

  const trClassName = (index: number) =>
    disableDefaultStyles
      ? customClassNames.tr || ""
      : `${baseTrClassName(index)} ${customClassNames.tr || ""}`;

  const tdClassName = disableDefaultStyles
    ? customClassNames.td || ""
    : `px-2 py-2 sm:px-4 sm:py-2 text-sm ${baseTdClassName} ${
        customClassNames.td || ""
      }`;

  const visibleProps = props.filter(
    (prop) => !columnVisibility || columnVisibility[prop]
  );

  const displayedColumns = columns
    .filter((_, i) => visibleProps.includes(props[i]))
    .map((col, i) => {
      let indicator = "";
      if (sortableProps.includes(props[i])) {
        if (props[i] === sortProp) {
          if (sortOrder === "asc") {
            indicator = "▲";
          } else if (sortOrder === "desc") {
            indicator = "▼";
          }
        }
      }
      return { col, indicator, prop: props[i] };
    });

  return (
    <>
      <div className="relative">
        <div
          className="overflow-auto table-scroll-container"
          style={{
            maxHeight: maxHeight,
            position: "relative",
            isolation: "isolate",
          }}
        >
          <div
            ref={tableRef}
            style={{
              overflowX: "auto",
              position: "relative",
              isolation: "isolate",
            }}
            className="pb-6"
          >
            <table
              className={tableClassName}
              style={{
                margin: 0,
                padding: 0,
                position: "relative",
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <thead className={theadClassName}>
                <tr>
                  {multiSelect && (
                    <th
                      className={`${thClassName} sticky left-0 z-30 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (onSelectionChange) {
                            onSelectionChange(
                              allSelected ? [] : [...paginatedData]
                            );
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </th>
                  )}
                  {displayedColumns.map(({ col, indicator, prop }, index) => {
                    const isLeftSticky = stickyColumns?.left?.includes(
                      prop as keyof T
                    );
                    const isRightSticky = stickyColumns?.right?.includes(
                      prop as keyof T
                    );

                    return (
                      <th
                        key={col}
                        scope="col"
                        className={`${thClassName} ${
                          isLeftSticky
                            ? `${stickyStyles.left} ${
                                isDarkMode ? "bg-gray-700" : "bg-gray-50"
                              }`
                            : isRightSticky
                            ? `${stickyStyles.right} ${
                                isDarkMode ? "bg-gray-700" : "bg-gray-50"
                              }`
                            : ""
                        }`}
                        style={{
                          width: columnWidths[String(prop)] || "auto",
                          left: isLeftSticky
                            ? `${multiSelect ? 40 : 0}px`
                            : undefined,
                          right: isRightSticky ? "0px" : undefined,
                        }}
                      >
                        <div
                          className="flex items-center justify-between"
                          onClick={() => handleSort(String(prop))}
                        >
                          <span
                            style={{
                              cursor: sortableProps.includes(prop as keyof T)
                                ? "pointer"
                                : "default",
                            }}
                          >
                            {col} {indicator}
                          </span>
                          {columnResizable && (
                            <div
                              className="w-1 h-full cursor-col-resize absolute right-0 top-0 bg-gray-300 hover:bg-gray-400"
                              onMouseDown={(e) => startResize(String(prop), e)}
                            />
                          )}
                        </div>
                      </th>
                    );
                  })}
                  {actions && actionTexts && (
                    <th
                      scope="col"
                      className={`${thClassName} ${
                        stickyColumns?.right
                          ? `${stickyStyles.right} ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-50"
                            }`
                          : ""
                      }`}
                      style={{
                        right: "0px",
                      }}
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
                      {multiSelect && (
                        <td
                          className={`${tdClassName} sticky left-0 z-20 ${
                            isDarkMode ? "bg-gray-800" : "bg-white"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRows.some(
                              (row) =>
                                JSON.stringify(row) === JSON.stringify(item)
                            )}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectionChange(item);
                            }}
                            className="cursor-pointer"
                          />
                        </td>
                      )}
                      {visibleProps.map((prop, colIndex) => {
                        const isLeftSticky =
                          stickyColumns?.left?.includes(prop);
                        const isRightSticky =
                          stickyColumns?.right?.includes(prop);
                        return renderCell(
                          item,
                          prop,
                          dataIndex,
                          isLeftSticky || isRightSticky
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
        </div>
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
