import { useState } from "react";
import ArchitectureDiagram from "./ArchitecturalDiagram"

export default function SystemDesign() {
  const [active, setActive] = useState(null);

  const systems = [
    {
      title: "Scalable Microservices Platform",
      description:
        "Node.js microservices communicating through event-driven architecture using message queues.",
      details: [
        "API Gateway handles incoming requests",
        "Auth Service validates tokens",
        "Service communication via message broker",
        "MongoDB for persistence",
        "Monitoring using logs and metrics",
      ],
    },
    {
      title: "AI Email Intelligence Agent",
      description:
        "AI pipeline that processes incoming emails and generates intelligent summaries.",
      details: [
        "Email ingestion pipeline",
        "Processing with Node.js workers",
        "LLM summarization",
        "Caching layer using Redis",
        "Webhook delivery system",
      ],
    },
    {
      title: "High Performance Backend API",
      description:
        "Backend optimized for high throughput and scalability.",
      details: [
        "Load balancer distributes traffic",
        "Stateless Node.js services",
        "Database indexing strategy",
        "Horizontal scaling",
        "Observability and monitoring",
      ],
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <h2>System Design</h2>

        <div className="system-grid">
          {systems.map((system, i) => (
            <div
              key={i}
              className={`system-card ${active === i ? "active" : ""}`}
              onClick={() => setActive(active === i ? null : i)}
            >
              <h3>{system.title}</h3>
              <p>{system.description}</p>

              {active === i && (
                <div className="system-details">
                    <ArchitectureDiagram />
                  <ul>
                    {system.details.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}