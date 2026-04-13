export function getSiteUrl() {
  const envSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "";

  let siteUrl = envSiteUrl.trim().replace(/\/$/, "");

  if (siteUrl && !/^https?:\/\//i.test(siteUrl)) {
    siteUrl = `https://${siteUrl}`;
  }

  return siteUrl || "https://www.nap-code.com";
}
