export function isAdmin(user: any) {
  return user?.role === "ADMIN";
}

export function canUpload(user: any) {
  return (
    user?.role === "ADMIN" ||
    user?.role === "ANALYST"
  );
}