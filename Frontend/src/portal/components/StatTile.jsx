export function StatTile({ label, value, accent }) {
  return (
    <div className="portal-stat-card">
      <div className="portal-stat-card__label">{label}</div>
      <div className={"portal-stat-card__value" + (accent ? " portal-stat-card__value--accent" : "")}>
        {value}
      </div>
    </div>
  );
}
