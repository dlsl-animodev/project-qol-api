/**
 * Formats student name based on email pattern
 * Example: firstname_lastname@dlsl.edu.ph -> Firstname Lastname
 * @param email - The student email address
 * @returns Formatted student name
 */
export function formatStudentName(email: string | undefined): string {
  if (!email) return "Unknown";

  // 1. Extract the part before @
  const namePart = email.split("@")[0];

  // 2. Split by underscore
  const nameWords = namePart.split("_");

  // 3. Capitalize first letter, lowercase the rest
  const formattedName = nameWords
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  return formattedName;
}
