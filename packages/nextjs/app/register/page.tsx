import { redirect } from "next/navigation";

/**
 * Main Registration Page
 *
 * Entry point for registration that immediately redirects users
 * to the role selection step to begin the registration workflow
 */
export default function RegisterPage() {
  redirect("/register/role-selection");
}
