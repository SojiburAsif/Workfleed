import React, { useContext } from 'react';
import { ThemeContext } from '../../Theme/ThemeProvider';
import { HiOutlineShieldCheck } from 'react-icons/hi';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router';

const Privacy = () => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const bgClass = theme === 'dark' ? 'bg-black text-gray-200' : 'bg-white text-gray-900';
    const cardBg = theme === 'dark' ? 'bg-gray-950 border-gray-700' : 'bg-gray-50 border-gray-200';
    const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const accent = theme === 'dark' ? 'text-red-400' : 'text-red-600';

    // Home button style
    const homeBtnClass =
        theme === 'dark'
            ? 'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700'
            : 'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-gray-900 border border-gray-200 hover:bg-gray-100';

    return (
        <main className={`${bgClass} min-h-screen py-16 px-4 sm:px-6 lg:px-20`}>
            <div className="max-w-7xl mx-auto">
                {/* Top: Home button + Header */}
                <div className="mb-8 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className={homeBtnClass}
                        aria-label="Go to Home"
                    >
                        <FiArrowLeft /> Home
                    </button>

                    <div className="text-center w-full max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-3 justify-center">
                            <HiOutlineShieldCheck className={`${accent} text-3xl`} />
                            <h1 className="text-2xl sm:text-3xl font-bold">Privacy Policy</h1>
                        </div>
                        <p className={`${muted} mt-3`}>
                            This Privacy Policy explains how WorkFleet ("we", "us", or "our") collects, uses, discloses,
                            and protects personal information when you use our services.
                        </p>
                    </div>

                    <div style={{ width: 96 }} />
                </div>

                {/* Overview */}
                <section className={`p-6 rounded-md border ${cardBg} mb-6`}>
                    <h2 className="text-lg font-semibold mb-2">Overview</h2>
                    <p className={muted}>
                        We respect your privacy and are committed to protecting your personal data. This policy
                        applies to information we collect through our website, applications, and services (the
                        "Service").
                    </p>
                </section>

                {/* 1. Information We Collect */}
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">1. Information We Collect</h3>

                    <div className={`p-5 rounded-md border ${cardBg} mb-4`}>
                        <h4 className="font-semibold">a) Information you provide</h4>
                        <p className={muted}>
                            This includes name, email address, phone number, company details, billing and payment
                            information, and any other information you provide when registering, contacting support,
                            or using paid features.
                        </p>
                    </div>

                    <div className={`p-5 rounded-md border ${cardBg} mb-4`}>
                        <h4 className="font-semibold">b) Usage and technical data</h4>
                        <p className={muted}>
                            We collect information about how you use the Service (pages visited, features used),
                            device information (device type, browser, OS), IP address, and log data to improve the
                            Service and for security.
                        </p>
                    </div>

                    <div className={`p-5 rounded-md border ${cardBg}`}>
                        <h4 className="font-semibold">c) Cookies & similar technologies</h4>
                        <p className={muted}>
                            We use cookies and similar technologies for authentication, analytics, performance,
                            and personalization. You can manage cookie preferences through your browser settings.
                        </p>
                    </div>
                </section>

                {/* 2. How We Use Your Information */}
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">2. How We Use Your Information</h3>
                    <div className={`p-5 rounded-md border ${cardBg}`}>
                        <ul className="list-disc pl-5 space-y-2">
                            <li className={muted}><strong>Provide and maintain</strong> the Service and customer support.</li>
                            <li className={muted}><strong>Process payments</strong> and manage billing.</li>
                            <li className={muted}><strong>Improve the Service</strong> through analytics and feedback.</li>
                            <li className={muted}><strong>Security</strong> — detect and prevent fraud or abuse.</li>
                            <li className={muted}><strong>Communication</strong> — send account notices, updates, and promotional messages (you can opt out of marketing).</li>
                        </ul>
                    </div>
                </section>

                {/* 3. Sharing & Disclosure */}
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">3. Sharing and Disclosure</h3>
                    <div className={`p-5 rounded-md border ${cardBg} mb-4`}>
                        <p className={muted}>
                            We may share your information with: service providers who perform services on our behalf
                            (payment processors, analytics providers), legal and regulatory authorities when required,
                            and in connection with mergers, acquisitions, or business transfers (subject to confidentiality).
                        </p>
                    </div>
                    <div className={`p-5 rounded-md border ${cardBg}`}>
                        <p className={muted}>We never sell your personal information for direct marketing purposes.</p>
                    </div>
                </section>

                {/* 4. Security */}
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">4. Security</h3>
                    <div className={`p-5 rounded-md border ${cardBg}`}>
                        <p className={muted}>
                            We implement reasonable technical and organizational measures to protect personal data
                            against unauthorized access, loss, or misuse. However, no system is completely secure; if
                            you suspect a security issue, please contact us immediately.
                        </p>
                    </div>
                </section>

                {/* 5. Data Retention */}
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">5. Data Retention</h3>
                    <div className={`p-5 rounded-md border ${cardBg}`}>
                        <p className={muted}>
                            We retain personal data only as long as necessary for the purposes described in this
                            policy, subject to legal and contractual obligations. When data is no longer needed we
                            will securely delete or anonymize it.
                        </p>
                    </div>
                </section>

                {/* 6. Your Rights */}
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">6. Your Rights</h3>
                    <div className={`p-5 rounded-md border ${cardBg}`}>
                        <ul className="list-disc pl-5 space-y-2">
                            <li className={muted}><strong>Access:</strong> You can request a copy of the personal data we hold about you.</li>
                            <li className={muted}><strong>Correction:</strong> Ask us to correct inaccurate or incomplete information.</li>
                            <li className={muted}><strong>Deletion:</strong> Request deletion of personal data where applicable.</li>
                            <li className={muted}><strong>Objection/Restriction:</strong> Object to or request restriction of processing in certain cases.</li>
                            <li className={muted}><strong>Data portability:</strong> Request a machine-readable copy of certain personal data.</li>
                        </ul>
                        <p className={`${muted} mt-3`}>To exercise any of these rights, contact us at <a className={`${accent} underline`} href="mailto:web.asif@gmail.com">web.asif@gmail.com</a>.</p>
                    </div>
                </section>

                {/* 7. Children's Privacy */}
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">7. Children's Privacy</h3>
                    <div className={`p-5 rounded-md border ${cardBg}`}>
                        <p className={muted}>
                            The Service is not directed to children under 13. We do not knowingly collect personal
                            information from children under 13. If you believe we have collected such information,
                            please contact us to request deletion.
                        </p>
                    </div>
                </section>

                {/* 8. Third-Party Links */}
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">8. Third-Party Links & Services</h3>
                    <div className={`p-5 rounded-md border ${cardBg}`}>
                        <p className={muted}>
                            The Service may contain links to third-party sites and services. We are not responsible
                            for their privacy practices. Please review third-party privacy policies before sharing
                            personal data with them.
                        </p>
                    </div>
                </section>

                {/* 9. Changes */}
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">9. Changes to this Policy</h3>
                    <div className={`p-5 rounded-md border ${cardBg}`}>
                        <p className={muted}>
                            We may update this Privacy Policy from time to time. Material changes will be posted on
                            this page with an updated "Last updated" date. Continued use after changes indicates
                            acceptance of the updated policy.
                        </p>
                    </div>
                </section>

                {/* 10. Contact */}
                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">10. Contact</h3>
                    <div className={`p-5 rounded-md border ${cardBg}`}>
                        <p className={muted}>
                            If you have questions, requests, or concerns about this Privacy Policy, please contact:
                        </p>
                        <p className={`${muted} mt-3`}><strong>Email:</strong> <a className={`${accent} underline`} href="mailto:web.asif@gmail.com">web.asif@gmail.com</a></p>
                    </div>
                </section>

                {/* Footer */}
                <div className={`${muted} text-sm text-center`}>Last updated: <strong>Aug 16, 2025</strong></div>
                <div className={`${muted} text-sm text-center mt-2`}>&copy; {new Date().getFullYear()} WorkFleet. All rights reserved.</div>
            </div>
        </main>
    );
};

export default Privacy;
