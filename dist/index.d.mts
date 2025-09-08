import * as react_jsx_runtime from 'react/jsx-runtime';
import React$1 from 'react';

/**
 * Props for the main TableComponent with comprehensive customization options
 * @template T - The data type for table rows
 */
interface TableProps<T> {
    /** Array of column header names */
    columns: string[];
    /** Array of data objects to display */
    data: T[];
    /** Array of object property keys to display as columns */
    props: ReadonlyArray<keyof T>;
    /** Enable action dropdown menus for each row */
    actions?: boolean;
    /** Labels for dropdown actions */
    actionTexts?: string[];
    /** Show loading skeleton */
    loading?: boolean;
    /** Handler functions for dropdown actions */
    actionFunctions?: Array<(item: T) => void>;
    /** Filter rows by search term */
    searchValue?: string;
    /** Disable all default styling */
    disableDefaultStyles?: boolean;
    /** Comprehensive styling customization */
    customClassNames?: {
        container?: string;
        table?: string;
        thead?: string;
        tbody?: string;
        th?: string;
        tr?: string;
        td?: string;
        scrollContainer?: string;
        loadingContainer?: string;
        loadingSkeleton?: {
            container?: string;
            skeletonBar?: string;
            skeletonItem?: string;
        };
        cellExpansion?: {
            container?: string;
        };
        interactive?: {
            sortableCursor?: string;
            clickableCursor?: string;
            focusOutline?: string;
        };
        actionTd?: string;
        actionButton?: string;
        actionSvg?: string;
        actionDropdown?: {
            container?: string;
            menu?: string;
            item?: string;
            overlay?: string;
        };
        dropdownMenu?: string;
        dropdownItem?: string;
        pagination?: {
            container?: string;
            button?: string;
            buttonDisabled?: string;
            pageInfo?: string;
            navigation?: {
                first?: string;
                previous?: string;
                next?: string;
                last?: string;
            };
        };
        layout?: {
            tableMargin?: string;
            tablePadding?: string;
            containerPadding?: string;
        };
        responsive?: {
            mobile?: string;
            tablet?: string;
            desktop?: string;
        };
        theme?: {
            colorScheme?: string;
            spacing?: string;
            typography?: string;
            borderRadius?: string;
            shadows?: string;
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
    renderPagination?: (props: {
        page: number;
        setPage: (page: number) => void;
        totalPages: number;
        calculatedTotalPages: number;
        itemsPerPage: number;
    }) => React.ReactNode;
    /** Maximum height of the table container */
    maxHeight?: string | number;
    /** Inline style overrides for elements */
    customStyles?: {
        container?: React.CSSProperties;
        table?: React.CSSProperties;
        scrollContainer?: React.CSSProperties;
        loading?: React.CSSProperties;
    };
    /** Scroll behavior for the table container */
    scrollBehavior?: 'auto' | 'scroll' | 'visible' | 'hidden';
    /** CSS table-layout property */
    tableLayout?: 'auto' | 'fixed' | 'inherit';
    /** Cell expansion behavior configuration */
    cellExpansion?: {
        /** Enable/disable cell expansion */
        enabled?: boolean;
        /** Maximum width for expanded cells */
        maxWidth?: string | number;
        /** Expansion behavior: truncate, wrap, or expand */
        behavior?: 'truncate' | 'wrap' | 'expand';
    };
    /** Accessibility configuration */
    accessibility?: {
        /** Custom focus styles */
        focusStyles?: string;
        /** Screen reader labels */
        screenReaderLabels?: {
            actions?: string;
            pagination?: string;
            loading?: string;
        };
        /** Enable keyboard navigation */
        keyboardNavigation?: boolean;
    };
}
/**
 * Props for the ActionDropdown component
 * @template T - The data type for the table row
 */
interface ActionDropdownProps<T> {
    /** The data item for this row */
    item: T;
    /** The index of this row */
    index: number;
    /** Array of action labels */
    actionTexts: string[];
    /** Array of action handler functions */
    actionFunctions: Array<(item: T) => void>;
    /** Disable default styling */
    disableDefaultStyles?: boolean;
    /** Custom CSS class names */
    customClassNames?: {
        actionTd?: string;
        actionButton?: string;
        actionSvg?: string;
        actionDropdown?: {
            container?: string;
            menu?: string;
            item?: string;
            overlay?: string;
        };
        dropdownMenu?: string;
        dropdownItem?: string;
    };
    /** Enable dark mode */
    enableDarkMode?: boolean;
}
/**
 * Props for the TableSkeleton component
 */
interface TableSkeletonProps {
    /** Disable default styling */
    disableDefaultStyles?: boolean;
    /** Custom CSS class names */
    customClassNames?: {
        container?: string;
        table?: string;
        th?: string;
        tr?: string;
        td?: string;
    };
    /** Enable dark mode */
    enableDarkMode?: boolean;
}
/**
 * Props for the PaginationComponent
 */
interface PaginationComponentProps {
    /** Current page number */
    page: number;
    /** Function to change page */
    setPage: (page: number) => void;
    /** Total number of pages */
    totalPages: number;
    /** Disable default styling */
    disableDefaultStyles?: boolean;
    /** Custom CSS class names */
    customClassNames?: {
        container?: string;
        button?: string;
        buttonDisabled?: string;
        pageInfo?: string;
        navigation?: {
            first?: string;
            previous?: string;
            next?: string;
            last?: string;
        };
    };
    /** Enable dark mode */
    enableDarkMode?: boolean;
}
/**
 * Props for the NoContent component
 */
interface NoContentProps {
    /** Text to display when no content is available */
    text?: string;
    /** Custom icon to display */
    icon?: React.ReactNode;
    /** Accessibility name */
    name?: string;
}

/**
 * Action dropdown component for table row actions with customizable positioning and styling
 *
 * @template T - The data type for the table row
 */
declare const ActionDropdown: <T>({ item, actionTexts, actionFunctions, disableDefaultStyles, customClassNames, enableDarkMode, }: ActionDropdownProps<T> & {
    enableDarkMode?: boolean;
}) => react_jsx_runtime.JSX.Element;

/**
 * Component displayed when no data is available
 */
declare const NoContentComponent: React$1.FC<NoContentProps>;

/**
 * A highly customizable, headless table component for React/Next.js applications.
 *
 * @template T - The data type for table rows
 * @param props - Configuration object for the table component
 * @returns A fully functional table with sorting, pagination, search, and customization options
 */
declare function TableComponent<T>({ columns, data, props, actions, actionTexts, loading, actionFunctions, searchValue, disableDefaultStyles, customClassNames, renderRow, rowOnClick, enableDarkMode, enablePagination, page, setPage, itemsPerPage, totalPages, sortableProps, formatValue, noContentProps, showRemoveColumns, onSort, formatHeader, renderPagination, maxHeight, customStyles, scrollBehavior, tableLayout, cellExpansion, accessibility, }: TableProps<T>): react_jsx_runtime.JSX.Element;

/**
 * Loading skeleton component that displays a placeholder table structure
 */
declare const TableSkeleton: React$1.FC<TableSkeletonProps>;

export { ActionDropdown, type ActionDropdownProps, NoContentComponent, type NoContentProps, type PaginationComponentProps, TableComponent, type TableProps, TableSkeleton, type TableSkeletonProps };
