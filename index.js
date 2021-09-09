const PdfDocument = require("./pdfDocument");

const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/api/pdf" && req.method === "GET") {
    createPDF(res);
  } else {
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello world");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const createPDF = async (res) => {
  try {
    const result = await PdfDocument.createPDF(
      "pdfeditable.pdf",
      "corazon.png"
    );
    document = result;
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", String(Buffer.byteLength(document)));
    const pdfBuffer = Buffer.from(document.buffer, "binary");
    document
      ? res.end(pdfBuffer)
      : res.json({ error: 1, message: message.emptyMessage });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end({ error: 1, message: message.errorMessage });
  }
};
