export interface TableProps<T> {
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
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage?: number;
  totalPages?: number;
}

export interface ActionDropdownProps<T> {
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

export interface TableSkeletonProps {
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

export interface PaginationComponentProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
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
