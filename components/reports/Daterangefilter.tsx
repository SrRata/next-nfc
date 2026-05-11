"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, RotateCcw } from "lucide-react";

interface DateRangeFilterProps {
  dateFrom: string;
  dateTo: string;
  onChange: (from: string, to: string) => void;
}

function currentMonthRange() {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return {
    from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
    to: fmt(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

export function DateRangeFilter({ dateFrom, dateTo, onChange }: DateRangeFilterProps) {
  const [from, setFrom] = useState(dateFrom);
  const [to, setTo] = useState(dateTo);

  const apply = () => onChange(from, to);

  const reset = () => {
    const { from: f, to: t } = currentMonthRange();
    setFrom(f);
    setTo(t);
    onChange(f, t);
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Desde</Label>
        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="h-8 text-sm w-36"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Hasta</Label>
        <Input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="h-8 text-sm w-36"
        />
      </div>
      <Button size="sm" onClick={apply} className="h-8">
        Aplicar
      </Button>
      <Button size="sm" variant="ghost" onClick={reset} className="h-8 px-2">
        <RotateCcw className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}