import React from "react";
import { formatDate, isDateString, trimText } from "../utils/helpers";
import { TableProps } from "../types";
import NoContentComponent from "./NoContentComponent";
import TableSkeleton from "./TableSkeleton";
import ActionDropdown from "./ActionDropdown";
import Link from "next/link";

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
}: TableProps<T>) {
  if (!data || loading) {
    return <TableSkeleton />;
  }

  if (data.length === 0) {
    return <NoContentComponent name={searchValue ?? "items"} />;
  }

  const defaultContainerClassName = "my-8 overflow-x-auto";
  const defaultTableClassName = "min-w-full divide-y divide-gray-200";
  const defaultTheadClassName = "bg-gray-50";
  const defaultThClassName =
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const defaultTrClassName = (index: number) =>
    index % 2 === 0 ? "bg-white" : "bg-gray-50";
  const defaultTdClassName =
    "px-6 py-4 whitespace-nowrap text-sm text-gray-700";
  const defaultActionTdClassName =
    "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3";

  const containerClassName = disableDefaultStyles
    ? customClassNames.container || ""
    : `${defaultContainerClassName} ${customClassNames.container || ""}`;

  const tableClassName = disableDefaultStyles
    ? customClassNames.table || ""
    : `${defaultTableClassName} ${customClassNames.table || ""}`;

  const theadClassName = disableDefaultStyles
    ? customClassNames.thead || ""
    : `${defaultTheadClassName} ${customClassNames.thead || ""}`;

  const thClassName = disableDefaultStyles
    ? customClassNames.th || ""
    : `${defaultThClassName} ${customClassNames.th || ""}`;

  const trClassName = (index: number) =>
    disableDefaultStyles
      ? customClassNames.tr || ""
      : `${defaultTrClassName(index)} ${customClassNames.tr || ""}`;

  const tdClassName = disableDefaultStyles
    ? customClassNames.td || ""
    : `${defaultTdClassName} ${customClassNames.td || ""}`;

  const actionTdClassName = disableDefaultStyles
    ? customClassNames.actionTd || ""
    : `${defaultActionTdClassName} ${customClassNames.actionTd || ""}`;

  return (
    <div className={containerClassName}>
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 rounded-lg">
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
              {data.map((item, dataIndex) => (
                <tr key={dataIndex} className={trClassName(dataIndex)}>
                  {props.map((prop) => {
                    const value = item[prop as keyof T];
                    let displayValue: React.ReactNode;

                    if (typeof value === "string" && isDateString(value)) {
                      displayValue = formatDate(new Date(value), true);
                    } else if (Array.isArray(value)) {
                      displayValue = (
                        <div className="flex flex-wrap gap-1">
                          {value.map((chip, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-indigo-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                            >
                              {trimText(String(chip), 20)}
                            </span>
                          ))}
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
                            {trimText(value, 30)}
                          </span>
                        </Link>
                      );
                    } else {
                      displayValue = trimText(String(value), 30);
                    }

                    return (
                      <td key={String(prop)} className={tdClassName}>
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
                    />
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TableComponent;
