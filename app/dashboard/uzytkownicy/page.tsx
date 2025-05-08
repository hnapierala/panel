"use client"

import { useState, useEffect } from "react"
import supabase from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, UserPlus, Trash2, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.admin.listUsers()

      if (error) {
        throw error
      }

      setUsers(data.users || [])
    } catch (error: any) {
      console.error("Błąd podczas pobierania użytkowników:", error)
      setError(error.message || "Wystąpił błąd podczas pobierania użytkowników")
    } finally {
      setLoading(false)
    }
  }

  const inviteUser = async () => {
    if (!newUserEmail) {
      setError("Adres email jest wymagany")
      return
    }

    try {
      setInviting(true)
      setError(null)
      setSuccess(null)

      // Generuj niestandardowy link zaproszenia
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(newUserEmail, {
        redirectTo: `${window.location.origin}/zaproszenie`,
      })

      if (error) {
        throw error
      }

      setSuccess(`Zaproszenie zostało wysłane na adres ${newUserEmail}`)
      setNewUserEmail("")
      fetchUsers()
    } catch (error: any) {
      console.error("Błąd podczas zapraszania użytkownika:", error)
      setError(error.message || "Wystąpił błąd podczas zapraszania użytkownika")
    } finally {
      setInviting(false)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const { error } = await supabase.auth.admin.deleteUser(userId)

      if (error) {
        throw error
      }

      setSuccess("Użytkownik został usunięty")
      fetchUsers()
    } catch (error: any) {
      console.error("Błąd podczas usuwania użytkownika:", error)
      setError(error.message || "Wystąpił błąd podczas usuwania użytkownika")
    } finally {
      setLoading(false)
    }
  }

  const resendInvitation = async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Generuj niestandardowy link zaproszenia
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${window.location.origin}/zaproszenie`,
      })

      if (error) {
        throw error
      }

      setSuccess(`Zaproszenie zostało ponownie wysłane na adres ${email}`)
    } catch (error: any) {
      console.error("Błąd podczas ponownego wysyłania zaproszenia:", error)
      setError(error.message || "Wystąpił błąd podczas ponownego wysyłania zaproszenia")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Zarządzanie użytkownikami</CardTitle>
          <CardDescription>Dodawaj, usuwaj i zarządzaj użytkownikami systemu</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6 flex gap-2">
            <Input
              type="email"
              placeholder="Adres email nowego użytkownika"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <Button onClick={inviteUser} disabled={inviting}>
              <UserPlus className="mr-2 h-4 w-4" />
              {inviting ? "Wysyłanie..." : "Zaproś użytkownika"}
            </Button>
          </div>

          {loading && <p>Ładowanie użytkowników...</p>}

          {!loading && users.length === 0 && <p>Brak użytkowników</p>}

          {!loading && users.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ostatnie logowanie</TableHead>
                  <TableHead>Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.email_confirmed_at ? (
                        <span className="text-green-600">Potwierdzony</span>
                      ) : (
                        <span className="text-amber-600">Niepotwierdzony</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Nigdy nie zalogowany"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!user.email_confirmed_at && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resendInvitation(user.email)}
                            title="Wyślij ponownie zaproszenie"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          title="Usuń użytkownika"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
