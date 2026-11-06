const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "Not entered" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 1, label: "Getting started" };
  if (score <= 3) return { score: 2, label: "Good" };
  return { score: 3, label: "Strong" };
}

export function validateRegistration({
  fullName,
  email,
  accountType,
  password,
  confirmPassword,
  humanConfirmed,
  ageConfirmed,
  termsAccepted,
}) {
  const errors = {};

  if (!fullName.trim()) errors.fullName = "Enter your full name.";
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (!emailPattern.test(email.trim())) errors.email = "Enter a valid email address.";

  if (!accountType) errors.accountType = "Choose an account type.";
  if (!password) errors.password = "Create a password.";
  else if (password.length < 8) errors.password = "Use at least 8 characters.";

  if (!confirmPassword) errors.confirmPassword = "Enter your password again.";
  else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";

  if (!humanConfirmed) errors.humanConfirmed = "Complete the demo check to continue.";
  if (!ageConfirmed) errors.ageConfirmed = "Please confirm the age requirement.";
  if (!termsAccepted) errors.termsAccepted = "Please acknowledge the demo terms.";

  return errors;
}
