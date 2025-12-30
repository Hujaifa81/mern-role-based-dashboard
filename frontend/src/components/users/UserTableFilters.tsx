import { useState, useEffect, useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";

export interface UserTableFiltersProps {
  onChange: (filters: {
    searchTerm?: string;
    role?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
  }) => void;
  initial?: {
    searchTerm?: string;
    role?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
  };
}

export function UserTableFilters({ onChange, initial }: UserTableFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initial?.searchTerm || "");
  const [role, setRole] = useState(initial?.role ?? "all");
  const [status, setStatus] = useState(initial?.status ?? "all");
  const [sort, setSort] = useState(initial?.sort ?? "-createdAt");
  // CreatedAt range
  const [createdAtRange, setCreatedAtRange] = useState<DateRange>(() => {
    const from = initial?.startDate ? new Date(initial.startDate) : undefined;
    const to = initial?.endDate ? new Date(initial.endDate) : undefined;
    return { from, to };
  });
  const [open, setOpen] = useState(false);

  // Debounce logic: only update URL, don't call onChange
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [, startTransition] = useTransition();
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        const filters: Record<string, string> = {};
        if (searchTerm) filters.searchTerm = searchTerm;
        if (role) filters.role = role;
        if (status) filters.status = status;
        if (sort) filters.sort = sort;
        // CreatedAt range
        if (createdAtRange.from && createdAtRange.to && !isNaN(createdAtRange.from.getTime()) && !isNaN(createdAtRange.to.getTime())) {
          filters.startDate = createdAtRange.from.toISOString().slice(0, 10);
          filters.endDate = createdAtRange.to.toISOString().slice(0, 10);
        }
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          params.set(key, value);
        });
        const newQuery = `?${params.toString()}`;
        if (window.location.search !== newQuery) {
          window.history.replaceState({}, "", newQuery);
        }
      });
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, role, status, sort, createdAtRange]);

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Input
        placeholder="Search name or email"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-48"
      />
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-32">
          <SelectValue>{role === "all" ? "All Roles" : role}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="ADMIN">ADMIN</SelectItem>
          <SelectItem value="USER">USER</SelectItem>
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-32">
          <SelectValue>{status === "all" ? "All Status" : status}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="ACTIVE">ACTIVE</SelectItem>
          <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="w-32">
          <SelectValue>{sort === "-createdAt" ? "Newest" : sort === "createdAt" ? "Oldest" : sort === "name" ? "Name (A-Z)" : sort === "-name" ? "Name (Z-A)" : "Sort"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-createdAt">Newest</SelectItem>
          <SelectItem value="createdAt">Oldest</SelectItem>
          <SelectItem value="name">Name (A-Z)</SelectItem>
          <SelectItem value="-name">Name (Z-A)</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex flex-col gap-1">
        <Label>Joining Date Range</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-56 justify-start text-left font-normal" onClick={() => setOpen(true)}>
              {createdAtRange.from && createdAtRange.to
                ? `${createdAtRange.from.toLocaleDateString()} - ${createdAtRange.to.toLocaleDateString()}`
                : "Select Joining Date at range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={createdAtRange}
              onSelect={setCreatedAtRange}
              numberOfMonths={2}
              required
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
