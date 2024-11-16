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

  if (!data || data.length === 0) {
    return <NoContentComponent name={searchValue ?? "items"} />;
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
    return <NoContentComponent name={searchValue ?? "items"} />;
  }

  let paginatedData = filteredData;
  let calculatedTotalPages =
    totalPages ?? Math.ceil(filteredData.length / itemsPerPage);

  if (enablePagination) {
    if (totalPages !== undefined) {
      // Data is already paginated externally
      paginatedData = filteredData; // Use data as is
    } else {
      // Data is not paginated, we need to paginate it
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      paginatedData = filteredData.slice(startIndex, endIndex);
    }

    if (page > calculatedTotalPages && setPage) {
      setPage(calculatedTotalPages);
    }
  }

  const baseContainerClassName =
    !disableDefaultStyles && enableDarkMode
      ? isDarkMode
        ? "bg-gray-900 text-gray-200 border-gray-700"
        : "bg-white text-gray-900 border-gray-200"
      : "";

  const baseTableClassName = !disableDefaultStyles
    ? `min-w-full divide-y ${
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

  const containerClassName = disableDefaultStyles
    ? customClassNames.container || ""
    : `${baseContainerClassName} ${customClassNames.container || ""}`;

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
    : `px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
        customClassNames.th || ""
      }`;

  const trClassName = (index: number) =>
    disableDefaultStyles
      ? customClassNames.tr || ""
      : `${baseTrClassName(index)} ${customClassNames.tr || ""}`;

  const tdClassName = disableDefaultStyles
    ? customClassNames.td || ""
    : `px-6 py-4 whitespace-nowrap text-sm ${baseTdClassName} ${
        customClassNames.td || ""
      }`;

  return (
    <>
      <div className="overflow-x-auto">
        <div className={containerClassName}>
          <div className="inline-block min-w-full align-middle">
            <div
              className={`overflow-hidden border rounded-lg ${baseContainerClassName}`}
            >
              <table className={tableClassName}>
                <thead className={theadClassName}>
                  <tr>
                    {columns.map((column) => (
                      <th key={column} scope="col" className={thClassName}>
                        {column}
                      </th>
                    ))}
                    {actions && actionTexts && (
                      <th scope="col" className={thClassName}>
                        <span className="sr-only">
                          {actionTexts.join(", ")}
                        </span>
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
                          const value = item[prop as keyof T];
                          const cellKey = `${dataIndex}-${String(prop)}`;
                          const isExpanded = expandedCells[cellKey];
                          let displayValue: React.ReactNode;

                          if (
                            typeof value === "string" &&
                            isDateString(value)
                          ) {
                            displayValue = formatDate(new Date(value), true);
                          } else if (Array.isArray(value)) {
                            let displayArray: any[] = value as any[];
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
                            displayValue = isExpanded
                              ? String(value)
                              : trimText(String(value), 30);
                          }

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
          </div>
        </div>
      </div>
      {enablePagination && page !== undefined && setPage && (
        <div className="flex justify-center mt-4">
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
