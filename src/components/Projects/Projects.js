import React, { useState } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { useProjects } from "../../hooks/useProjects";
import { FaSync, FaGithub, FaClock } from "react-icons/fa";

function Projects() {
  // Use the custom hook to fetch projects automatically from GitHub
  const { projects, loading, error, lastUpdated, refreshProjects } = useProjects();
  const [showAll, setShowAll] = useState(false);

  // Show first 6 projects by default, all if showAll is true
  const displayedProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are some of my projects from GitHub.
          {lastUpdated && (
            <span style={{ fontSize: "12px", opacity: 0.7, display: "block", marginTop: "5px" }}>
              <FaClock /> Last updated: {new Date(lastUpdated).toLocaleString()}
            </span>
          )}
        </p>

        {/* Error Alert */}
        {error && (
          <Alert variant="warning" style={{ marginBottom: "20px" }}>
            <FaGithub /> Failed to fetch projects from GitHub.
            <Button 
              variant="outline-warning" 
              size="sm" 
              onClick={refreshProjects}
              style={{ marginLeft: "10px" }}
            >
              <FaSync /> Retry
            </Button>
          </Alert>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <Spinner animation="border" variant="light" />
            <p style={{ color: "white", marginTop: "10px" }}>
              Fetching projects from GitHub...
            </p>
          </div>
        )}

        {/* Refresh Button */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Button 
            variant="outline-success" 
            onClick={refreshProjects}
            disabled={loading}
            style={{ marginRight: "10px" }}
          >
            <FaSync className={loading ? "fa-spin" : ""} /> 
            {loading ? " Refreshing..." : " Refresh from GitHub"}
          </Button>
          <span style={{ color: "white", marginLeft: "15px" }}>
            Showing {displayedProjects.length} of {projects.length} projects
          </span>
        </div>

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
                />
              </Col>
            ))
          ) : (
            !loading && (
              <Col md={12} style={{ textAlign: "center", padding: "50px" }}>
                <h3 style={{ color: "white" }}>No projects found</h3>
                <p style={{ color: "white", opacity: 0.8 }}>
                  Try refreshing from GitHub or check your repository settings
                </p>
                <Button variant="outline-light" onClick={refreshProjects}>
                  Refresh from GitHub
                </Button>
              </Col>
            )
          )}
        </Row>

        {/* Show More/Less Button */}
        {projects.length > 6 && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button 
              variant="outline-light" 
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : `Show All ${projects.length} Projects`}
            </Button>
          </div>
        )}
      </Container>
    </Container>
  );
}

export default Projects;
