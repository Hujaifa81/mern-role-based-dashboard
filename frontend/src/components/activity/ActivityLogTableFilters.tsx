import { useState, useEffect, useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";

export interface ActivityLogTableFiltersProps {
  initial?: {
    searchTerm?: string;
    activityType?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
  };
}

export function ActivityLogTableFilters({ initial }: ActivityLogTableFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initial?.searchTerm || "");
  const [activityType, setActivityType] = useState(initial?.activityType ?? "ALL");
  const [sort, setSort] = useState(initial?.sort ?? "-createdAt");
  function parseLocalDate(str?: string) {
    if (!str) return undefined;
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  // Only set from initial on first render, never re-initialize from props or URL
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const from = initial?.startDate ? new Date(initial.startDate) : undefined;
    const to = initial?.endDate ? new Date(initial.endDate) : undefined;
    return { from, to };
  });
  const [open, setOpen] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [, startTransition] = useTransition();
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        // Write the actual selected end date to the URL (no +1 day here)
        let startDate: string | undefined = undefined;
        let endDate: string | undefined = undefined;
        if (dateRange.from && !isNaN(dateRange.from.getTime())) {
          startDate = dateRange.from.toISOString().slice(0, 10);
        }
        if (dateRange.to && !isNaN(dateRange.to.getTime())) {
          endDate = dateRange.to.toISOString().slice(0, 10);
        }
        // If only one date is selected, use it for both startDate and endDate
        if (startDate && !endDate) {
          endDate = startDate;
        }
        const filters: Record<string, string | undefined> = {
          searchTerm: searchTerm || "",
          activityType: activityType || "ALL",
          sort: sort || "-createdAt",
          startDate,
          endDate,
        };
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, value);
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
  }, [searchTerm, activityType, sort, dateRange]);

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Input
        placeholder="Search description"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-48"
      />
      <Select value={activityType} onValueChange={setActivityType}>
        <SelectTrigger className="w-48">
          <SelectValue>{activityType && activityType !== "ALL" ? activityType.replace(/_/g, " ") : "All Activity Types"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Activity Types</SelectItem>
          <SelectItem value="USER_LOGIN">User Login</SelectItem>
          <SelectItem value="USER_LOGOUT">User Logout</SelectItem>
          <SelectItem value="PASSWORD_CHANGED">Password Changed</SelectItem>
          <SelectItem value="PASSWORD_RESET">Password Reset</SelectItem>
          <SelectItem value="EMAIL_VERIFIED">Email Verified</SelectItem>
          <SelectItem value="PROFILE_UPDATED">Profile Updated</SelectItem>
          <SelectItem value="USER_CREATED">User Created</SelectItem>
          <SelectItem value="USER_UPDATED">User Updated</SelectItem>
          <SelectItem value="USER_SUSPENDED">User Suspended</SelectItem>
          <SelectItem value="USER_ACTIVATED">User Activated</SelectItem>
          <SelectItem value="ROLE_CHANGED">Role Changed</SelectItem>
          <SelectItem value="ACCOUNT_DELETED">Account Deleted</SelectItem>
          <SelectItem value="FAILED_LOGIN_ATTEMPT">Failed Login Attempt</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="w-32">
          <SelectValue>{sort === "-createdAt" ? "Newest" : sort === "createdAt" ? "Oldest" : sort === "activityType" ? "Type (A-Z)" : sort === "-activityType" ? "Type (Z-A)" : "Sort"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-createdAt">Newest</SelectItem>
          <SelectItem value="createdAt">Oldest</SelectItem>
          <SelectItem value="activityType">Type (A-Z)</SelectItem>
          <SelectItem value="-activityType">Type (Z-A)</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex flex-col gap-1">
        <Label>Date Range</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-56 justify-start text-left font-normal" onClick={() => setOpen(true)}>
              {dateRange.from && dateRange.to
                ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                : "Select date range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              required
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
