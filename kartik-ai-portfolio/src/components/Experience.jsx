export default function Experience() {
  const timeline = [
    {
      year: "2022 — Present",
      role: "Software Engineer",
      company: "Nagarro",
      description:
        "Working on scalable backend systems, automation platforms and distributed microservices.",
    },
    {
      year: "Key Work",
      role: "Backend Development",
      company: "Node.js / Microservices",
      description:
        "Designed APIs, event-driven architectures and monitoring systems for production environments.",
    },
    {
      year: "Focus",
      role: "AI & Automation",
      company: "LLM Integrations",
      description:
        "Building AI-powered workflows, automation pipelines and intelligent backend services.",
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <h2>Experience</h2>

        <div className="timeline">
          {timeline.map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />

              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <h3>
                  {item.role} • {item.company}
                </h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}