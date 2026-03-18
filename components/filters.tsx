// "use client";
// import { DateRange } from "react-day-picker";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useUpdateUrl } from "@/lib/hooks/update-url";
// import { CalendarIcon, RotateCcw, Search } from "lucide-react";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { format } from "date-fns"; // Librería estándar para fechas
// import { es } from "date-fns/locale";
// import { Calendar } from "./ui/calendar";

// // 1. Extendemos el tipo para soportar los nuevos modos
// type FieldType = "select" | "date" | "date-range";

// interface FilterOption {
//   label: string;
//   value: string;
// }

// interface FilterField {
//   id: string;
//   label: string;
//   placeholder?: string;
//   type?: FieldType; // Nuevo: opcional, por defecto "select"
//   options?: FilterOption[]; // Opcional porque date no necesita opciones
// }

// interface DataFiltersProps {
//   searchPlaceholder?: string;
//   fields?: FilterField[];
//   hideSearch?: boolean;
//   prefix?: string;
// }

// // ... (tus imports y tipos se mantienen igual)

// export function Filters({
//   searchPlaceholder = "Buscar...",
//   fields = [],
//   hideSearch = false,
//   prefix = "",
// }: DataFiltersProps) {
//   const { updateFilter, clearPrefixFilters } = useUpdateUrl();
//   const searchParams = useSearchParams();

//   const getFieldKey = (key: string) => (prefix ? `${prefix}_${key}` : key);
//   const searchKey = getFieldKey("search");

//   const getRangeFromParams = (value: string | null): DateRange | undefined => {
//     if (!value) return undefined;
//     const parts = value.split("_to_");

//     const parseLocalDate = (dateStr: string) => {
//       if (!dateStr) return undefined;
//       const [year, month, day] = dateStr.split("-").map(Number);
//       return new Date(year, month - 1, day); // month-1 porque en JS Enero es 0
//     };

//     const from = parseLocalDate(parts[0]);
//     if (!from || isNaN(from.getTime())) return undefined;

//     return {
//       from,
//       to: parts[1] ? parseLocalDate(parts[1]) : undefined,
//     };
//   };

//   const formatToLocalISO = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const [localSearch, setLocalSearch] = useState(
//     searchParams.get(searchKey) || "",
//   );

//   const handleSearch = () => updateFilter(searchKey, localSearch);
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   const hasFilters =
//     fields.some((f) => searchParams.has(getFieldKey(f.id))) ||
//     searchParams.has(searchKey);

//   const handleClear = () => {
//     setLocalSearch("");
//     const fieldIds = fields.map((f) => f.id);
//     clearPrefixFilters(prefix, fieldIds);
//   };

//   return (
//     <div className="flex items-center justify-between bg-white-primary p-6 rounded-primary col-span-full gap-4">

//       {!hideSearch && (
//         <div className="border-gray-200 border rounded-primary flex items-center px-1 flex-1 max-w-sm">
//           <Input
//             placeholder={searchPlaceholder}
//             className="border-none p-2 focus-visible:ring-0"
//             value={localSearch}
//             onChange={(e) => setLocalSearch(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />
//           <Button
//             variant="ghost"
//             className="p-2 hover:bg-transparent"
//             onClick={handleSearch}
//           >
//             <Search size={18} />
//           </Button>
//         </div>
//       )}

//       <div
//         className={`flex items-center gap-3 flex-wrap ${hideSearch ? "ml-auto" : ""}`}
//       >
//         {fields.map((field, index) => {
//           const fieldKey = getFieldKey(field.id);
//           const currentValue = searchParams.get(fieldKey);

//           return (
//             <Badge
//               key={`${field.id}-${index}`}
//               className="flex items-center gap-2 py-1 px-3"
//             >
//               <Label htmlFor={fieldKey} className="mb-0">
//                 {field.label}
//               </Label>

//               {field.type === "date-range" ? (
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="h-auto p-0 bg-transparent border-none"
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {currentValue
//                         ? currentValue.replace("_to_", " al ")
//                         : "Seleccionar rango"}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       initialFocus
//                       mode="range"
//                       defaultMonth={getRangeFromParams(currentValue)?.from}
//                       selected={getRangeFromParams(currentValue)}
//                       onSelect={(range) => {
//                         if (range?.from) {
//                           const fromStr = formatToLocalISO(range.from);
//                           const toStr = range.to
//                             ? formatToLocalISO(range.to)
//                             : "";
//                           updateFilter(
//                             fieldKey,
//                             toStr ? `${fromStr}_to_${toStr}` : fromStr,
//                           );
//                         } else {
//                           updateFilter(fieldKey, "");
//                         }
//                       }}
//                       locale={es}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               ) : (
//                 <Select
//                   value={currentValue || ""}
//                   onValueChange={(v) => updateFilter(fieldKey, v)}
//                 >
//                   <SelectTrigger className="h-auto p-0 bg-transparent border-none focus:ring-0 shadow-none capitalize">
//                     <SelectValue
//                       placeholder={field.placeholder || "Seleccione"}
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {field.options?.map((opt) => (
//                       <SelectItem key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             </Badge>
//           );
//         })}
//         {hasFilters && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleClear}
//             className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 h-8"
//           >
//             <RotateCcw size={14} />
//             Limpiar
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

// export function Filters5({
//   searchPlaceholder = "Buscar...",
//   fields = [],
//   hideSearch = false,
//   prefix = "",
// }: DataFiltersProps) {
//   const { updateFilter, clearPrefixFilters } = useUpdateUrl();
//   const searchParams = useSearchParams();

//   const getFieldKey = (key: string) => (prefix ? `${prefix}_${key}` : key);
//   const searchKey = getFieldKey("search");

//   const [localSearch, setLocalSearch] = useState(
//     searchParams.get(searchKey) || "",
//   );

//   useEffect(() => {
//     setLocalSearch(searchParams.get(searchKey) || "");
//   }, [searchParams, searchKey]);

//   const hasFilters =
//     fields.some((f) => searchParams.has(getFieldKey(f.id))) ||
//     searchParams.has(searchKey);

//   const handleSearch = () => updateFilter(searchKey, localSearch);
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   const handleClear = () => {
//     setLocalSearch("");
//     const fieldIds = fields.map((f) => f.id);
//     clearPrefixFilters(prefix, fieldIds);
//   };

//   // const getRangeFromParams = (key: string) => {
//   //   const val = searchParams.get(key);
//   //   if (!val) return undefined;

//   //   const [from, to] = val.split("_to_");
//   //   return {
//   //     from: from ? new Date(from) : undefined,
//   //     to: to ? new Date(to) : undefined,
//   //   };
//   // };

//   const getRangeFromParams = (value: string | null): DateRange | undefined => {
//     if (!value) return undefined;

//     // Dividimos por el separador
//     const parts = value.split("_to_");
//     const fromDate = new Date(parts[0]);

//     // Validamos que la fecha sea válida antes de pasarla
//     if (isNaN(fromDate.getTime())) return undefined;

//     return {
//       from: fromDate,
//       to: parts[1] ? new Date(parts[1]) : undefined,
//     };
//   };

//   const getFriendlyDateLabel = (value: string | null) => {
//     if (!value) return "Elegir fecha";

//     // Caso: Rango (2024-10-01_to_2024-10-31)
//     if (value.includes("_to_")) {
//       const [from, to] = value.split("_to_");
//       const startDate = new Date(from);
//       const endDate = to ? new Date(to) : null;

//       if (!endDate) return format(startDate, "dd MMM", { locale: es });

//       return `${format(startDate, "dd MMM", { locale: es })} - ${format(endDate, "dd MMM", { locale: es })}`;
//     }

//     // Caso: Fecha única (2024-10-01)
//     try {
//       return format(new Date(value), "dd MMM, yyyy", { locale: es });
//     } catch {
//       return value;
//     }
//   };

//   return (
//     <div className="flex items-center justify-between bg-white-primary p-6 rounded-primary col-span-full gap-4">
//       {!hideSearch && (
//         <div className="border-gray-200 border rounded-primary flex items-center px-1 flex-1 max-w-sm">
//           <Input
//             placeholder={searchPlaceholder}
//             className="border-none p-2 focus-visible:ring-0"
//             value={localSearch}
//             onChange={(e) => setLocalSearch(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />
//           <Button
//             variant="ghost"
//             className="p-2 hover:bg-transparent"
//             onClick={handleSearch}
//           >
//             <Search size={18} />
//           </Button>
//         </div>
//       )}

//       <div
//         className={`flex items-center gap-3 flex-wrap ${hideSearch ? "ml-auto" : ""}`}
//       >
//         {fields.map((field) => {
//           const fieldKey = getFieldKey(field.id);
//           const type = field.type || "select";
//           const currentValue = searchParams.get(fieldKey);

//           return (
//             <Badge
//               key={field.id}
//               className="flex items-center gap-2 py-1 px-3 bg-gray-100 hover:bg-gray-100 text-black border-none font-normal"
//             >
//               <Label className="mb-0 text-gray-500">{field.label}:</Label>
//               {/* 1. CASO: SELECT (Status, Categorías, etc) */}
//               {field.type === "select" && (
//                 <Select
//                   value={currentValue || ""}
//                   onValueChange={(v) => updateFilter(fieldKey, v)}
//                 >
//                   <SelectTrigger className="h-auto p-0 bg-transparent border-none focus:ring-0 shadow-none capitalize">
//                     <SelectValue
//                       placeholder={field.placeholder || "Seleccione"}
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {field.options?.map((opt) => (
//                       <SelectItem key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}

//               {/* 2. CASO: FECHA ÚNICA (Simple Date) */}
//               {field.type === "date" && (
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <button className="flex items-center gap-1 text-sm outline-none">
//                       <span
//                         className={
//                           currentValue ? "font-medium" : "text-gray-400"
//                         }
//                       >
//                         {currentValue
//                           ? getFriendlyDateLabel(currentValue)
//                           : field.placeholder || "Elegir fecha"}
//                       </span>
//                       <CalendarIcon size={14} className="text-gray-400" />
//                     </button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="single"
//                       selected={
//                         currentValue ? new Date(currentValue) : undefined
//                       }
//                       onSelect={(date) => {
//                         if (date)
//                           updateFilter(fieldKey, format(date, "yyyy-MM-dd"));
//                       }}
//                       locale={es}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               )}

//               {/* 3. CASO: RANGO DE FECHAS (Date Range) */}
//               {field.type === "date-range" && (
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <button className="flex items-center gap-1 text-sm outline-none">
//                       <span
//                         className={
//                           currentValue ? "font-medium" : "text-gray-400"
//                         }
//                       >
//                         {currentValue
//                           ? getFriendlyDateLabel(currentValue)
//                           : field.placeholder || "Elegir rango"}
//                       </span>
//                       <CalendarIcon size={14} className="text-gray-400" />
//                     </button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="range"
//                       selected={getRangeFromParams(currentValue)}
//                       onSelect={(range) => {
//                         if (range?.from) {
//                           const fromStr = format(range.from, "yyyy-MM-dd");
//                           const toStr = range.to
//                             ? format(range.to, "yyyy-MM-dd")
//                             : "";
//                           // Actualizamos la URL solo con el 'from' o con ambos
//                           updateFilter(
//                             fieldKey,
//                             toStr ? `${fromStr}_to_${toStr}` : fromStr,
//                           );
//                         }
//                       }}
//                       numberOfMonths={2}
//                       locale={es}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               )}
//             </Badge>
//           );
//         })}

//         {hasFilters && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleClear}
//             className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 h-8"
//           >
//             <RotateCcw size={14} />
//             Limpiar
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

// export function FiltersSkeleton() {
//   return (
//     <div className="px-5 flex items-center justify-between bg-gray-200 animate-pulse h-20 rounded-primary col-span-full gap-4">
//       <div className="bg-gray-300 w-100 h-10 rounded-primary"></div>
//       <div className="flex items-center gap-3">
//         <div className="bg-gray-300 w-35 h-6 rounded-primary"></div>
//         <div className="bg-gray-300 w-40 h-6 rounded-primary"></div>
//         <div className="bg-gray-300 w-25 h-6 rounded-primary"></div>
//       </div>
//     </div>
//   );
// }




"use client";

import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUrl } from "@/lib/hooks/update-url";
import { CalendarIcon, RotateCcw, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";

type FieldType = "select" | "date" | "date-range";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterField {
  id: string;
  label: string;
  placeholder?: string;
  type?: FieldType;
  options?: FilterOption[];
}

interface DataFiltersProps {
  searchPlaceholder?: string;
  fields?: FilterField[];
  hideSearch?: boolean;
  prefix?: string;
}

export function Filters({
  searchPlaceholder = "Buscar...",
  fields = [],
  hideSearch = false,
  prefix = "",
}: DataFiltersProps) {
  const { updateFilter, clearPrefixFilters } = useUpdateUrl();
  const searchParams = useSearchParams();

  // --- HELPERS DE LLAVES Y FORMATO ---
  const getFieldKey = (key: string) => (prefix ? `${prefix}_${key}` : key);
  const searchKey = getFieldKey("search");

  const formatToLocalISO = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return isValid(date) ? date : undefined;
  };

  const getRangeFromParams = (value: string | null): DateRange | undefined => {
    if (!value) return undefined;
    const parts = value.split("_to_");
    const from = parseLocalDate(parts[0]);
    if (!from) return undefined;
    return {
      from,
      to: parts[1] ? parseLocalDate(parts[1]) : undefined,
    };
  };

  const getFriendlyDateLabel = (value: string | null) => {
    if (!value) return null;

    if (value.includes("_to_")) {
      const [fromStr, toStr] = value.split("_to_");
      const from = parseLocalDate(fromStr);
      const to = toStr ? parseLocalDate(toStr) : null;
      if (!from) return "Elegir rango";
      return `${format(from, "dd MMM", { locale: es })} - ${to ? format(to, "dd MMM", { locale: es }) : "..."}`;
    }

    const date = parseLocalDate(value);
    return date ? format(date, "dd MMM, yyyy", { locale: es }) : value;
  };

  // --- ESTADO BÚSQUEDA ---
  const [localSearch, setLocalSearch] = useState(searchParams.get(searchKey) || "");

  useEffect(() => {
    setLocalSearch(searchParams.get(searchKey) || "");
  }, [searchParams, searchKey]);

  const handleSearch = () => updateFilter(searchKey, localSearch);
  
  const hasFilters = fields.some((f) => searchParams.has(getFieldKey(f.id))) || searchParams.has(searchKey);

  const handleClear = () => {
    setLocalSearch("");
    const fieldIds = fields.map((f) => f.id);
    clearPrefixFilters(prefix, fieldIds);
  };

  return (
    <div className="flex items-center justify-between bg-white-primary p-6 rounded-primary col-span-full gap-4">
      {/* INPUT DE BÚSQUEDA */}
      {!hideSearch && (
        <div className="border-gray-200 border rounded-primary flex items-center px-1 flex-1 max-w-sm">
          <Input
            placeholder={searchPlaceholder}
            className="border-none p-2 focus-visible:ring-0"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="ghost" className="p-2 hover:bg-transparent" onClick={handleSearch}>
            <Search size={18} />
          </Button>
        </div>
      )}

      {/* CONTENEDOR DE FILTROS DINÁMICOS */}
      <div className={`flex items-center gap-3 flex-wrap ${hideSearch ? "ml-auto" : ""}`}>
        {fields.map((field, index) => {
          const fieldKey = getFieldKey(field.id);
          const currentValue = searchParams.get(fieldKey);
          const type = field.type || "select";

          return (
            <Badge
              key={`${field.id}-${index}`}
              className="flex items-center gap-2 py-1 px-3 bg-gray-100 hover:bg-gray-100 text-black border-none font-normal"
            >
              <Label className="mb-0 text-gray-500">{field.label}:</Label>

              {/* 1. CASO: SELECT */}
              {type === "select" && (
                <Select
                  value={currentValue || ""}
                  onValueChange={(v) => updateFilter(fieldKey, v)}
                >
                  <SelectTrigger className="h-auto p-0 bg-transparent border-none focus:ring-0 shadow-none capitalize">
                    <SelectValue placeholder={field.placeholder || "Seleccione"} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* 2. CASO: FECHA ÚNICA */}
              {type === "date" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1 text-sm outline-none">
                      <span className={currentValue ? "font-medium" : "text-gray-400"}>
                        {getFriendlyDateLabel(currentValue) || field.placeholder || "Elegir fecha"}
                      </span>
                      <CalendarIcon size={14} className="text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={currentValue ? parseLocalDate(currentValue) : undefined}
                      onSelect={(date) => {
                        if (date) updateFilter(fieldKey, formatToLocalISO(date));
                      }}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}

              {/* 3. CASO: RANGO DE FECHAS */}
              {type === "date-range" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1 text-sm outline-none">
                      <span className={currentValue ? "font-medium" : "text-gray-400"}>
                        {getFriendlyDateLabel(currentValue) || field.placeholder || "Elegir rango"}
                      </span>
                      <CalendarIcon size={14} className="text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={getRangeFromParams(currentValue)}
                      onSelect={(range) => {
                        if (range?.from) {
                          const fromStr = formatToLocalISO(range.from);
                          const toStr = range.to ? formatToLocalISO(range.to) : "";
                          updateFilter(fieldKey, toStr ? `${fromStr}_to_${toStr}` : fromStr);
                        } else {
                          updateFilter(fieldKey, "");
                        }
                      }}
                      numberOfMonths={2}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </Badge>
          );
        })}

        {/* BOTÓN LIMPIAR */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 h-8"
          >
            <RotateCcw size={14} />
            Limpiar
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
  );
}