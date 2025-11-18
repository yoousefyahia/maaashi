export const parseAuthCookie = (cookieValue) => {
  if (!cookieValue) {
    return { token: null, user: null, raw: null };
  }

  const isObject = typeof cookieValue === "object";
  const dataLayer = isObject ? cookieValue.data ?? cookieValue : null;

  const token =
    (isObject ? cookieValue.token : cookieValue) ??
    dataLayer?.token ??
    null;

  const user =
    cookieValue?.user ??
    dataLayer?.user ??
    null;

  return { token, user, raw: cookieValue };
};

