import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Lewa kolumna - dane kontaktowe */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do strony głównej
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Kontakt</h1>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-medium text-gray-800 mb-3">Dane kontaktowe</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong className="text-gray-700">Email:</strong>{" "}
                  <a href="mailto:kontakt@oze-system.tech" className="text-blue-600 hover:underline">
                    kontakt@oze-system.tech
                  </a>
                </p>
                <p>
                  <strong className="text-gray-700">Telefon:</strong>{" "}
                  <a href="tel:+48123456789" className="text-blue-600 hover:underline">
                    +48 123 456 789
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium text-gray-800 mb-3">Adres</h2>
              <address className="not-italic text-gray-600">
                OZE System Sp. z o.o.
                <br />
                ul. Przykładowa 123
                <br />
                00-000 Warszawa
                <br />
                Polska
              </address>
            </div>

            <div>
              <h2 className="text-xl font-medium text-gray-800 mb-3">Godziny pracy</h2>
              <p className="text-gray-600">
                Poniedziałek - Piątek: 8:00 - 16:00
                <br />
                Sobota - Niedziela: Zamknięte
              </p>
            </div>

            <div>
              <Button asChild className="bg-amber-400 hover:bg-amber-500 text-black">
                <Link href="/logowanie">Zaloguj się do systemu</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Prawa kolumna - informacje o systemie */}
      <div className="hidden lg:block w-1/2 border-l">
        <div className="h-full flex flex-col justify-center px-16">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Czym jest OZE System?</h2>

            <div className="text-gray-600">
              <p className="mb-4">
                OZE System jest aplikacją webową, służącą do przygotowywania kompletnych wycen dla Twojego klienta.
                Składa się z formularza z danymi rejestracyjnymi Twojego Klienta, danymi dotyczącymi zużycia energii
                elektrycznej, komponentami elektrowni słonecznej oraz proponowanymi formami sfinansowania jej zakupu.
              </p>

              <p className="mb-4">
                Gdy wpiszesz wymagane informacje, nasz kalkulator wygeneruje ofertę w formie PDF lub w formie linku do
                udostępnienia w formacie html.
              </p>

              <p className="mb-4">
                Ponadto OZE System posiada pełną bazę niezbędnych materiałów marketingowych i sprzedażowych niezbędnych
                w Twojej pracy.
              </p>

              <p>Skontaktuj się z nami, aby uzyskać więcej informacji lub założyć konto w systemie.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
