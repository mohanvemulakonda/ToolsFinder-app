'use client'

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-blue-500">Tools</span>
              <span className="text-white">Finder</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Find and manage your industrial tools efficiently.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-blue-500">Search Tools</a></li>
              <li><a href="/suppliers" className="text-gray-400 hover:text-blue-500">Suppliers</a></li>
              <li><a href="/library" className="text-gray-400 hover:text-blue-500">My Library</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Cutting Tools</span></li>
              <li><span className="text-gray-400">Inserts</span></li>
              <li><span className="text-gray-400">Holders</span></li>
              <li><span className="text-gray-400">Assemblies</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>support@toolsfinder.io</li>
              <li>1-800-TOOLS</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          © 2024 ToolsFinder. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
