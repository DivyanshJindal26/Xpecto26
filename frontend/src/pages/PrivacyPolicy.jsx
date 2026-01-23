"use client";
import { motion } from "framer-motion";
import { IconArrowLeft, IconShield } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Header */}
      <section className="relative border-b border-white/10 bg-gradient-to-b from-black/80 to-black">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors mb-8 group"
          >
            <IconArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-4"
          >
            <IconShield className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-light">Privacy Policy</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/50 text-lg"
          >
            Last updated: January 18, 2026
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="prose prose-invert max-w-none"
        >
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-white/70 leading-relaxed">
                Xpecto, the annual technical festival of IIT Mandi, is committed
                to protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our website and services.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Information We Collect
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">
                    2.1 Personal Information
                  </h3>
                  <p>
                    When you register for Xpecto through Google OAuth, we
                    collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li>Full name</li>
                    <li>Email address (Google account email)</li>
                    <li>Profile picture</li>
                    <li>College/Institution name</li>
                    <li>
                      College email address (if different from Google email)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">
                    2.2 Event Registration Data
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Events, sessions, and exhibitions you register for</li>
                    <li>Registration timestamps</li>
                    <li>Team information (if applicable)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">
                    2.3 Usage Information
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>IP address</li>
                    <li>Pages visited and time spent on our website</li>
                    <li>Referring website addresses</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. How We Use Your Information
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>We use the collected information to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Create and manage your account</li>
                  <li>Process event, session, and exhibition registrations</li>
                  <li>Send important updates and notifications about Xpecto</li>
                  <li>Improve our website and user experience</li>
                  <li>Verify student eligibility for certain events</li>
                  <li>Communicate with you regarding your registrations</li>
                  <li>
                    Generate analytics and reports for festival management
                  </li>
                  <li>Prevent fraud and ensure platform security</li>
                </ul>
              </div>
            </div>

            {/* Google OAuth */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Google OAuth Authentication
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  We use Google OAuth 2.0 for authentication. When you log in
                  with Google:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    We only access basic profile information (name, email,
                    profile picture)
                  </li>
                  <li>We do not have access to your Google password</li>
                  <li>
                    You can revoke our access anytime through your Google
                    Account settings
                  </li>
                  <li>We comply with Google's API Services User Data Policy</li>
                </ul>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Information Sharing and Disclosure
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  We do not sell, trade, or rent your personal information to
                  third parties. We may share your information only in the
                  following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-white/90">Event Organizers:</strong>{" "}
                    Your registration details with specific event coordinators
                  </li>
                  <li>
                    <strong className="text-white/90">
                      Legal Requirements:
                    </strong>{" "}
                    When required by law or to protect our rights
                  </li>
                  <li>
                    <strong className="text-white/90">IIT Mandi:</strong> With
                    the institute administration for festival management
                  </li>
                </ul>
              </div>
            </div>

            {/* Data Security */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Data Security
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>We implement security measures to protect your data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>HTTPS encryption for all data transmission</li>
                  <li>Secure authentication using httpOnly cookies</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and admin authentication</li>
                  <li>
                    Password hashing and secure storage (for backend systems)
                  </li>
                </ul>
                <p className="mt-4">
                  However, no method of transmission over the internet is 100%
                  secure. We strive to protect your data but cannot guarantee
                  absolute security.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Cookies and Tracking
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintain your login session (authentication cookies)</li>
                  <li>Remember your preferences</li>
                  <li>Analyze website usage and performance</li>
                </ul>
                <p className="mt-4">
                  You can control cookie settings through your browser, but
                  disabling cookies may affect website functionality.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                8. Your Rights and Choices
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-white/90">Access:</strong> View your
                    personal information through your profile page
                  </li>
                  <li>
                    <strong className="text-white/90">Update:</strong> Edit your
                    college information and preferences
                  </li>
                  <li>
                    <strong className="text-white/90">Delete:</strong> Request
                    account deletion by contacting us
                  </li>
                  <li>
                    <strong className="text-white/90">Withdraw Consent:</strong>{" "}
                    Revoke Google OAuth access through your Google Account
                  </li>
                  <li>
                    <strong className="text-white/90">Opt-out:</strong>{" "}
                    Unsubscribe from promotional communications
                  </li>
                </ul>
              </div>
            </div>

            {/* Data Retention */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                9. Data Retention
              </h2>
              <p className="text-white/70 leading-relaxed">
                We retain your personal information for as long as your account
                is active or as needed to provide services. After the festival
                concludes, we may retain certain data for archival and reporting
                purposes. You can request deletion of your data by contacting
                us.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                10. Children's Privacy
              </h2>
              <p className="text-white/70 leading-relaxed">
                Our services are intended for users aged 13 and above. We do not
                knowingly collect personal information from children under 13.
                If we become aware of such collection, we will take steps to
                delete the information.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-white/70 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any significant changes by posting the new Privacy
                Policy on this page and updating the "Last updated" date. Your
                continued use of our services after changes constitutes
                acceptance of the updated policy.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                12. Contact Us
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                If you have any questions or concerns about this Privacy Policy
                or our data practices, please contact us at:
              </p>
              <div className="space-y-2 text-white/70">
                <p>
                  Email:{" "}
                  <a
                    href="mailto:contact@xpecto.org"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    contact@xpecto.org
                  </a>
                </p>
                <p>
                  Tech Support:{" "}
                  <a
                    href="mailto:tech@xpecto.org"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    tech@xpecto.org
                  </a>
                </p>
                <p className="mt-4">
                  Indian Institute of Technology Mandi
                  <br />
                  Kamand, Himachal Pradesh - 175005
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-white/30">© 2026 Xpecto, IIT Mandi</p>
        </div>
      </footer>
    </div>
  );
}
