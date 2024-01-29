import { Skeleton } from "primereact/skeleton";

export default function SkeletonProfile() {
  return (
    <>
      <div className="md:col-3 col-12 px-2">
        <Skeleton className="w-full" height="10rem"></Skeleton>
      </div>

      <div className="md:col-9 col-12 px-2">
        <Skeleton className="w-full" height="10rem"></Skeleton>
      </div>
    </>
  );
}
