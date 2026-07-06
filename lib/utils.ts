import { format } from "date-fns";

export function formatDate(date: string): string {
  return format(new Date(date), "yyyy. MM. dd");
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
