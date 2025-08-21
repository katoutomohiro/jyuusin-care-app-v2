export function getSelectedUserId(): string | null {
  try { return localStorage.getItem("selectedUserId"); } catch { return null; }
}
export function setSelectedUserId(id: string | null) {
  try {
    if (id) localStorage.setItem("selectedUserId", id);
    else localStorage.removeItem("selectedUserId");
  } catch {}
}
