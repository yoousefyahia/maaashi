// نسخة محسنة من parseAuthCookie
export const parseAuthCookie = (cookieValue) => {
  if (!cookieValue) {
    return { token: null, user: null, userId: null, raw: null };
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

  // 🔥 استخراج الـ User ID من التوكن
  let userId = null;
  if (token) {
    try {
      // إذا كان التوكن يحتوي بيانات اليوزر
      if (user?.id) {
        userId = user.id;
      }
      // إذا كان JWT Token
      else if (typeof token === 'string' && token.split('.').length === 3) {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        userId = decodedPayload.user_id || decodedPayload.id || decodedPayload.sub;
      }
      // إذا كان التوكن بصيغة "token|userId|username"
      else if (typeof token === 'string' && token.includes('|')) {
        const parts = token.split('|');
        userId = parts[1] ? parseInt(parts[1]) : null;
      }
    } catch (error) {
      console.error('Error extracting userId from token:', error);
    }
  }

  return { token, user, userId, raw: cookieValue };
};