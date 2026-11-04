# CampusCode interaction map

This map describes the implemented frontend preview. It does not imply a connected backend.

## Landing page

| Control | Behavior |
|---|---|
| CampusCode brand | Opens the landing page. |
| About, How it works, Hackathons, Community | Scroll to the corresponding section. On mobile, selecting a section also closes the menu. |
| Mobile menu button | Opens or closes the section menu. Clicking outside or pressing Escape closes it; Escape returns focus to the toggle. |
| Account preview | Opens the registration form preview. |
| Login | Opens the sign-in form preview. |
| See the preview | Scrolls to the animated preview. |
| Page reading progress | Updates as the visitor scrolls; it is informational, not a navigation control. |
| Play/Pause preview | Toggles the original CSS illustration. It returns to the paused state when scrolled out of view. |
| Challenge theme rows and workflow cards | Informational content; they are not links or buttons. The challenge themes are illustrative, not live events. |
| Footer links | Navigate to page sections, open the registration/sign-in forms, or use the supplied email contact link. |
| Theme toggle | Switches between light and dark themes. The choice is saved as `campuscode-theme` in local storage and reused on the public routes. |

## Sign-in preview (`/login/`)

| Control | Behavior |
|---|---|
| Email and password fields | Accept input and validate required values and email format. |
| Show/Hide password | Toggles password visibility and updates its accessible state. |
| New CAPTCHA | Generates a new local challenge and clears the answer field. |
| Check sign-in form | Checks the email, password, and CAPTCHA. Valid input displays an explicit message that no authentication service is connected and that credentials were not sent. |
| Forgot password? | Replaces the sign-in form with the inline reset form. |
| Check reset form | Validates the email and CAPTCHA, then explains that no email service is connected and no reset email was sent. |
| Back to Login | Reloads the sign-in route and restores its initial form. |
| Registration link | Opens `/register/`. |

## Registration preview (`/register/`)

| Control | Behavior |
|---|---|
| Name, email, password, confirmation | Accept input and validate required values, email format, and matching passwords. |
| Account type | Disabled Student-only field. |
| Age confirmation | Required checkbox. |
| Show/Hide password | Independently toggles each password field. |
| New CAPTCHA | Generates a new local challenge and clears the answer field. |
| Check registration form | Checks the required values, age confirmation, and CAPTCHA. Valid input explains that registration is unavailable and that the information was not sent. |
| Sign-in link | Opens `/login/`. |

## Scope and limitations

- The forms are client-side demonstrations only. There is no sign-in, account creation, verification email, password-reset service, or personal-data submission.
- The CAPTCHA is a local interaction aid, not a security control or server-side verification mechanism.
- There is no authenticated dashboard, live hackathon catalog, backend activity, notification center, search, charts, or admin route in the available project.
