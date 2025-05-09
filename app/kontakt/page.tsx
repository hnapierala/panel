import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Kontakt</CardTitle>
          <CardDescription className="text-center">
            Skontaktuj się z nami, aby uzyskać więcej informacji o OZE System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Dane kontaktowe</h3>
            <div className="mt-2 space-y-2">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:kontakt@oze-system.tech" className="text-blue-500 hover:underline">
                  kontakt@oze-system.tech
                </a>
              </p>
              <p>
                <strong>Telefon:</strong>{" "}
                <a href="tel:+48123456789" className="text-blue-500 hover:underline">
                  +48 123 456 789
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Adres</h3>
            <address className="mt-2 not-italic">
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
            <h3 className="text-lg font-medium">Godziny pracy</h3>
            <p className="mt-2">
              Poniedziałek - Piątek: 8:00 - 16:00
              <br />
              Sobota - Niedziela: Zamknięte
            </p>
          </div>

          <div className="pt-4 text-center">
            <a href="/" className="text-blue-500 hover:underline">
              Powrót do strony głównej
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
