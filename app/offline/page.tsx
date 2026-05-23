export default function OfflinePage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--background)" }}
    >
      <div className="text-center">
        <div className="text-6xl mb-4">🌙</div>
        <h1
          className="text-3xl mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
        >
          You&#39;re offline
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Luna needs a connection to sync your cycle data.
          <br />
          Please check your internet connection and try again.
        </p>
      </div>
    </main>
  );
}
