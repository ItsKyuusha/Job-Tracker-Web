import type { MaganghubListing } from "@/types/database";

export type MaganghubListItem = Pick<
  MaganghubListing,
  | "id"
  | "title"
  | "company_name"
  | "location"
  | "allowance"
  | "work_days"
  | "source_url"
  | "curriculum"
  | "quota"
  | "total_applicants"
  | "created_at"
>;

export type MaganghubFilters = {
  search?: string;
  location?: string;
  sort?: "created_at" | "company_name" | "allowance";
  order?: "asc" | "desc";
};
