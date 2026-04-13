export function getSiteUrl() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const vercelEnv = process.env.VERCEL_ENV;
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const previewUrl = process.env.NEXT_PUBLIC_VERCEL_URL || "";

  let siteUrl = envSiteUrl.trim().replace(/\/$/, "");

  if (siteUrl && !/^https?:\/\//i.test(siteUrl)) {
    siteUrl = `https://${siteUrl}`;
  }

  if (siteUrl) {
    return siteUrl;
  }

  if (isDevelopment) {
    return "http://localhost:3000";
  }

  if (vercelEnv === "preview" && previewUrl) {
    return /^https?:\/\//i.test(previewUrl) ? previewUrl : `https://${previewUrl}`;
  }

  return "https://www.nap-code.com";
}
