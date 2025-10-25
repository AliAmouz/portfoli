import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiPostman,
  SiSlack,
  SiVercel,
  SiMacos,
  SiUbuntu,
  SiWindows,
  SiDocker,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { FaShieldAlt, FaLock, FaBug, FaNetworkWired, FaTerminal } from "react-icons/fa";

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {/* Operating Systems */}
      <Col xs={4} md={2} className="tech-icons">
        <FaShieldAlt />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiUbuntu />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiWindows />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiMacos />
      </Col>
      
      {/* Development Tools */}
      <Col xs={4} md={2} className="tech-icons">
        <SiVisualstudiocode />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <FaTerminal />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiGit />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiGithub />
      </Col>
      
      {/* Security Tools */}
      <Col xs={4} md={2} className="tech-icons">
        <FaShieldAlt />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <FaLock />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <FaBug />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <FaNetworkWired />
      </Col>
      
      {/* API & Testing */}
      <Col xs={4} md={2} className="tech-icons">
        <SiPostman />
      </Col>
      
      {/* DevOps */}
      <Col xs={4} md={2} className="tech-icons">
        <SiDocker />
      </Col>
      
      {/* Communication */}
      <Col xs={4} md={2} className="tech-icons">
        <SiSlack />
      </Col>
      
      {/* Deployment */}
      <Col xs={4} md={2} className="tech-icons">
        <SiVercel />
      </Col>
    </Row>
  );
}

export default Toolstack;
