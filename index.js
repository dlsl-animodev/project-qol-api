import cors from "cors";
import express from "express";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function isValid(object) {
  if (!object) return false;

  const email = object.email_address;
  if (!email) return false;

  if (email.length === 0) return false;

  return true;
}

async function getStudentInfo(id) {
  const api = "https://portal.dlsl.edu.ph/registration/event/helper.php";

  const regKey = process.env.REG_KEY;
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });

    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        action: "registration_tapregister",
        regkey: regKey,
        card_tag: id,
      }),
      agent: agent,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching student info:", error);
    throw error;
  }
}

app.get("/api/student", async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    const student = await getStudentInfo(id);

    if (isValid(student)) {
      student.card_tag_uid = id;
      return res.json(student);
    } else {
      return res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    console.error("Error in /api/student:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DLSL Student API</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary-green: #00834d;
          --light-gray: #f4f7f6;
          --dark-text: #2c3e50;
          --light-text: #5a7184;
        }

        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: var(--light-gray);
          color: var(--dark-text);
        }

        .container {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          padding: 30px;
          max-width: 600px;
          width: 90%;
          text-align: center;
          border-top: 4px solid var(--primary-green);
        }

        h1 {
          font-size: 2rem;
          color: var(--primary-green);
          margin-bottom: 10px;
        }

        .subtitle {
          font-size: 1rem;
          color: var(--light-text);
          margin-bottom: 20px;
        }

        .api-info {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 6px;
          text-align: left;
          margin-top: 20px;
          border-left: 4px solid var(--primary-green);
        }

        code {
          background-color: #e1e8ed;
          border-radius: 4px;
          padding: 2px 5px;
          font-family: 'Courier New', monospace;
        }

        a {
          text-decoration: none;
          color: var(--primary-green);
          font-weight: 600;
        }

        a:hover {
          text-decoration: underline;
        }

        .footer {
          margin-top: 25px;
          font-size: 0.9rem;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>DLSL Student API</h1>
        <p class="subtitle">Retrieve student information quickly and easily.</p>

        <div class="api-info">
          <p><strong>Endpoint:</strong> <code>/api/student</code></p>
          <p><strong>Usage:</strong> Add <code>?id=STUDENT_ID</code> to query.</p>
        </div>

        <div class="api-info">
          <p><strong>Example:</strong> <a href="/api/student?id=2023347381" target="_blank">/api/student?id=2023347381</a></p>
        </div>

        <p class="footer">Server is running and ready to accept requests.</p>
      </div>
    </body>
    </html>
  `);
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
