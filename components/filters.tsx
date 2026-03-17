"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUrl } from "@/lib/hooks/update-url";
import { RotateCcw, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterField {
  id: string;
  label: string;
  placeholder?: string;
  options: FilterOption[];
}

interface DataFiltersProps {
  searchPlaceholder?: string;
  fields?: FilterField[];
}

export function Filters({ 
  searchPlaceholder = "Buscar...", 
  fields = [] 
}: DataFiltersProps) {
  const { updateFilter, clearFilters } = useUpdateUrl();
  const searchParams = useSearchParams();

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="flex items-center justify-between bg-white-primary p-6 rounded-primary col-span-full gap-4">
      
      <div className="border-gray-200 border rounded-primary flex items-center px-1 flex-1 max-w-sm">
        <Input 
          placeholder={searchPlaceholder} 
          className="border-none p-2 focus-visible:ring-0"
          value={searchParams.get("search") || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
        <Button variant="ghost" className="p-2 hover:bg-transparent">
          <Search size={18} />
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {fields.map((field) => (
          <Badge key={field.id} className="flex items-center gap-2 py-1 px-3">
            <Label htmlFor={field.id} className="mb-0">{field.label}</Label>
            <Select 
              value={searchParams.get(field.id) || ""} 
              onValueChange={(v) => updateFilter(field.id, v)}
            >
              <SelectTrigger id={field.id} className="h-auto p-0 bg-transparent border-none focus:ring-0 capitalize">
                <SelectValue placeholder={field.placeholder || "Seleccione"} />
              </SelectTrigger>
              <SelectContent position="popper">
                {field.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="capitalize">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Badge>
        ))}

        {hasFilters && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={clearFilters}
            className="text-red-primary bg-transparent hover:bg-red-100 gap-2"
          >
            <RotateCcw size={14} />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}



export function FiltersSkeleton() {
  return (
    <div className="px-5 flex items-center justify-between bg-gray-200 animate-pulse h-20 rounded-primary col-span-full gap-4">
      <div className="bg-gray-300 w-100 h-10 rounded-primary"></div>
      <div className="flex items-center gap-3">
        <div className="bg-gray-300 w-35 h-6 rounded-primary"></div>
        <div className="bg-gray-300 w-40 h-6 rounded-primary"></div>
        <div className="bg-gray-300 w-25 h-6 rounded-primary"></div>
      </div>
    </div>
  )
}