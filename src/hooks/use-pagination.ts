interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay: number;
}

interface UsePaginationReturn {
  pages: number[];
  showLeftEllipsis: boolean;
  showRightEllipsis: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function usePagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay,
}: UsePaginationProps): UsePaginationReturn {
  const lastPageIndex = totalPages - 1;
  const showLeftEllipsis = currentPage > paginationItemsToDisplay / 2;
  const showRightEllipsis =
    lastPageIndex - currentPage > paginationItemsToDisplay / 2;

  function calculatePaginationRange(): number[] {
    if (totalPages <= paginationItemsToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const halfDisplay = Math.floor(paginationItemsToDisplay / 2);
    const initialRange = {
      start: currentPage - halfDisplay,
      end: currentPage + halfDisplay,
    };

    const adjustedRange = {
      start: Math.max(0, initialRange.start),
      end: Math.min(lastPageIndex, initialRange.end),
    };

    if (adjustedRange.start === 0) {
      adjustedRange.end = paginationItemsToDisplay - 1;
    }
    if (adjustedRange.end === lastPageIndex) {
      adjustedRange.start = totalPages - paginationItemsToDisplay;
    }

    if (showLeftEllipsis) adjustedRange.start++;
    if (showRightEllipsis) adjustedRange.end--;

    return Array.from(
      { length: adjustedRange.end - adjustedRange.start + 1 },
      (_, i) => adjustedRange.start + i,
    );
  }

  const pages = calculatePaginationRange();
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages;

  return {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
    isFirstPage,
    isLastPage,
  };
}
