"use client";
import type React from "react";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { TableSkeletonProps } from "../types";

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  disableDefaultStyles = false,
  customClassNames = {},
  enableDarkMode = true,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    if (enableDarkMode) {
      const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(matchMedia.matches);
      const handleChange = () => {
        setIsDarkMode(matchMedia.matches);
      };
      matchMedia.addEventListener("change", handleChange);
      return () => {
        matchMedia.removeEventListener("change", handleChange);
      };
    }
  }, [enableDarkMode]);
  const baseContainerClassName =
    enableDarkMode && isDarkMode
      ? "bg-gray-900 text-gray-200 border-gray-700"
      : "bg-white text-gray-900 border-gray-200";
  const baseTableClassName =
    enableDarkMode && isDarkMode
      ? "bg-gray-900 text-gray-200 divide-gray-700"
      : "bg-white text-gray-900 divide-gray-300";
  const baseThClassName =
    enableDarkMode && isDarkMode ? "text-gray-300" : "text-gray-900";
  const baseTdClassName =
    enableDarkMode && isDarkMode ? "text-gray-300" : "text-gray-900";
  const baseTrClassName = (index: number) =>
    index % 2 === 0
      ? enableDarkMode && isDarkMode
        ? "bg-gray-800"
        : "bg-white"
      : enableDarkMode && isDarkMode
      ? "bg-gray-700"
      : "bg-gray-50";
  const containerClassName = disableDefaultStyles
    ? customClassNames.container || ""
    : `${baseContainerClassName} px-4 sm:px-6 lg:px-8 ${
        customClassNames.container || ""
      }`;
  const tableClassName = disableDefaultStyles
    ? customClassNames.table || ""
    : `${baseTableClassName} min-w-full divide-y ${
        customClassNames.table || ""
      }`;
  const thClassName = disableDefaultStyles
    ? customClassNames.th || ""
    : `${baseThClassName} py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3 ${
        customClassNames.th || ""
      }`;
  const trClassName = (index: number) =>
    disableDefaultStyles
      ? customClassNames.tr || ""
      : `${baseTrClassName(index)} ${customClassNames.tr || ""}`;
  const tdClassName = disableDefaultStyles
    ? customClassNames.td || ""
    : `${baseTdClassName} whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-3 ${
        customClassNames.td || ""
      }`;
  return (
    <div className={containerClassName}>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className={tableClassName}>
              <thead>
                <tr>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <th
                      key={`${index + 1}-header`}
                      scope="col"
                      className={thClassName}
                    >
                      <Skeleton width={100} />
                    </th>
                  ))}
                  <th scope="col" className={thClassName}>
                    <Skeleton width={50} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={`${index + 1}-row`} className={trClassName(index)}>
                    {Array.from({ length: 4 }).map((_, colIndex) => (
                      <td
                        key={`${index + 1}-${colIndex + 1}-cell`}
                        className={tdClassName}
                      >
                        <Skeleton width={150} />
                      </td>
                    ))}
                    <td className={tdClassName}>
                      <Skeleton width={50} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TableSkeleton;
