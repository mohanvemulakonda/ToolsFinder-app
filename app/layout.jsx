import './globals.css'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'ToolsFinder',
  description: 'Find and manage your industrial tools',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
