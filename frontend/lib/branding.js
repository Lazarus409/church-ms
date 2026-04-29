"use client";

export const BRANDING_EVENT = "church-branding-updated";
export const DEFAULT_BRANDING = {
  brandName: "ChurchMS",
  logoMark: "C",
  primaryColor: "#b5862a",
  accentColor: "#3b82f6",
  tagline: "Built to help churches grow",
};

export function normalizeBranding(input = {}) {
  return {
    brandName: input.brandName?.trim() || DEFAULT_BRANDING.brandName,
    logoMark: input.logoMark?.trim() || DEFAULT_BRANDING.logoMark,
    primaryColor: input.primaryColor || DEFAULT_BRANDING.primaryColor,
    accentColor: input.accentColor || DEFAULT_BRANDING.accentColor,
    tagline: input.tagline?.trim() || DEFAULT_BRANDING.tagline,
  };
}

export function brandingStorageKey(churchId) {
  return `church-branding:${churchId}`;
}

export function loadBranding(churchId, fallback = {}) {
  const base = normalizeBranding({
    ...DEFAULT_BRANDING,
    ...fallback,
  });

  if (typeof window === "undefined" || !churchId) {
    return base;
  }

  const stored = localStorage.getItem(brandingStorageKey(churchId));
  if (!stored) {
    return base;
  }

  try {
    return normalizeBranding({
      ...base,
      ...JSON.parse(stored),
    });
  } catch {
    return base;
  }
}

export function saveBranding(churchId, branding) {
  const normalized = normalizeBranding(branding);
  if (typeof window !== "undefined" && churchId) {
    localStorage.setItem(
      brandingStorageKey(churchId),
      JSON.stringify(normalized),
    );
    localStorage.setItem("church-branding:active", JSON.stringify(normalized));
  }
  return normalized;
}

export function getActiveBranding() {
  if (typeof window === "undefined") {
    return DEFAULT_BRANDING;
  }

  const stored = localStorage.getItem("church-branding:active");
  if (!stored) {
    return DEFAULT_BRANDING;
  }

  try {
    return normalizeBranding(JSON.parse(stored));
  } catch {
    return DEFAULT_BRANDING;
  }
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length === 3) {
    const [r, g, b] = normalized.split("");
    return {
      r: Number.parseInt(`${r}${r}`, 16),
      g: Number.parseInt(`${g}${g}`, 16),
      b: Number.parseInt(`${b}${b}`, 16),
    };
  }

  if (normalized.length === 6) {
    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16),
    };
  }

  return null;
}

function toRgba(color, alpha) {
  if (!color || !color.startsWith("#")) {
    return color;
  }

  const rgb = hexToRgb(color);
  if (!rgb) {
    return color;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function applyBranding(branding) {
  const normalized = normalizeBranding(branding);

  if (typeof window === "undefined") {
    return normalized;
  }

  const root = document.documentElement;
  root.style.setProperty("--gold", normalized.primaryColor);
  root.style.setProperty("--gold-light", normalized.accentColor);
  root.style.setProperty("--gold-bg", toRgba(normalized.primaryColor, 0.08));
  root.style.setProperty(
    "--gold-border",
    toRgba(normalized.primaryColor, 0.22),
  );
  root.style.setProperty("--accent-light", normalized.accentColor);
  root.style.setProperty("--church-brand-name", normalized.brandName);
  root.style.setProperty("--church-brand-mark", normalized.logoMark);
  root.style.setProperty("--church-tagline", normalized.tagline);
  root.dataset.churchBrandName = normalized.brandName;
  root.dataset.churchBrandMark = normalized.logoMark;
  document.title = `${normalized.brandName} | ChurchMS`;

  return normalized;
}

export function emitBrandingUpdate(branding) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(BRANDING_EVENT, {
      detail: normalizeBranding(branding),
    }),
  );
}
