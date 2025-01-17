"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { TableProps } from "../types";
import NoContentComponent from "./NoContentComponent";
import TableSkeleton from "./TableSkeleton";
import ActionDropdown from "./ActionDropdown";
import Link from "next/link";
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
  onColumnVisibilityChange,
  exportOptions,
  aggregates,
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

  const handleSelectionChange = (item: T) => {
    if (multiSelect && onSelectionChange) {
      const isSelected = selectedRows.includes(item);
      const newSelection = isSelected
        ? selectedRows.filter((row) => row !== item)
        : [...selectedRows, item];
      onSelectionChange(newSelection);
    }
  };

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
              isSticky ? "sticky" : ""
            }`}
            style={{
              ...formattedCell.style,
              left: isSticky
                ? `${columnWidths[String(prop)] || 0}px`
                : undefined,
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
        className={`${tdClassName} ${isSticky ? "sticky" : ""}`}
        style={{
          width: columnWidths[String(prop)] || "auto",
          left: isSticky ? `${columnWidths[String(prop)] || 0}px` : undefined,
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

  const exportData = (type: "csv" | "excel" | "pdf") => {
    const visibleProps = props.filter(
      (prop) => !columnVisibility || columnVisibility[prop]
    );
    const visibleColumns = columns.filter((_, i) =>
      visibleProps.includes(props[i])
    );

    const exportRows = paginatedData.map((item) =>
      visibleProps.reduce(
        (acc, prop) => ({
          ...acc,
          [String(prop)]: item[prop],
        }),
        {}
      )
    );

    switch (type) {
      case "csv":
        const csvContent =
          "data:text/csv;charset=utf-8," +
          [
            visibleColumns.join(","),
            ...exportRows.map((row) =>
              Object.values(row)
                .map((val) => `"${String(val).replace(/"/g, '""')}"`)
                .join(",")
            ),
          ].join("\n");
        const encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
        break;
      case "excel":
        break;
      case "pdf":
        break;
    }
  };

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

  const aggregateRow = aggregates
    ? Object.entries(aggregates).map(([prop, config]) => {
        const values = paginatedData.map((item) => item[prop as keyof T]);
        let result;
        switch (
          (
            config as {
              type: "sum" | "average" | "count" | "min" | "max" | "custom";
            }
          ).type
        ) {
          case "sum":
            result = values.reduce((sum: any, val: any) => sum + (val || 0), 0);
            break;
          case "average":
            result =
              values.reduce((sum: any, val: any) => sum + (val || 0), 0) /
              values.length;
            break;
          case "count":
            result = values.length;
            break;
          case "min":
            result = Math.min(...(values as number[]));
            break;
          case "max":
            result = Math.max(...(values as number[]));
            break;
          case "custom":
            result = (config as { customFn: (values: any[]) => any }).customFn(
              values
            );
            break;
        }
        return { prop, result };
      })
    : null;

  return (
    <>
      <div className="relative">
        {exportOptions && (
          <div className="absolute top-0 right-0 flex gap-2 mb-2">
            {exportOptions.csv && (
              <button
                onClick={() => exportData("csv")}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Export CSV
              </button>
            )}
            {exportOptions.excel && (
              <button
                onClick={() => exportData("excel")}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                Export Excel
              </button>
            )}
            {exportOptions.pdf && (
              <button
                onClick={() => exportData("pdf")}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Export PDF
              </button>
            )}
          </div>
        )}

        <div className="overflow-auto" style={{ maxHeight: maxHeight }}>
          <div
            ref={tableRef}
            style={{ overflowX: "auto", position: "relative" }}
            className="pb-6"
          >
            <table
              className={tableClassName}
              style={{ margin: 0, padding: 0, position: "relative" }}
            >
              <thead
                className={`${theadClassName} ${
                  stickyHeader ? "sticky top-0 z-10" : ""
                }`}
              >
                <tr>
                  {multiSelect && (
                    <th className={thClassName}>
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.length === paginatedData.length &&
                          paginatedData.length > 0
                        }
                        onChange={() => {
                          if (onSelectionChange) {
                            onSelectionChange(
                              selectedRows.length === paginatedData.length
                                ? []
                                : [...paginatedData]
                            );
                          }
                        }}
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
                          isLeftSticky || isRightSticky ? "sticky" : ""
                        }`}
                        style={{
                          width: columnWidths[String(prop)] || "auto",
                          left: isLeftSticky
                            ? `${
                                multiSelect
                                  ? 40
                                  : 0 + columnWidths[String(prop)] || 0
                              }px`
                            : undefined,
                          right: isRightSticky
                            ? `${columnWidths[String(prop)] || 0}px`
                            : undefined,
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
                        stickyColumns?.right ? "sticky right-0" : ""
                      }`}
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
                        <td className={tdClassName}>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(item)}
                            onChange={() => handleSelectionChange(item)}
                            onClick={(e) => e.stopPropagation()}
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
                {aggregateRow && (
                  <tr className={`${trClassName(-1)} font-semibold`}>
                    {multiSelect && <td className={tdClassName} />}
                    {visibleProps.map((prop) => {
                      const aggregate = aggregateRow.find(
                        (agg) => agg.prop === prop
                      );
                      return (
                        <td key={String(prop)} className={tdClassName}>
                          {aggregate ? aggregate.result : ""}
                        </td>
                      );
                    })}
                    {actions && <td className={tdClassName} />}
                  </tr>
                )}
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
