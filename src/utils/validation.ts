/**
 * Validates if a student object has a valid email address
 */
export function isValidStudent(object: { email_address?: string }): boolean {
  if (!object) return false;

  const email = object.email_address;
  if (!email) return false;

  if (email.length === 0) return false;

  return true;
}
