export default function Loading() {
  return (
    <div className="loader-screen" role="status" aria-live="polite" aria-label="Loading page">
      <div className="loader-grid" aria-hidden="true" />
      <div className="loader-glow" aria-hidden="true" />

      <div className="loader-core">
        <div className="loader-rings" aria-hidden="true">
          <span className="loader-ring loader-ring--outer" />
          <span className="loader-ring loader-ring--mid" />
          <span className="loader-ring loader-ring--inner" />
          <span className="loader-ring loader-ring--dot" />
        </div>

        <p className="loader-title">Mina Mankarious</p>
        <p className="loader-subtitle">Loading page</p>

        <div className="loader-bar" aria-hidden="true">
          <span className="loader-bar__fill" />
        </div>
      </div>
    </div>
  );
}
