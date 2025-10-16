import { getStudentInfo } from "../src/services/studentService";

(async () => {
  try {
    const res = await getStudentInfo("2023347381");
    console.log("FETCH OK:", res);
    process.exit(0);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    process.exit(1);
  }
})();
