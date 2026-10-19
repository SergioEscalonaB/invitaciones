export function getSiteUrl(): string {
  const configured = process.env.DOMINIO?.trim();
  if (!configured) return "http://localhost:3000";
  const withProtocol = /^https?:\/\//i.test(configured) ? configured : `https://${configured}`;
  return withProtocol.replace(/\/$/, "");
}

export function getInvitationUrl(token: string): string {
  return `${getSiteUrl()}/invitacion/${encodeURIComponent(token)}`;
}
