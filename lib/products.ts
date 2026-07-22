import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PRODUCTS_DIR = path.join(process.cwd(), "content", "products");

export interface Product {
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string; // "KRW" | "USD" ...
  image: string;
  category: string;
  vendor: string;
  soldOut: boolean;
  relatedArticle?: string; // 연계 아티클 slug
  featured: boolean;
  content: string;
}

/** 0원 소수 통화 (원/엔 등) — Stripe unit_amount 계산에 사용 */
export const ZERO_DECIMAL = new Set(["KRW", "JPY", "VND"]);

export function formatPrice(price: number, currency = "KRW") {
  if (currency === "KRW") return `₩${price.toLocaleString("ko-KR")}`;
  if (currency === "USD") return `$${price.toLocaleString("en-US")}`;
  return `${price.toLocaleString()} ${currency}`;
}

function readFiles() {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];
  return fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".mdx"));
}

export function getProducts(): Product[] {
  return readFiles()
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(PRODUCTS_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        price: Number(data.price ?? 0),
        currency: data.currency ?? "KRW",
        image: data.image ?? "",
        category: data.category ?? "Goods",
        vendor: data.vendor ?? "TEAL+DOT",
        soldOut: data.soldOut ?? false,
        relatedArticle: data.relatedArticle,
        featured: data.featured ?? false,
        content,
      };
    })
    .filter((p) => !p.soldOut || true) // soldOut도 목록엔 노출(품절 표기)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getFeaturedProducts(limit = 3): Product[] {
  const featured = getProducts().filter((p) => p.featured);
  return (featured.length ? featured : getProducts()).slice(0, limit);
}

export function getProductsForArticle(articleSlug: string): Product[] {
  return getProducts().filter((p) => p.relatedArticle === articleSlug);
}
