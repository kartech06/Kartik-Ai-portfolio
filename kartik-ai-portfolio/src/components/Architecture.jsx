export default function Architecture() {
  const principles = [
    {
      title: "Scalability",
      text: "Design systems that handle growth through distributed services and horizontal scaling.",
    },
    {
      title: "Resilience",
      text: "Implement fault tolerance, retries and monitoring to ensure reliability in production.",
    },
    {
      title: "Observability",
      text: "Use logging, metrics and tracing to understand system behaviour in real time.",
    },
    {
      title: "Automation",
      text: "Reduce manual effort by building automated pipelines and intelligent workflows.",
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <h2>Architecture Thinking</h2>

        <div className="architecture-grid">
          {principles.map((item, i) => (
            <div key={i} className="architecture-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}