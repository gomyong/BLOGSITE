import { NextResponse } from "next/server";
import { getProductBySlug, ZERO_DECIMAL } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Stripe Checkout 세션 생성 (게스트 결제, 실물 상품 배송지 수집).
 * SDK 없이 Stripe REST API를 form-encoded로 호출한다.
 * 필요 환경변수: STRIPE_SECRET_KEY  (미설정 시 503)
 */
export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "결제가 아직 설정되지 않았습니다. STRIPE_SECRET_KEY를 등록하세요." },
      { status: 503 }
    );
  }

  let slug: unknown;
  let quantity = 1;
  try {
    const body = await request.json();
    slug = body.slug;
    quantity = Math.min(10, Math.max(1, Number(body.quantity) || 1));
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const product = typeof slug === "string" ? getProductBySlug(slug) : undefined;
  if (!product) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });
  }
  if (product.soldOut) {
    return NextResponse.json({ error: "품절된 상품입니다." }, { status: 409 });
  }

  const currency = product.currency.toLowerCase();
  const unitAmount = ZERO_DECIMAL.has(product.currency)
    ? product.price
    : Math.round(product.price * 100);

  // 배송 대상 국가 (해외→국내 포함). 필요 시 확장.
  const shippingCountries = ["KR", "US", "JP", "GB", "DE", "FR", "CA", "AU", "SG"];

  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("success_url", `${siteConfig.url}/shop/success?session_id={CHECKOUT_SESSION_ID}`);
  form.set("cancel_url", `${siteConfig.url}/shop/${product.slug}`);
  form.set("line_items[0][quantity]", String(quantity));
  form.set("line_items[0][price_data][currency]", currency);
  form.set("line_items[0][price_data][unit_amount]", String(unitAmount));
  form.set("line_items[0][price_data][product_data][name]", product.title);
  if (product.image) {
    form.set(
      "line_items[0][price_data][product_data][images][0]",
      `${siteConfig.url}${product.image}`
    );
  }
  // 실물 상품 — 배송지 수집
  shippingCountries.forEach((c, i) =>
    form.set(`shipping_address_collection[allowed_countries][${i}]`, c)
  );
  form.set("phone_number_collection[enabled]", "true");
  // 주문 추적용 메타데이터
  form.set("metadata[slug]", product.slug);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.error?.message ?? "결제 세션 생성 실패" },
      { status: 502 }
    );
  }
  return NextResponse.json({ url: data.url });
}
