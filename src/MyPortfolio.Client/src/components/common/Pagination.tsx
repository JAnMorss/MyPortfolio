import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrev,
}: Props) {
  if (totalPages === 0) return null;

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={onPrev}
      >
        Previous
      </Button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size="sm"
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={onNext}
      >
        Next
      </Button>
    </div>
  );
}