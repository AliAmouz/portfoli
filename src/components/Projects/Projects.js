import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";

// Static project data - replace with your actual projects
const staticProjects = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A modern, responsive portfolio website built with React and Bootstrap, featuring dynamic content and smooth animations.",
    imgPath: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    ghLink: "https://github.com/aliamouz/portfoli-1",
    demoLink: "https://aliamouz.github.io/portfoli-1",
    technologies: ["React", "JavaScript", "Bootstrap", "CSS3"],
    isBlog: false
  },
  {
    id: 2,
    title: "Security Writeups",
    description: "Collection of penetration testing writeups and cybersecurity research from TryHackMe and HackTheBox challenges.",
    imgPath: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    ghLink: "https://github.com/aliamouz/writeups",
    demoLink: null,
    technologies: ["Cybersecurity", "Penetration Testing", "Python", "Bash"],
    isBlog: false
  },
  {
    id: 3,
    title: "Web Application Security Tool",
    description: "A comprehensive web application security testing tool built with Python, featuring automated vulnerability scanning.",
    imgPath: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop",
    ghLink: "https://github.com/aliamouz/security-tool",
    demoLink: null,
    technologies: ["Python", "Security", "Web Testing", "Automation"],
    isBlog: false
  },
  {
    id: 4,
    title: "Network Scanner",
    description: "Advanced network scanning and reconnaissance tool for penetration testing and network security assessment.",
    imgPath: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    ghLink: "https://github.com/aliamouz/network-scanner",
    demoLink: null,
    technologies: ["Python", "Network Security", "Nmap", "Scapy"],
    isBlog: false
  },
  {
    id: 5,
    title: "Cryptography Library",
    description: "A comprehensive cryptography library implementing various encryption algorithms and security protocols.",
    imgPath: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    ghLink: "https://github.com/aliamouz/crypto-lib",
    demoLink: null,
    technologies: ["Python", "Cryptography", "Security", "Algorithms"],
    isBlog: false
  },
  {
    id: 6,
    title: "CTF Solutions",
    description: "Solutions and writeups for various Capture The Flag competitions, demonstrating cybersecurity skills.",
    imgPath: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    ghLink: "https://github.com/aliamouz/ctf-solutions",
    demoLink: null,
    technologies: ["CTF", "Reverse Engineering", "Forensics", "Crypto"],
    isBlog: false
  }
];

function Projects() {
  const [showAll, setShowAll] = useState(false);

  // Show first 6 projects by default, all if showAll is true
  const displayedProjects = showAll ? staticProjects : staticProjects.slice(0, 6);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are some of my projects and contributions.
        </p>

        {/* Project Cards */}
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {displayedProjects.length > 0 ? (
            displayedProjects.map((project) => (
              <Col md={4} className="project-card" key={project.id}>
                <ProjectCard
                  imgPath={project.imgPath}
                  isBlog={project.isBlog}
                  title={project.title}
                  description={project.description}
                  ghLink={project.ghLink}
                  demoLink={project.demoLink}
                  technologies={project.technologies}
                />
              </Col>
            ))
          ) : (
            <Col md={12} style={{ textAlign: "center", padding: "50px" }}>
              <h3 style={{ color: "white" }}>No projects found</h3>
              <p style={{ color: "white", opacity: 0.8 }}>
                Projects will be displayed here when available.
              </p>
            </Col>
          )}
        </Row>

        {/* Show More/Less Button */}
        {staticProjects.length > 6 && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button 
              variant="outline-light" 
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : `Show All ${staticProjects.length} Projects`}
            </Button>
          </div>
        )}
      </Container>
    </Container>
  );
}

export default Projects;
