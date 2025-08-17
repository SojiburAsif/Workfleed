import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../Theme/ThemeProvider';
import { HiDocumentText, HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router';

const TERMS = [
  {
    id: 1,
    title: 'Acceptance of Terms',
    summary: 'By using the Service you accept these Terms & Conditions.',
    text: `By accessing or using the Service, you agree to be bound by these Terms. If you do not agree,
please do not use the Service. These Terms form a binding agreement between you and WorkFleet.`
  },
  {
    id: 2,
    title: 'Use of Service',
    summary: 'Rules for accessing and using the Service.',
    text: `You agree to use the Service only for lawful purposes and in accordance with these Terms.
You must follow any policies and guidelines we publish. Unauthorized use, scraping,
or interfering with the Service is prohibited.`
  },
  {
    id: 3,
    title: 'Account Responsibility',
    summary: 'Keep your account credentials secure.',
    text: `You are responsible for maintaining the confidentiality of your account credentials
and for all activities that occur under your account. Notify us immediately if you
suspect unauthorized use.`
  },
  {
    id: 4,
    title: 'Payment, Billing & Refunds',
    summary: 'Billing, payment methods, and refund policy.',
    text: `Paid features (if any) require a valid payment method. All fees are non-refundable
except as expressly provided. We may change pricing with notice.`
  },
  {
    id: 5,
    title: 'Privacy & Data',
    summary: 'How we collect and use personal information.',
    text: `Our Privacy Policy describes how we collect and use personal information. By using
the Service you consent to collection and use in accordance with the Privacy Policy.`
  },
  {
    id: 6,
    title: 'Intellectual Property',
    summary: 'Copyrights, trademarks and content rights.',
    text: `All content, trademarks, logos and data provided by the Service are the property of
WorkFleet or its licensors. You may not reproduce, distribute, or create derivative
works without permission.`
  },
  {
    id: 7,
    title: 'Acceptable Use & Prohibited Activities',
    summary: 'What actions are prohibited on the platform.',
    text: `You must not use the Service for illegal purposes, to harass others, to transmit malware,
or to attempt to gain unauthorized access to our systems or other users' accounts.`
  },
  {
    id: 8,
    title: 'Limitation of Liability',
    summary: 'Company liability is limited as described below.',
    text: `To the maximum extent permitted by law, WorkFleet will not be liable for indirect,
incidental, special, consequential or punitive damages arising out of your access
to or use of the Service.`
  },
  {
    id: 9,
    title: 'Termination',
    summary: 'How access and accounts may be suspended or terminated.',
    text: `We may suspend or terminate your access for violation of these Terms or for any
reason with notice where required. Termination does not relieve you of obligations
incurred prior to termination.`
  },
  {
    id: 10,
    title: 'Governing Law & Dispute Resolution',
    summary: 'Legal jurisdiction and dispute handling.',
    text: `These Terms are governed by the laws of the jurisdiction in which WorkFleet operates.
Disputes will be resolved in the appropriate courts unless alternative dispute
resolution is specified.`
  },
  {
    id: 11,
    title: 'Changes to Terms',
    summary: 'We may update these Terms from time to time.',
    text: `We may modify these Terms from time to time. We will notify users of material changes.
Continued use after changes constitutes acceptance of the updated Terms.`
  },
  {
    id: 12,
    title: 'Contact',
    summary: 'How to contact support for questions about the Terms.',
    text: `If you have questions about these Terms, contact us at web.asif@gmail.com. We try to
respond to queries as quickly as possible.`
  }
];

const Trames = () => {
  const { theme } = useContext(ThemeContext);
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  const bgClass = theme === 'dark' ? 'bg-black text-gray-200' : 'bg-white text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-950 border-gray-700' : 'bg-gray-50 border-gray-200';
  const muted = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const accent = theme === 'dark' ? 'text-red-400' : 'text-red-600';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const toggle = (id) => setOpenId(openId === id ? null : id);

  const backBtnClass =
    theme === 'dark'
      ? 'inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700'
      : 'inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white text-gray-900 border border-gray-200';

  // Robust back handler
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/register'); // fallback route
    }
  };

  return (
    <main className={`${bgClass} min-h-screen py-16 px-4 sm:px-6 lg:px-20`}>
      <div className="max-w-7xl mx-auto">
        {/* Top: Back button + Header */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={handleBack} className={backBtnClass} aria-label="Go back">
            <FiArrowLeft /> Back
          </button>

          <div className="text-center w-full max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-3">
              <HiDocumentText className={`${accent} text-3xl`} />
              <h1 className="text-2xl sm:text-3xl font-bold">Terms & Conditions</h1>
            </div>
            <p className={`${muted} mt-3`}>Please read these Terms & Conditions carefully. They govern your use of the Service.</p>
          </div>

          <div style={{ width: 96 }} />
        </div>

        {/* Terms List (accordion) */}
        <section className="space-y-4">
          {TERMS.map((item) => (
            <article key={item.id} className={`rounded-md overflow-hidden border ${border} ${cardBg}`}>
              <button
                onClick={() => toggle(item.id)}
                className="w-full px-5 py-4 flex items-start justify-between gap-4"
                aria-expanded={openId === item.id}
                type="button"
              >
                <div className="flex items-start gap-4 text-left">
                  <HiDocumentText className={`${accent} mt-1`} />
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className={`${muted} text-sm mt-1`}>{item.summary}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {openId === item.id ? <HiChevronUp className={`${accent} text-2xl`} /> : <HiChevronDown className={`${muted} text-2xl`} />}
                </div>
              </button>

              <div className={`${openId === item.id ? 'max-h-screen p-5' : 'max-h-0 p-0'} transition-all duration-300 ease-in-out text-sm leading-relaxed`}>
                <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: item.text.replace(/\n/g, '<br/>') }} />
              </div>
            </article>
          ))}
        </section>

        <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={`${muted} text-sm`}>Last updated: <strong>Aug 16, 2025</strong></p>
        </footer>
      </div>
    </main>
  );
};

export default Trames;
