export type ScraperSource = "linkedin" | "jobstreet" | "glints" | "threads";

export type ScraperCategory = "portals" | "social";

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "freelance"
  | "internship"
  | "unknown";

export type WorkplaceType = "onsite" | "remote" | "hybrid" | "unknown";

export interface ScrapedJob {
  id: string;
  source: ScraperSource;
  title: string;
  company: string;
  location: string | null;
  description: string | null;
  employment_type: EmploymentType;
  workplace_type: WorkplaceType;
  salary_raw: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  source_url: string;
  posted_at: string | null;
  scraped_at: string;
}

export interface ScrapeSuccessResponse {
  success: true;
  source: ScraperSource | "multi";
  query: {
    keyword: string;
    location?: string;
    page?: number;
    limit?: number;
  };
  total: number;
  results: ScrapedJob[];
  scraped_at: string;
  duration_ms: number;
}
