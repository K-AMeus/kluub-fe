interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

interface Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageableResponse<T> {
  content: T[];
  pageable: Pageable;
  totalElement: number;
  totalPages: number;
  last: boolean;
}

export const formatDate = (dateTime: string): string => {
  if (!dateTime) return "";
  const date = new Date(dateTime);

  const day = date.getDate();
  const formattedDay = day < 10 ? `0${day}` : `${day}`;

  return `${formattedDay} ${date.toLocaleString("default", {
    month: "short",
  })}`;
};
