import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TabNavigationState } from "../collections/utils";

interface TabNavigationHeaderProps {
  state: TabNavigationState;
  onPageChange: (newPage: number) => void;
  textLabel: string;
}

export const TabNavigationHeader = ({
  state,
  onPageChange,
  textLabel,
}: TabNavigationHeaderProps) => {
  return (
    <div className="max-w-[756px] w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-5">
      <div className="flex items-center">
        <div className="text-lg font-semibold mr-2.5">{textLabel}</div>
        {state.totalItems > 0 && (
          <div className="flex">
            <Button
              className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white"
              disabled={state.isFirstPage}
              onClick={() => onPageChange(state.currentPage - 1)}
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </Button>
            <Button
              className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50"
              disabled={state.isLastPage}
              onClick={() => onPageChange(state.currentPage + 1)}
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface TabNavigationFooterProps {
  state: TabNavigationState;
  onPageChange: (newPage: number) => void;
  textLabel: string;
}

export const TabNavigationFooter = ({
  state,
  onPageChange,
  textLabel,
}: TabNavigationFooterProps) => {
  return (
    <div className="flex items-center justify-between border border-gray-200 border-l-0 border-r-0 border-b-0 mt-3 p-3">
      <div className="text-sm text-gray-500 mr-2.5">{textLabel}</div>
      <div className="flex items-center gap-2">
        <Button
          className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
          disabled={state.isFirstPage}
          onClick={() => onPageChange(state.currentPage - 1)}
        >
          <ChevronLeft />
          Prev
        </Button>
        <Button
          className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
          disabled={state.isLastPage}
          onClick={() => onPageChange(state.currentPage + 1)}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
