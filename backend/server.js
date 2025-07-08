const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Enable CORS so frontend can access the backend
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Health check route for GET /
app.get("/", (req, res) => {
  res.send("✅ LaTeX Compiler Backend is running on Render.");
});

// POST /compile - receives LaTeX code and returns compiled PDF
app.post("/compile", (req, res) => {
  const latexCode = req.body.code;
  if (!latexCode) {
    return res.status(400).json({ error: "No LaTeX code provided." });
  }

  const tempDir = "/tmp/latex";
  const texPath = path.join(tempDir, "document.tex");
  const pdfPath = path.join(tempDir, "document.pdf");

  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(texPath, latexCode);

    exec(
      `pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texPath}`,
      (err, stdout, stderr) => {
        if (err || !fs.existsSync(pdfPath)) {
          console.error("LaTeX Error:", stderr);
          return res.status(500).json({ error: "LaTeX compilation failed." });
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=document.pdf");

        const fileStream = fs.createReadStream(pdfPath);
        fileStream.pipe(res);
      }
    );
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ LaTeX compiler running on port ${PORT}`);
});
