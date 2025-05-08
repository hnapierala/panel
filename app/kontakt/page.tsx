import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Kontakt</CardTitle>
          <CardDescription>Skontaktuj się z nami, aby uzyskać dostęp do systemu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-lg font-medium">Dział obsługi klienta</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-gray-500" />
                <span>+48 512 044 054</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-gray-500" />
                <span>kontakt@oze-system.tech</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-lg font-medium">Godziny pracy</h3>
            <p>Poniedziałek - Piątek: 8:00 - 16:00</p>
            <p>Sobota - Niedziela: Zamknięte</p>
          </div>

          <div className="flex justify-center">
            <Button asChild className="w-full">
              <a href="mailto:kontakt@oze-system.tech">Wyślij email</a>
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              Masz już konto?{" "}
              <a href="/logowanie" className="text-blue-600 hover:text-blue-500">
                Zaloguj się
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
