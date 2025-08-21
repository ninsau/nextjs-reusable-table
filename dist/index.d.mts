import * as react_jsx_runtime from 'react/jsx-runtime';
import React$1 from 'react';

interface TableProps<T> {
    columns: string[];
    data: T[];
    props: ReadonlyArray<keyof T>;
    actions?: boolean;
    actionTexts?: string[];
    loading?: boolean;
    actionFunctions?: Array<(item: T) => void>;
    searchValue?: string;
    disableDefaultStyles?: boolean;
    customClassNames?: {
        container?: string;
        table?: string;
        thead?: string;
        tbody?: string;
        th?: string;
        tr?: string;
        td?: string;
        actionTd?: string;
        actionButton?: string;
        actionSvg?: string;
        dropdownMenu?: string;
        dropdownItem?: string;
        pagination?: {
            container?: string;
            button?: string;
            buttonDisabled?: string;
            pageInfo?: string;
        };
    };
    renderRow?: (item: T, index: number) => React.ReactNode;
    rowOnClick?: (item: T) => void;
    enableDarkMode?: boolean;
    enablePagination?: boolean;
    page?: number;
    setPage?: (page: number) => void;
    itemsPerPage?: number;
    totalPages?: number;
    sortableProps?: Array<keyof T>;
    formatValue?: (value: string, prop: string, item: T) => React.ReactNode;
    formatHeader?: (header: string, prop: string, index: number) => React.ReactNode;
    noContentProps?: {
        text?: string;
        icon?: React.ReactNode;
        name?: string;
    };
    showRemoveColumns?: boolean;
    onSort?: (prop: keyof T) => void;
}
interface ActionDropdownProps<T> {
    item: T;
    index: number;
    actionTexts: string[];
    actionFunctions: Array<(item: T) => void>;
    disableDefaultStyles?: boolean;
    customClassNames?: {
        actionTd?: string;
        actionButton?: string;
        actionSvg?: string;
        dropdownMenu?: string;
        dropdownItem?: string;
    };
    enableDarkMode?: boolean;
}
interface TableSkeletonProps {
    disableDefaultStyles?: boolean;
    customClassNames?: {
        container?: string;
        table?: string;
        th?: string;
        tr?: string;
        td?: string;
    };
    enableDarkMode?: boolean;
}
interface PaginationComponentProps {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    disableDefaultStyles?: boolean;
    customClassNames?: {
        container?: string;
        button?: string;
        buttonDisabled?: string;
        pageInfo?: string;
    };
    enableDarkMode?: boolean;
}
interface NoContentProps {
    text?: string;
    icon?: React.ReactNode;
    name?: string;
}

declare const ActionDropdown: <T>({ item, actionTexts, actionFunctions, disableDefaultStyles, customClassNames, enableDarkMode, }: ActionDropdownProps<T> & {
    enableDarkMode?: boolean;
}) => react_jsx_runtime.JSX.Element;

declare const NoContentComponent: React$1.FC<NoContentProps>;

declare function TableComponent<T>({ columns, data, props, actions, actionTexts, loading, actionFunctions, searchValue, disableDefaultStyles, customClassNames, renderRow, rowOnClick, enableDarkMode, enablePagination, page, setPage, itemsPerPage, totalPages, sortableProps, formatValue, noContentProps, showRemoveColumns, onSort, formatHeader, }: TableProps<T>): react_jsx_runtime.JSX.Element;

declare const TableSkeleton: React$1.FC<TableSkeletonProps>;

export { ActionDropdown, type ActionDropdownProps, NoContentComponent, type NoContentProps, type PaginationComponentProps, TableComponent, type TableProps, TableSkeleton, type TableSkeletonProps };
