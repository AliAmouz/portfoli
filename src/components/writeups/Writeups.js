import React, { useState, useMemo } from "react";
import { Container, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap";
import WriteupCard from "./WriteupCard";
import Particle from "../Particle";
import { useWriteups } from "../../hooks/useWriteups";
import { FaSync, FaGithub, FaClock } from "react-icons/fa";

function Writeups() {
  // Use the custom hook to fetch writeups automatically
  const { writeups, loading, error, lastUpdated, refreshWriteups } = useWriteups();

  // Filter states
  const [platformFilter, setPlatformFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered writeups
  const filteredWriteups = useMemo(() => {
    return writeups.filter(writeup => {
      // Platform filter
      if (platformFilter !== "All" && writeup.platform !== platformFilter) {
        return false;
      }

      // Difficulty filter
      if (difficultyFilter !== "All" && writeup.difficulty !== difficultyFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== "All") {
        const writeupDate = new Date(writeup.date);
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const ninetyDaysAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        const sixMonthsAgo = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));

        switch (dateFilter) {
          case "Last 30 days":
            if (writeupDate < thirtyDaysAgo) return false;
            break;
          case "Last 90 days":
            if (writeupDate < ninetyDaysAgo) return false;
            break;
          case "Last 6 months":
            if (writeupDate < sixMonthsAgo) return false;
            break;
          default:
            break;
        }
      }

      // Search term filter
      if (searchTerm && !writeup.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !writeup.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [platformFilter, difficultyFilter, dateFilter, searchTerm]);

  // Clear all filters
  const clearFilters = () => {
    setPlatformFilter("All");
    setDifficultyFilter("All");
    setDateFilter("All");
    setSearchTerm("");
  };

  return (
    <Container fluid className="writeup-section">
      <Particle />
      <Container>
        <h1 className="writeup-heading">
          My <strong className="purple">CTF Writeups</strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are some of the machines I've completed on TryHackMe and HackTheBox platforms.
          {lastUpdated && (
            <span style={{ fontSize: "12px", opacity: 0.7, display: "block", marginTop: "5px" }}>
              <FaClock /> Last updated: {new Date(lastUpdated).toLocaleString()}
            </span>
          )}
        </p>

        {/* Error Alert */}
        {error && (
          <Alert variant="warning" style={{ marginBottom: "20px" }}>
            <FaGithub /> Failed to fetch latest writeups from GitHub. Showing cached content.
            <Button 
              variant="outline-warning" 
              size="sm" 
              onClick={refreshWriteups}
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
              Fetching latest writeups from GitHub...
            </p>
          </div>
        )}

        {/* Filter Controls */}
        <div className="filter-section" style={{ 
          backgroundColor: "rgba(255, 255, 255, 0.1)", 
          padding: "20px", 
          borderRadius: "10px", 
          marginBottom: "30px",
          backdropFilter: "blur(10px)"
        }}>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "white", fontWeight: "bold" }}>Platform</Form.Label>
                <Form.Select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                >
                  <option value="All">All Platforms</option>
                  <option value="TryHackMe">TryHackMe</option>
                  <option value="HackTheBox">HackTheBox</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "white", fontWeight: "bold" }}>Difficulty</Form.Label>
                <Form.Select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "white", fontWeight: "bold" }}>Date Range</Form.Label>
                <Form.Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                >
                  <option value="All">All Time</option>
                  <option value="Last 30 days">Last 30 days</option>
                  <option value="Last 90 days">Last 90 days</option>
                  <option value="Last 6 months">Last 6 months</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "white", fontWeight: "bold" }}>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search writeups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row style={{ marginTop: "15px" }}>
            <Col>
              <Button 
                variant="outline-light" 
                onClick={clearFilters}
                size="sm"
                style={{ marginRight: "10px" }}
              >
                Clear All Filters
              </Button>
              <Button 
                variant="outline-success" 
                onClick={refreshWriteups}
                size="sm"
                disabled={loading}
                style={{ marginRight: "10px" }}
              >
                <FaSync className={loading ? "fa-spin" : ""} /> 
                {loading ? " Refreshing..." : " Refresh from GitHub"}
              </Button>
              <span style={{ color: "white", marginLeft: "15px" }}>
                Showing {filteredWriteups.length} of {writeups.length} writeups
              </span>
            </Col>
          </Row>
        </div>

        {/* Writeup Cards */}
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {filteredWriteups.length > 0 ? (
            filteredWriteups.map((writeup) => (
              <Col md={4} className="writeup-card" key={writeup.id}>
                                 <WriteupCard
                   imgPath={writeup.imgPath}
                   platform={writeup.platform}
                   title={writeup.title}
                   description={writeup.description}
                   difficulty={writeup.difficulty}
                   writeupLink={writeup.writeupLink}
                   machineLink={writeup.machineLink}
                   date={writeup.date}
                 />
              </Col>
            ))
          ) : (
            <Col md={12} style={{ textAlign: "center", padding: "50px" }}>
              <h3 style={{ color: "white" }}>No writeups found matching your filters</h3>
              <p style={{ color: "white", opacity: 0.8 }}>
                Try adjusting your search criteria or clearing the filters
              </p>
              <Button variant="outline-light" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Col>
          )}
        </Row>
      </Container>
    </Container>
  );
}

export default Writeups;
