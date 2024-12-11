"use client";

import React, { useEffect, useState } from "react";
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
  itemsPerPageOptions,
  setItemsPerPage,
  noContentProps = {},
  valueFormatter,
  enableServerSidePagination = false,
  onPageChange,
}: TableProps<T>) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedCells, setExpandedCells] = useState<{
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

  if (loading) {
    return <TableSkeleton enableDarkMode={enableDarkMode} />;
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

  if (!filteredData || filteredData.length === 0) {
    return (
      <NoContentComponent
        name={searchValue ?? "items"}
        text={noContentProps.text}
        icon={noContentProps.icon}
        component={noContentProps.component}
      />
    );
  }

  let paginatedData = filteredData;
  let calculatedTotalPages =
    totalPages ?? Math.ceil(filteredData.length / itemsPerPage);

  if (enablePagination && !enableServerSidePagination) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    paginatedData = filteredData.slice(startIndex, endIndex);
    if (page > calculatedTotalPages && setPage) {
      setPage(calculatedTotalPages);
    }
  }

  const handleRowClick = (item: T) => {
    if (rowOnClick) rowOnClick(item);
  };

  const handleRowKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    item: T
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowClick(item);
    }
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

  const getDisplayValue = (
    value: any,
    cellKey: string,
    item: T,
    prop: keyof T
  ): React.ReactNode => {
    if (valueFormatter) return valueFormatter(value, prop, item);
    const isExpanded = expandedCells[cellKey];
    if (typeof value === "string" && isDateString(value)) {
      return formatDate(new Date(value), true);
    } else if (Array.isArray(value)) {
      let displayArray: any[] = value;
      if (!isExpanded && displayArray.length > 5) {
        displayArray = displayArray.slice(0, 5);
      }
      return (
        <div
          className="flex flex-wrap gap-1"
          style={{ maxWidth: "200px", overflowX: "auto" }}
        >
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
                setExpandedCells((prev) => ({ ...prev, [cellKey]: true }));
              }}
            >
              +{(value as any[]).length - 5} more
            </span>
          )}
        </div>
      );
    } else if (typeof value === "string" && value.startsWith("http")) {
      return (
        <Link href={value}>
          <span
            className="text-blue-500 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {isExpanded ? value : trimText(value, 30)}
          </span>
        </Link>
      );
    } else if (
      (typeof value === "number" ||
        (typeof value === "string" && !isNaN(Number(value)))) &&
      !isDateString(String(value))
    ) {
      let valueNum = Number(value);
      if (isNaN(valueNum)) {
        valueNum = 0;
      }
      valueNum = Math.round(valueNum * 100) / 100;
      return isExpanded
        ? valueNum.toString()
        : Number.isInteger(valueNum)
        ? valueNum.toString()
        : valueNum.toFixed(2);
    } else {
      return isExpanded ? String(value) : trimText(String(value), 30);
    }
  };

  return (
    <>
      <div style={{ overflowX: "auto" }} className="pb-6">
        <table
          className={tableClassName}
          style={{ margin: 0, padding: 0 }}
          role="table"
        >
          <thead className={theadClassName}>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col" className={thClassName}>
                  {column}
                </th>
              ))}
              {actions && actionTexts && (
                <th scope="col" className={thClassName}>
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
                    onClick={() => handleRowClick(item)}
                    onKeyDown={(e) => handleRowKeyDown(e, item)}
                    className={`${trClassName(dataIndex)} ${
                      rowOnClick
                        ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : ""
                    }`}
                    tabIndex={rowOnClick ? 0 : -1}
                    role="row"
                  >
                    {renderRow(item, dataIndex)}
                  </tr>
                );
              }

              return (
                <tr
                  key={dataIndex}
                  onClick={() => handleRowClick(item)}
                  onKeyDown={(e) => handleRowKeyDown(e, item)}
                  className={`${trClassName(dataIndex)} ${
                    rowOnClick
                      ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      : ""
                  }`}
                  tabIndex={rowOnClick ? 0 : -1}
                  role="row"
                >
                  {props.map((prop) => {
                    let value = item[prop];
                    if (value === null || value === undefined || value === "") {
                      value = "-" as T[keyof T];
                    }
                    const cellKey = `${dataIndex}-${String(prop)}`;
                    const displayValue = getDisplayValue(
                      value,
                      cellKey,
                      item,
                      prop
                    );

                    return (
                      <td
                        key={String(prop)}
                        className={tdClassName}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCells((prev) => ({
                            ...prev,
                            [cellKey]: !prev[cellKey],
                          }));
                        }}
                        role="cell"
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
            itemsPerPage={itemsPerPage}
            itemsPerPageOptions={itemsPerPageOptions}
            setItemsPerPage={setItemsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}

export default TableComponent;
