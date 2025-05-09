import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">OZE System</h1>
          <nav>
            <Link href="/kontakt" className="text-gray-700 hover:text-gray-900 mr-4">
              Kontakt
            </Link>
            <Button asChild className="bg-amber-400 hover:bg-amber-500 text-black">
              <Link href="/logowanie">Zaloguj się</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Kompleksowy system do wycen instalacji fotowoltaicznych
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                OZE System to nowoczesne narzędzie dla instalatorów i sprzedawców fotowoltaiki, które usprawnia proces
                wyceny i sprzedaży instalacji fotowoltaicznych.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-500 text-black">
                  <Link href="/logowanie">Zaloguj się</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/kontakt">Dowiedz się więcej</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img src="/house-with-solar-panels.png" alt="Instalacja fotowoltaiczna" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">OZE System</h3>
              <p className="text-gray-600">
                Kompleksowe rozwiązanie do wycen instalacji fotowoltaicznych dla profesjonalistów.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Kontakt</h3>
              <p className="text-gray-600">
                Email:{" "}
                <a href="mailto:kontakt@oze-system.tech" className="text-blue-600 hover:underline">
                  kontakt@oze-system.tech
                </a>
                <br />
                Telefon:{" "}
                <a href="tel:+48123456789" className="text-blue-600 hover:underline">
                  +48 123 456 789
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Linki</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/logowanie" className="text-blue-600 hover:underline">
                    Logowanie
                  </Link>
                </li>
                <li>
                  <Link href="/kontakt" className="text-blue-600 hover:underline">
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-center">
              &copy; {new Date().getFullYear()} OZE System. Wszelkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
