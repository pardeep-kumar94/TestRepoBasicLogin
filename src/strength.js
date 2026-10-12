// Password strength for the Sign up meter (from the prototype): one point each for
// length ≥ 8, a letter and a number, length ≥ 12, and a symbol or mixed case.
export const strengthLabels = ['Too weak', 'Weak', 'Okay', 'Strong', 'Great'];

export function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/\p{L}/u.test(password) && /\d/.test(password)) score++;
  if (password.length >= 12) score++;
  if (/[^\p{L}\d]/u.test(password) || (/\p{Ll}/u.test(password) && /\p{Lu}/u.test(password))) score++;
  return score;
}
