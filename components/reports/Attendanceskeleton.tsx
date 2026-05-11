"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AttendanceSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-14" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="flex items-center justify-center py-6">
          <Skeleton className="h-40 w-40 rounded-full" />
        </Card>
        <Card className="lg:col-span-2 p-6">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-[220px] w-full rounded-xl" />
        </Card>
      </div>
    </div>
  );
}