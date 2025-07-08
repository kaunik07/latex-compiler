app.use(express.json({ limit: "2mb" }));

app.post("/compile", (req, res) => {
  const latexCode = req.body.code;
  if (!latexCode) {
    return res.status(400).json({ error: "No LaTeX code provided." });
  }

  const fs = require("fs");
  const { exec } = require("child_process");
  const path = require("path");
  const tempDir = "/tmp/latex";
  const texPath = path.join(tempDir, "document.tex");
  const pdfPath = path.join(tempDir, "document.pdf");

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  fs.writeFileSync(texPath, latexCode);

  exec(`pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texPath}`, (err, stdout, stderr) => {
    if (err || !fs.existsSync(pdfPath)) {
      console.error("LaTeX compile error:", stderr);
      return res.status(500).json({ error: "LaTeX compilation failed." });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
    fs.createReadStream(pdfPath).pipe(res);
  });
});
