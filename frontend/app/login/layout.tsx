export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <main>{children}</main>
    </div>
  )
}
