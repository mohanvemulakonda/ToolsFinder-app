import './globals.css'

export const metadata = {
  title: 'ToolsFinder',
  description: 'Find and manage your tools',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
