'use client'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/images/logo/toolsfinder-icon.svg"
                alt="ToolsFinder"
                className="h-10 w-10"
              />
              <div className="-ml-1">
                <span className="text-lg font-light text-gray-900">
                  Tools<span className="font-semibold">Finder</span><span className="font-semibold text-amber-500">.io</span>
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              Industrial tool search and management platform.
            </p>
          </div>

          <div>
            <h4 className="text-gray-700 font-semibold mb-4 text-sm uppercase tracking-wide">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-500 hover:text-blue-600 transition">Search</a></li>
              <li><a href="/suppliers" className="text-gray-500 hover:text-blue-600 transition">Suppliers</a></li>
              <li><a href="/library" className="text-gray-500 hover:text-blue-600 transition">Library</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-700 font-semibold mb-4 text-sm uppercase tracking-wide">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-500">Cutting Tools</span></li>
              <li><span className="text-gray-500">Inserts</span></li>
              <li><span className="text-gray-500">Holders</span></li>
              <li><span className="text-gray-500">Assemblies</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-700 font-semibold mb-4 text-sm uppercase tracking-wide">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@toolsfinder.io
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                1-800-TOOLS
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
          © 2024 ToolsFinder.io. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
