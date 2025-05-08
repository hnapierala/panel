import { redirect } from "next/navigation"

export default function HomePage() {
  // Przekieruj z głównej strony do strony logowania
  redirect("/logowanie")
}
