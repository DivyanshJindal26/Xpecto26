




















"use client";
import { motion } from "framer-motion";
import { IconArrowLeft, IconFileText } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
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
            <IconFileText className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-light">
              Terms of Service
            </h1>
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
                Welcome to Xpecto, the annual technical festival of IIT Mandi.
                By accessing or using our website and services, you agree to be
                bound by these Terms of Service. Please read them carefully
                before proceeding.
              </p>
            </div>

            {/* Account Registration */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Account Registration
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  To participate in Xpecto events, you must create an account by
                  logging in with your Google account. By registering, you agree
                  to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                  <li>Provide valid college information if you're a student</li>
                </ul>
              </div>
            </div>

            {/* Event Registration */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Event Registration & Participation
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  When registering for events, sessions, or exhibitions at
                  Xpecto, you acknowledge that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Registration does not guarantee participation if capacity is
                    reached
                  </li>
                  <li>You must comply with all event rules and regulations</li>
                  <li>
                    The organizers reserve the right to cancel or modify events
                  </li>
                  <li>You are responsible for any team coordination</li>
                  <li>False registrations may result in account suspension</li>
                </ul>
              </div>
            </div>

            {/* User Conduct */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. User Conduct
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Use the platform for any unlawful or fraudulent purposes
                  </li>
                  <li>Impersonate others or provide false information</li>
                  <li>Interfere with the proper functioning of the website</li>
                  <li>
                    Attempt to gain unauthorized access to any part of the
                    service
                  </li>
                  <li>Harass, abuse, or harm other users or organizers</li>
                </ul>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-white/70 leading-relaxed">
                All content on this website, including but not limited to text,
                graphics, logos, images, and software, is the property of Xpecto
                - IIT Mandi or its content suppliers and is protected by
                intellectual property laws. You may not reproduce, distribute,
                or create derivative works without explicit permission.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-white/70 leading-relaxed">
                Xpecto and IIT Mandi shall not be liable for any indirect,
                incidental, special, or consequential damages arising out of or
                in connection with your use of the website or participation in
                events. We do not guarantee uninterrupted or error-free service.
              </p>
            </div>

            {/* Privacy */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Privacy
              </h2>
              <p className="text-white/70 leading-relaxed">
                Your privacy is important to us. Please review our{" "}
                <button
                  onClick={() => navigate("/privacy-policy")}
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Privacy Policy
                </button>{" "}
                to understand how we collect, use, and protect your personal
                information.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                8. Changes to Terms
              </h2>
              <p className="text-white/70 leading-relaxed">
                We reserve the right to modify these Terms of Service at any
                time. Changes will be effective immediately upon posting to the
                website. Your continued use of the service after any changes
                constitutes acceptance of the new terms.
              </p>
            </div>

            {/* Termination */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                9. Termination
              </h2>
              <p className="text-white/70 leading-relaxed">
                We reserve the right to suspend or terminate your account and
                access to our services at our sole discretion, without notice,
                for conduct that we believe violates these Terms of Service or
                is harmful to other users, us, or third parties, or for any
                other reason.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                10. Contact Us
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please
                contact us at:
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
