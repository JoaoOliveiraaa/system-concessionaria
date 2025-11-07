import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="w-full max-w-sm">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>We sent a confirmation link to your email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to confirm your account and set up your admin access.
          </p>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/auth/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
