import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay?: number;
  setCurrentPage: (page: number) => void;
};

export default function SheetDataPagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
  setCurrentPage,
  ...props
}: PaginationProps & ComponentProps<typeof Pagination>) {
  const {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
    isFirstPage,
    isLastPage,
  } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  });
  return (
    <Pagination {...props}>
      <PaginationContent>
        {/* Page number */}
        <PaginationItem>
          <p className="grow text-sm text-muted-foreground" aria-live="polite">
            Page <span className="text-foreground">{currentPage}</span> of{' '}
            <span className="text-foreground">{totalPages}</span>
          </p>
        </PaginationItem>
        {/* First page button */}
        <PaginationItem>
          <PaginationLink
            className={cn(
              'aria-disabled:pointer-events-none aria-disabled:opacity-50',
            )}
            aria-disabled={isFirstPage}
            onClick={() => {
              setCurrentPage(0);
            }}
          >
            <ChevronFirstIcon size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>

        {/* Previous page button */}
        <PaginationItem>
          <PaginationLink
            role="Button"
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled={isFirstPage}
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>

        {/* Left ellipsis (...) */}
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Page number links */}
        {pages.map(pageNumber => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              isActive={pageNumber === currentPage}
              onClick={() => {
                setCurrentPage(pageNumber);
              }}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Right ellipsis (...) */}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next page button */}
        <PaginationItem>
          <PaginationLink
            role="button"
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled={isLastPage}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          >
            <ChevronRightIcon size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>

        {/* Last page button */}
        <PaginationItem>
          <PaginationLink
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled={isLastPage}
            onClick={() => {
              setCurrentPage(totalPages);
            }}
          >
            <ChevronLastIcon size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
