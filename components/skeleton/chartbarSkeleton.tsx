import { Skeleton } from "primereact/skeleton";
import React from "react";

export default function ChartBarSkeleton() {
  return (
    <div className="flex justify-content-center">
      <Skeleton height="21rem" className="justify-content-between">
        <div className="flex h-full justify-content-between align-items-end">
          <Skeleton width="2rem" height="20rem"></Skeleton>
          <Skeleton width="2rem" height="20rem"></Skeleton>
          <Skeleton width="2rem" height="20rem"></Skeleton>
          <Skeleton width="2rem" height="20rem"></Skeleton>
          <Skeleton width="2rem" height="20rem"></Skeleton>
          <Skeleton width="2rem" height="20rem"></Skeleton>
          <Skeleton width="2rem" height="20rem"></Skeleton>
        </div>
      </Skeleton>
    </div>
  );
}
