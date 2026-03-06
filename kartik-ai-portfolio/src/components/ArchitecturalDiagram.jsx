export default function ArchitectureDiagram() {
  return (
    <div className="architecture-diagram">

      <div className="node">User</div>

      <div className="arrow">→</div>

      <div className="node">API Gateway</div>

      <div className="arrow">→</div>

      <div className="node">Microservices</div>

      <div className="arrow">→</div>

      <div className="node">Message Queue</div>

      <div className="arrow">→</div>

      <div className="node">Workers</div>

      <div className="arrow">→</div>

      <div className="node">Database</div>

    </div>
  );
}