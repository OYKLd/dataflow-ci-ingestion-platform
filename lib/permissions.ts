export function isAdmin(user: any) {
  return user?.role === "ADMIN";
}

export function isAnalyst(user: any) {
  return user?.role === "ANALYST";
}

export function canUpload(user: any) {
  return (
    user?.role === "ADMIN" ||
    user?.role === "ANALYST"
  );
}

export function canCreateSource(user: any) {
  return user?.role === "ADMIN";
}

export function canDeleteSource(user: any) {
  return user?.role === "ADMIN";
}

export function canCreateSchema(user: any) {
  return user?.role === "ADMIN" || user?.role === "ANALYST";
}

export function canUpdateSource(user: any) {
  return user?.role === "ADMIN";
}

export function canViewAudit(user: any) {
  return user?.role === "ADMIN" || user?.role === "ANALYST" || user?.role === "VIEWER";
}

export function canViewDashboard(user: any) {
  return user?.role === "ADMIN" || user?.role === "ANALYST" || user?.role === "VIEWER";
}