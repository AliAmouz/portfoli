import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { SiTryhackme, SiHackthebox } from "react-icons/si";

function WriteupCard(props) {
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "tryhackme":
        return <SiTryhackme />;
      case "hackthbox":
        return <SiHackthebox />;
      default:
        return <FaEye />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case "tryhackme":
        return "#88cc14"; // TryHackMe green
      case "hackthbox":
        return "#9fef00"; // HackTheBox green
      default:
        return "#007bff"; // Default blue
    }
  };

  return (
    <Card className="writeup-card-view">
      <Card.Img variant="top" src={props.imgPath} alt="card-img" />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "justify" }}>
          {props.description}
        </Card.Text>
        {props.date && (
          <div style={{ marginBottom: "10px", fontSize: "12px", color: "#ccc" }}>
            Completed: {new Date(props.date).toLocaleDateString()}
          </div>
        )}
        <div style={{ marginBottom: "10px" }}>
          <span 
            style={{ 
              backgroundColor: getPlatformColor(props.platform),
              color: "black",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold"
            }}
          >
            {getPlatformIcon(props.platform)} &nbsp;
            {props.platform.toUpperCase()}
          </span>
          {props.difficulty && (
            <span 
              style={{ 
                backgroundColor: props.difficulty === "Easy" ? "#28a745" : 
                              props.difficulty === "Medium" ? "#ffc107" : "#dc3545",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "bold",
                marginLeft: "8px"
              }}
            >
              {props.difficulty}
            </span>
          )}
        </div>
        {props.writeupLink.startsWith('/') ? (
          <Link 
            to={props.writeupLink}
            style={{ 
              backgroundColor: getPlatformColor(props.platform), 
              borderColor: getPlatformColor(props.platform),
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              border: "1px solid",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = getPlatformColor(props.platform) + "dd";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = getPlatformColor(props.platform);
            }}
          >
            <FaEye /> Read Writeup
          </Link>
        ) : (
          <Button 
            variant="primary" 
            href={props.writeupLink} 
            target="_blank"
            style={{ backgroundColor: getPlatformColor(props.platform), borderColor: getPlatformColor(props.platform) }}
          >
            <FaEye /> &nbsp;
            Read Writeup
          </Button>
        )}
        {"\n"}
        {"\n"}

        {/* If the component contains machine link, it will render the below component */}
        {props.machineLink && (
          <Button
            variant="outline-primary"
            href={props.machineLink}
            target="_blank"
            style={{ 
              marginLeft: "10px",
              borderColor: getPlatformColor(props.platform),
              color: getPlatformColor(props.platform)
            }}
          >
            {getPlatformIcon(props.platform)} &nbsp;
            Machine Link
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default WriteupCard;
