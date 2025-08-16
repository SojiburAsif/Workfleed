import React, { useContext } from 'react';
import { ThemeContext } from '../../Theme/ThemeProvider';
import { HiOutlineUsers, HiOutlineLightBulb, HiOutlineChartBar, HiOutlineOfficeBuilding } from 'react-icons/hi';
import { Link } from 'react-router';

const About = () => {
  const { theme } = useContext(ThemeContext);

  // Dark mode bg: black, Light mode bg: white
  const bgClass = theme === 'dark' ? 'bg-black text-gray-200' : 'bg-white text-gray-900';
  const muted = theme === 'dark' ? 'text-gray-200' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-950 border-gray-700' : 'bg-gray-50 border-gray-200';
  const accent = theme === 'dark' ? 'text-red-400' : 'text-red-600';

  return (
    <main className={`${bgClass} min-h-screen py-16 px-4 sm:px-6 lg:px-20`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">About WorkFleet</h1>
          <p className={`${muted} mt-3 max-w-2xl mx-auto`}>
            WorkFleet builds intelligent HR & employee management tools to help teams stay productive,
            reduce manual work, and make data-driven decisions.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/" className={`px-3 py-2 rounded-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-200 bg-white text-gray-900'}`}>
              Back to Home
            </Link>
          </div>
        </header>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-lg border ${cardBg}`}>
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <HiOutlineLightBulb className={accent} /> Mission
            </h2>
            <p className={`${muted} mt-3`}>
              To empower businesses with simple, scalable HR tools that reduce admin overhead,
              increase employee engagement, and enable managers to make better decisions.
            </p>
          </div>

          <div className={`p-6 rounded-lg border ${cardBg}`}>
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <HiOutlineChartBar className={accent} /> Vision
            </h2>
            <p className={`${muted} mt-3`}>
              To become the go-to platform for small and medium businesses seeking reliable,
              human-centered HR and workforce management solutions.
            </p>
          </div>
        </section>

        {/* What we offer */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">What We Offer</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-5 rounded-md border ${cardBg}`}>
              <div className="flex items-center gap-3">
                <HiOutlineUsers className={accent} />
                <h4 className="font-semibold">Team Management</h4>
              </div>
              <p className={`${muted} mt-3 text-sm`}>
                Centralized employee records, attendance, and role management.
              </p>
            </div>

            <div className={`p-5 rounded-md border ${cardBg}`}>
              <div className="flex items-center gap-3">
                <HiOutlineChartBar className={accent} />
                <h4 className="font-semibold">Insights & Reports</h4>
              </div>
              <p className={`${muted} mt-3 text-sm`}>
                Daily summaries, performance metrics and payroll-ready reports.
              </p>
            </div>

            <div className={`p-5 rounded-md border ${cardBg}`}>
              <div className="flex items-center gap-3">
                <HiOutlineOfficeBuilding className={accent} />
                <h4 className="font-semibold">HR Automation</h4>
              </div>
              <p className={`${muted} mt-3 text-sm`}>
                Onboarding, approvals, payroll workflows and notifications.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className={`p-6 rounded-lg border ${cardBg} mb-8`}>
          <h3 className="text-xl font-semibold mb-3">Our Story</h3>
          <p className={muted}>
            WorkFleet was founded to solve repetitive HR problems for growing teams. We combine
            practical UX, powerful integrations, and lightweight analytics so teams spend less
            time on paperwork and more time on meaningful work.
          </p>
        </section>

        {/* Team */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Core Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`p-4 rounded-md border ${cardBg}`}>
              <h4 className="font-semibold">Md. Asif — Founder & Developer</h4>
              <p className={`${muted} text-sm mt-2`}>Building the product, backend & frontend.</p>
            </div>
            <div className={`p-4 rounded-md border ${cardBg}`}>
              <h4 className="font-semibold">HR Lead — (Placeholder)</h4>
              <p className={`${muted} text-sm mt-2`}>People & processes specialist.</p>
            </div>
            <div className={`p-4 rounded-md border ${cardBg}`}>
              <h4 className="font-semibold">Product Designer — (Placeholder)</h4>
              <p className={`${muted} text-sm mt-2`}>Designing simple and effective interfaces.</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className={`p-6 rounded-lg border ${cardBg} mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
          <div>
            <h3 className="text-lg font-semibold">Have questions or want a demo?</h3>
            <p className={`${muted} mt-2 text-sm`}>Reach out and our team will get back to you with options tailored for your business.</p>
          </div>

          <div className="flex items-center gap-3">
            <a href="mailto:web.asif@gmail.com" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition">
              Contact Sales
            </a>
            <Link to="/dashboard/contact-us" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white text-gray-900 transition dark:bg-gray-800 dark:text-gray-200">
              Contact Support
            </Link>
          </div>
        </section>

        <div className={`${muted} text-sm text-center`}>&copy; {new Date().getFullYear()} WorkFleet. All rights reserved.</div>
      </div>
    </main>
  );
};

export default About;
