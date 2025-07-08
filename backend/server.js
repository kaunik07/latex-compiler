const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Health check
app.get("/", (req, res) => {
  res.send("✅ LaTeX Compiler Backend is running on Railway.");
});

app.post("/compile", (req, res) => {
  const latexCode = req.body.code;

  console.log("🔧 Received compile request");
  console.log("📦 Code snippet (first 100 chars):", latexCode?.substring(0, 100));

  if (!latexCode) {
    console.log("⛔ No LaTeX code provided.");
    return res.status(400).json({ error: "No LaTeX code provided." });
  }

  const tempDir = "/tmp/latex";
  const texPath = path.join(tempDir, "document.tex");
  const pdfPath = path.join(tempDir, "document.pdf");

  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log("📁 Created temp dir");
    }

    fs.writeFileSync(texPath, latexCode);
    console.log("✍️ Wrote .tex file:", texPath);

    exec(
      `pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texPath}`,
      (err, stdout, stderr) => {
        if (err || !fs.existsSync(pdfPath)) {
          console.error("❌ Compilation failed:", stderr || stdout);
          return res.status(500).json({ error: "LaTeX compilation failed." });
        }

        console.log("✅ PDF generated at:", pdfPath);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
        fs.createReadStream(pdfPath).pipe(res);
      }
    );
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
