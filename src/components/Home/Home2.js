import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
              I am a <b className="purple">cybersecurity enthusiast</b> and{" "}
              <b className="purple">software engineer</b> with a strong drive to
              build and secure modern technologies. My journey began with a
              curiosity for programming and hacking, which grew into a passion
              for creating software while understanding how to break and protect
              it. 🔐
              <br />
              <br />
              I work fluently with{" "}
              <b className="purple">Python, C, Java, Rust, and JavaScript</b>,
              and I enjoy applying these skills to both{" "}
              <b className="purple">full-stack web development</b> and{" "}
              <b className="purple">penetration testing</b>.
              <br />
              <br />
              My experience spans from building scalable applications with{" "}
              <b className="purple">React.js, Express.js, and Node.js</b> to
              exploring advanced topics in{" "}
              <b className="purple">
                network security, exploit development, and system-level
                programming
              </b>
              .
              <br />
              <br />
              What sets me apart is my dual perspective: I don’t just develop
              applications — I also analyze how they can be attacked, and more
              importantly, how they can be secured. This allows me to contribute
              as both a <b className="purple">problem solver</b> and a{" "}
              <b className="purple">protector</b> in any tech team.
              <br />
              <br />
              I’m currently focused on sharpening my skills through{" "}
              <b className="purple">Hack The Box</b>, contributing to{" "}
              <b className="purple">open-source security tools</b>, and
              continuously growing my{" "}
              <b className="purple">software engineering fundamentals</b>.
              <br />
              <br />
              I bring curiosity, persistence, and a hands-on mindset to every
              challenge, whether it’s debugging a web app, reverse engineering a
              system, or collaborating on innovative projects. 🚀
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/aliamouz"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://twitter.com/aliamouz"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                >
                  <AiOutlineTwitter />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/ali-amouz/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.instagram.com/aliamouz"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                >
                  <AiFillInstagram />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
