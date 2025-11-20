import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const metadata = {
  title: 'ToolsFinder',
  description: 'Find and manage your industrial tools',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
