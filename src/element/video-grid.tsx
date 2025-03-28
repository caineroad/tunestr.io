import { ReactNode, Children } from "react";

export default function VideoGrid({ children }: { children: ReactNode }) {
  const childCount = Children.count(children);

  const columnClasses = {
    1: "grid-cols-1",
    2: "sm:grid-cols-1 md:grid-cols-2",
    3: "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
    6: "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
  };

  const gridColumns = columnClasses[childCount] ||
    "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7";

  return (
    <div className={`grid gap-5 items-start ${gridColumns}`}>
      {children}
    </div>
  );
}
