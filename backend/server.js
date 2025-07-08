const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.post("/compile", (req, res) => {
  const latexCode = req.body.code;
  const tempDir = "/tmp/latex";
  const texPath = path.join(tempDir, "document.tex");
  const pdfPath = path.join(tempDir, "document.pdf");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  fs.writeFileSync(texPath, latexCode);

  exec(`pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texPath}`, (err, stdout, stderr) => {
    if (err || !fs.existsSync(pdfPath)) {
      console.error("Compilation error:", stderr);
      return res.status(500).json({ error: "LaTeX compilation failed" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  });
});

app.listen(PORT, () => {
  console.log(`LaTeX compiler backend running on port ${PORT}`);
});

