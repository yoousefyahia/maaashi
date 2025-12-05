export const parseAuthCookie = (cookieValue) => {
  if (!cookieValue) {
    return { token: null, user: null, userId: null, raw: null };
  }

  const isObject = typeof cookieValue === "object";

  const token = isObject ? cookieValue.token : cookieValue;
  const user  = isObject ? cookieValue.user : null;

  const userId = user?.id ?? null;

  return { token, user, userId, raw: cookieValue };
};