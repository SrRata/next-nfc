"use client";

import { Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdminProfesorResponse } from "@/types/attendance";
import { StatCard } from "./Statcard";
import { AttendanceGauge } from "./Attendancegauge";
import { MonthlyBarChart } from "./Monthlybarchart";

interface AdminProfesorPanelProps {
  data: AdminProfesorResponse;
}

export function AdminProfesorPanel({ data }: AdminProfesorPanelProps) {
  const { summary, byMonth, course } = data;

  return (
    <div className="space-y-6">
      {course && (
        <p className="text-sm text-muted-foreground font-medium">
          Curso:{" "}
          <span className="text-foreground font-semibold">{course.name}</span>
        </p>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summary.totalStudents !== undefined && (
          <StatCard
            label="Total alumnos"
            value={summary.totalStudents}
            icon={Users}
            color="sky"
          />
        )}
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

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Gauge */}
        <Card className="flex items-center justify-center py-6">
          <AttendanceGauge rate={summary.attendanceRate} />
        </Card>

        {/* Bar chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Asistencia por mes</CardTitle>
            <CardDescription>Presentes y tardanzas en el período</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <MonthlyBarChart data={byMonth} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}