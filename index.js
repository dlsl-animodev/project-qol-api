import cors from "cors";
import express from "express";
import https from "https";
import dotenv from "dotenv";

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
        "Content-Type": "application/json",
      },
      body: new URLSearchParams({
        action: "registration_tapregister",
        regkey: regKey,
        studentid: id,
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
  res.send("go to /api/student?id=YOUR_ID_HERE to get student info");
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
