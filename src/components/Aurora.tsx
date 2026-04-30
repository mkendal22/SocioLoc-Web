export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div className={`aurora ${className}`} aria-hidden>
      <span className="orb orb-3" />
    </div>
  );
}
