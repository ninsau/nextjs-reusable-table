"use client";
import React, { useEffect, useState } from "react";
import NoContentComponent from "./NoContentComponent";
import TableSkeleton from "./TableSkeleton";
import ActionDropdown from "./ActionDropdown";
import Link from "next/link";
import { TableProps } from "../types";
import { formatDate, isDateString, trimText } from "../utils/helpers";

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
  paginationComponent,
  enableDarkMode = true,
}: TableProps<T> & { enableDarkMode?: boolean }) {
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

  if (!data || loading) {
    return <TableSkeleton enableDarkMode={enableDarkMode} />;
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

  const baseContainerClassName =
    !disableDefaultStyles && enableDarkMode
      ? isDarkMode
        ? "bg-gray-900 text-gray-200 border-gray-700"
        : "bg-white text-gray-900 border-gray-200"
      : "";

  const baseTableClassName =
    !disableDefaultStyles && enableDarkMode
      ? isDarkMode
        ? "bg-gray-900 text-gray-200"
        : "bg-white text-gray-900"
      : "";

  const baseTheadClassName =
    !disableDefaultStyles && enableDarkMode
      ? isDarkMode
        ? "bg-gray-700 text-gray-300"
        : "bg-gray-50 text-gray-500"
      : "";

  const baseTrClassName = (index: number) =>
    !disableDefaultStyles && enableDarkMode
      ? index % 2 === 0
        ? isDarkMode
          ? "bg-gray-800"
          : "bg-white"
        : isDarkMode
        ? "bg-gray-700"
        : "bg-gray-50"
      : "";

  const baseTdClassName =
    !disableDefaultStyles && enableDarkMode
      ? isDarkMode
        ? "text-gray-300 border-gray-700"
        : "text-gray-700 border-gray-200"
      : "";

  const baseActionTdClassName =
    !disableDefaultStyles && enableDarkMode
      ? isDarkMode
        ? "text-gray-300 border-gray-700"
        : "text-gray-700 border-gray-200"
      : "";

  const containerClassName = disableDefaultStyles
    ? customClassNames.container || ""
    : `${baseContainerClassName} my-8 overflow-x-auto ${
        customClassNames.container || ""
      }`;

  const tableClassName = disableDefaultStyles
    ? customClassNames.table || ""
    : `${baseTableClassName} min-w-full divide-y divide-gray-200 ${
        customClassNames.table || ""
      }`;

  const theadClassName = disableDefaultStyles
    ? customClassNames.thead || ""
    : `${baseTheadClassName} ${customClassNames.thead || ""}`;

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

  const actionTdClassName = disableDefaultStyles
    ? customClassNames.actionTd || ""
    : `relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 ${baseActionTdClassName} ${
        customClassNames.actionTd || ""
      }`;

  return (
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
                    <span className="sr-only">{actionTexts.join(", ")}</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, dataIndex) => {
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

                      if (typeof value === "string" && isDateString(value)) {
                        displayValue = formatDate(new Date(value), true);
                      } else if (Array.isArray(value)) {
                        let displayArray: any[] = value as any[];
                        if (!isExpanded && displayArray.length > 5) {
                          displayArray = displayArray.slice(0, 5);
                        }
                        displayValue = (
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
                      <td className={actionTdClassName}>
                        <ActionDropdown<T>
                          item={item}
                          index={dataIndex}
                          actionTexts={actionTexts}
                          actionFunctions={actionFunctions}
                          disableDefaultStyles={disableDefaultStyles}
                          customClassNames={customClassNames}
                          enableDarkMode={enableDarkMode}
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {paginationComponent && paginationComponent}
        </div>
      </div>
    </div>
  );
}

export default TableComponent;
