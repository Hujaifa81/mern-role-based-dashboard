import Link from "next/link";

export default async function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="w-full bg-white shadow flex items-center justify-between px-6 py-4">
        <div className="text-xl font-bold text-blue-600">MyApp</div>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Login</Link>
          <Link href="/register" className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition">Register</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-semibold mb-2 text-gray-800">Welcome to MyApp</h1>
        <p className="text-gray-600 mb-8">A simple role based dashboard.</p>
        <div className="flex space-x-4">
          <Link href="/login" className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Login</Link>
          <Link href="/register" className="px-6 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition">Register</Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </div>
  );
}
