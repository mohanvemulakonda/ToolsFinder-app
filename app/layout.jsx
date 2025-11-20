import './globals.css'

export const metadata = {
  title: 'ToolsFinder - Find Industrial Tools',
  description: 'Search and discover industrial tools from verified suppliers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
