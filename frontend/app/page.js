import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <h1 className="text-2xl font-bold text-blue-700">ChurchMS</h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-6">
        <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Manage Your Church <br />
          <span className="text-blue-600">Simply and Effectively</span>
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Track members, record attendance, and get insights — all in one place.
          Built for churches of all sizes.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition"
          >
            Start for Free
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl text-lg font-medium hover:bg-gray-50 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Everything your church needs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="👥"
              title="Member Management"
              description="Add, search, and manage all your church members in one place. Track active and inactive members easily."
            />
            <FeatureCard
              icon="📋"
              title="Attendance Tracking"
              description="Mark attendance for every service quickly. See who's present, who's absent, and spot trends over time."
            />
            <FeatureCard
              icon="📊"
              title="Dashboard & Reports"
              description="Get a clear overview of your church's growth, attendance trends, and member activity at a glance."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to get started?
        </h3>
        <p className="text-gray-500 mb-8 text-lg">
          Join churches already using ChurchMS to grow their community.
        </p>
        <Link
          href="/register"
          className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition"
        >
          Register Your Church Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-gray-400 text-sm">
        © 2026 ChurchMS. Built for churches everywhere.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
