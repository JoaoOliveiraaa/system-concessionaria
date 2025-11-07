import { Navbar } from "@/components/navbar"

export default function VehicleDetailsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

