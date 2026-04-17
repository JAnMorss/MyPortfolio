import { useState, useMemo } from "react";

export function usePagination<T>(data: T[], pageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const nextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));

  const prevPage = () =>
    setCurrentPage((p) => Math.max(p - 1, 1));
  const goToPage = (page: number) => setCurrentPage(page);
  const reset = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
    reset,
  };
}

export function useServerPagination<T>(
  fetchFunction: (page: number, pageSize: number, search?: string, sortBy?: string) => Promise<{ items: T[]; totalCount: number; page: number; pageSize: number }>,
  pageSize: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page: number = 1, search: string = "", sortBy?: string) => {
    setLoading(true);
    try {
      const result = await fetchFunction(page, pageSize, search, sortBy);
      setData(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(Math.ceil(result.totalCount / pageSize));
      setCurrentPage(result.page);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, search: string = "", sortBy?: string) => {
    setCurrentPage(page);
    fetchData(page, search, sortBy);
  };

  const handleNext = (search: string = "", sortBy?: string) => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1, search, sortBy);
    }
  };

  const handlePrev = (search: string = "", sortBy?: string) => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1, search, sortBy);
    }
  };

  return {
    data,
    currentPage,
    totalPages,
    totalCount,
    loading,
    fetchData,
    handlePageChange,
    handleNext,
    handlePrev,
  };
}