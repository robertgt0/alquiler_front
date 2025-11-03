export default function Skeleton() {
  return (
    <div className="animate-pulse" style={{ display: "grid", gap: 12 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ height: 84, borderRadius: 12, background: "#f3f4f6" }} />
      ))}
    </div>
  );
}
