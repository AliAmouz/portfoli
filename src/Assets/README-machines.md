# Machines Data Management

## How to Add New Machines

To add a new machine to your writeups section, simply edit the `machines.json` file in this directory. You don't need to touch any React code!

### JSON Structure

Each machine should follow this structure:

```json
{
  "id": "machine-name",
  "imgPath": "machine-name.png",
  "platform": "TryHackMe" | "HackTheBox",
  "title": "Machine Title",
  "description": "Brief description of the machine and what it covers",
  "difficulty": "Easy" | "Medium" | "Hard",
  "writeupLink": "/writeup/machine-name",
  "machineLink": "https://tryhackme.com/room/machine-name",
  "date": "YYYY-MM-DD"
}
```

### Example Entry

```json
{
  "id": "blue",
  "imgPath": "blue.png",
  "platform": "TryHackMe",
  "title": "Blue",
  "description": "A Windows machine focused on EternalBlue vulnerability exploitation.",
  "difficulty": "Easy",
  "writeupLink": "/writeup/blue",
  "machineLink": "https://tryhackme.com/room/blue",
  "date": "2024-01-15"
}
```

### Steps to Add a New Machine

1. **Add to machines.json**: Add a new entry to the `machines` array in `machines.json`
2. **Add machine image** (optional): Place the machine image in `src/Assets/Writeups/` directory
3. **Add writeup content**: Add the writeup content to `WriteupViewer.js` in the `writeupsData` object
4. **Update GitHub** (optional): If using GitHub integration, add the markdown file to your GitHub repository

### Field Descriptions

- **id**: Unique identifier (usually lowercase machine name)
- **imgPath**: Image filename (currently uses default image for all)
- **platform**: Either "TryHackMe" or "HackTheBox"
- **title**: Display name of the machine
- **description**: Brief description of what the machine covers
- **difficulty**: "Easy", "Medium", or "Hard"
- **writeupLink**: Internal route to the writeup page
- **machineLink**: External link to the actual machine
- **date**: Completion date in YYYY-MM-DD format

### Notes

- The system automatically assigns numeric IDs for React rendering
- All machines currently use the default image (`bedrock.png`)
- To use custom images, you'll need to modify the `Writeups.js` file to import and use specific images
- The writeup content is still stored in `WriteupViewer.js` - consider moving this to separate markdown files for better maintainability
