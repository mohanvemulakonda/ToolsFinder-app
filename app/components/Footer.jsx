'use client'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              <span className="text-white">TOOLS<span className="text-blue-500">FINDER</span></span>
            </h3>
            <p className="text-gray-600 text-sm">
              Industrial tool search and management platform.
            </p>
          </div>

          <div>
            <h4 className="text-gray-400 font-semibold mb-4 text-sm">NAVIGATION</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-600 hover:text-blue-500 transition">Search</a></li>
              <li><a href="/suppliers" className="text-gray-600 hover:text-blue-500 transition">Suppliers</a></li>
              <li><a href="/library" className="text-gray-600 hover:text-blue-500 transition">Library</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-400 font-semibold mb-4 text-sm">CATEGORIES</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-600">Cutting Tools</span></li>
              <li><span className="text-gray-600">Inserts</span></li>
              <li><span className="text-gray-600">Holders</span></li>
              <li><span className="text-gray-600">Assemblies</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-400 font-semibold mb-4 text-sm">CONTACT</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@toolsfinder.io
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                1-800-TOOLS
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-700 text-sm">
          © 2024 ToolsFinder. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
