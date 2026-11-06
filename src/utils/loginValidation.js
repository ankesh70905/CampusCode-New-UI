const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password, humanConfirmed }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!emailPattern.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) errors.password = "Enter your password.";
  else if (password.length < 8) errors.password = "Use at least 8 characters.";

  if (!humanConfirmed) {
    errors.humanConfirmed = "Please complete the demo human check.";
  }

  return errors;
}
