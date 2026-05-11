"use client";

import { CheckCircle2, XCircle, Clock, GraduationCap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChildData } from "@/types/attendance";
import { StatCard } from "./Statcard";
import { AttendanceGauge } from "./Attendancegauge";
import { MonthlyBarChart } from "./Monthlybarchart";

interface ChildCardProps {
  child: ChildData;
}

export function ChildCard({ child }: ChildCardProps) {
  const { student, summary, byMonth } = child;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/40 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{student.name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 mt-1">
              <GraduationCap className="h-3.5 w-3.5" />
              {student.course}
            </CardDescription>
          </div>
          <Badge
            variant={summary.attendanceRate >= 90 ? "default" : summary.attendanceRate >= 75 ? "secondary" : "destructive"}
            className="shrink-0"
          >
            {summary.attendanceRate}% asistencia
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            label="Presentes"
            value={summary.totalPresent}
            icon={CheckCircle2}
            color="emerald"
          />
          <StatCard
            label="Ausentes"
            value={summary.totalAbsent}
            icon={XCircle}
            color="rose"
          />
          <StatCard
            label="Tardanzas"
            value={summary.totalLate}
            icon={Clock}
            color="amber"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4 items-center">
          <div className="flex justify-center">
            <AttendanceGauge rate={summary.attendanceRate} />
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Asistencia por mes
            </p>
            <Separator className="mb-3" />
            <MonthlyBarChart data={byMonth} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}