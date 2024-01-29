import { Skeleton } from "primereact/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="grid">
      <div className="col-12 md:col-6 xl:col-3">
        <Skeleton className="mb-2 h-10rem"></Skeleton>
      </div>

      <div className="col-12 md:col-6 xl:col-3">
        <Skeleton className="mb-2 h-10rem"></Skeleton>
      </div>
      <div className="col-12 md:col-6 xl:col-3">
        <Skeleton className="mb-2 h-10rem"></Skeleton>
      </div>
      <div className="col-12 md:col-6 xl:col-3">
        <Skeleton className="mb-2 h-10rem"></Skeleton>
      </div>

      <div className="col-12 xl:col-8">
        <Skeleton className="mb-2 h-15rem"></Skeleton>
      </div>

      <div className="col-12 xl:col-4">
        <Skeleton className="mb-2 h-15rem"></Skeleton>
      </div>

      <div className="col-12 xl:col-12">
        <Skeleton className="mb-2 h-15rem"></Skeleton>
      </div>
    </div>
  );
}
