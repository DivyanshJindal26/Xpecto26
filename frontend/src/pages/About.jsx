"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  IconMail,
  IconMapPin,
  IconBrandInstagram,
  IconCode,
  IconArrowUpRight,
  IconUsers,
} from "@tabler/icons-react";

export default function About() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const developers = [
    { name: "Divyansh Jindal", role: "Full Stack Developer" },
    { name: "Vansh Pandey", role: "Full Stack Developer" },
  ];

  const conveners = [
    { name: "Convener Name", role: "Convener" },
    { name: "Co-Convener 1", role: "Co-Convener" },
    { name: "Co-Convener 2", role: "Co-Convener" },
    { name: "Co-Convener 3", role: "Co-Convener" },
  ];

  const contacts = [
    { label: "tech@xpecto.org", href: "mailto:tech@xpecto.org" },
    { label: "contact@xpecto.org", href: "mailto:contact@xpecto.org" },
  ];

  // Fetch team members from backend
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || "https://xpecto.org/api";
        const response = await fetch(`${apiUrl}/team`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch team members");
        }

        const result = await response.json();
        if (result.success) {
          setTeamMembers(result.data);
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <div className="w-full min-h-screen relative bg-[#050508]">
      {/* Fixed Background Section */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <div className="absolute inset-0">
          <img src="./bg4.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Fixed Planet - LEFT CENTER */}
        <div className="absolute top-1/2 left-[10%] -translate-y-1/2 scale-75 md:scale-90 lg:scale-100">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.img
              src="./golden_planet.png"
              alt="Planet"
              className="w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="relative pt-40 pb-24 px-6">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="px-6 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                <span className="font-['Michroma'] text-sm text-white tracking-widest">
                  XPECTO'26
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="font-['Michroma'] text-5xl md:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white mb-8 tracking-[0.2em] leading-tight"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              ABOUT
            </motion.h1>

            <motion.div
              className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-white to-transparent mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            <motion.p
              className="font-['Michroma'] text-xl md:text-2xl text-gray-300 tracking-wider max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              IIT Mandi's Annual Tech Fest
            </motion.p>
          </motion.div>
        </div>

        {/* Content Grid */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Location Card - Large */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-7 backdrop-blur-md bg-black/60 border border-white/10 rounded-3xl p-8 hover:bg-black/70 hover:border-white/20 transition-all duration-500 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-8">
                <IconMapPin className="w-8 h-8 text-white/40" />
                <span className="text-xs text-white/30 uppercase tracking-widest font-['Michroma']">
                  Location
                </span>
              </div>
              <h3 className="font-['Michroma'] text-3xl md:text-4xl font-light mb-4 text-white">
                IIT Mandi
              </h3>
              <p className="font-['Michroma'] text-white/50 text-lg leading-relaxed mb-6">
                Kamand, Himachal Pradesh
                <br />
                India — 175005
              </p>
              <a
                href="https://maps.google.com/?q=IIT+Mandi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group font-['Michroma']"
              >
                Open in Maps
                <IconArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-5 backdrop-blur-md bg-black/60 border border-white/10 rounded-3xl p-8 hover:bg-black/70 hover:border-white/20 transition-all duration-500 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-8">
                <IconMail className="w-8 h-8 text-white/40" />
                <span className="text-xs text-white/30 uppercase tracking-widest font-['Michroma']">
                  Contact
                </span>
              </div>
              <div className="space-y-4">
                {contacts.map((contact, idx) => (
                  <a
                    key={idx}
                    href={contact.href}
                    className="block font-['Michroma'] text-xl text-white/70 hover:text-white transition-colors"
                  >
                    {contact.label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Instagram Card */}
            <motion.a
              href="https://instagram.com/xpecto_iitmandi"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-4 backdrop-blur-md bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-white/10 rounded-3xl p-8 hover:from-purple-900/50 hover:to-pink-900/50 hover:border-white/20 transition-all duration-500 group shadow-2xl"
            >
              <IconBrandInstagram className="w-10 h-10 text-white/60 mb-6 group-hover:scale-110 transition-transform" />
              <p className="font-['Michroma'] text-2xl font-light text-white">
                @xpecto_iitmandi
              </p>
              <p className="font-['Michroma'] text-white/40 text-sm mt-2">
                Follow us on Instagram
              </p>
            </motion.a>

            {/* Leadership Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="md:col-span-8 backdrop-blur-md bg-black/60 border border-white/10 rounded-3xl p-8 hover:bg-black/70 hover:border-white/20 transition-all duration-500 shadow-2xl"
            >
              <span className="text-xs text-white/30 uppercase tracking-widest font-['Michroma']">
                Leadership
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {conveners.map((person, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10" />
                    <p className="font-['Michroma'] text-sm font-medium text-white">
                      {person.name}
                    </p>
                    <p className="font-['Michroma'] text-xs text-white/40 mt-1">
                      {person.role}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map Card - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="md:col-span-12 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.289193080827!2d77.01885731512302!3d31.778448081269743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39048708163fd03f%3A0x8129a80ee5d5950b!2sIndian%20Institute%20of%20Technology%20Mandi!5e0!3m2!1sen!2sin!4v1621234567890!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale invert-[0.9] opacity-80 hover:opacity-100 transition-opacity duration-500 md:h-[400px]"
              />
            </motion.div>

            {/* Developers Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="md:col-span-12 backdrop-blur-md bg-black/60 border border-white/10 rounded-3xl p-8 hover:bg-black/70 hover:border-white/20 transition-all duration-500 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <IconCode className="w-6 h-6 text-white/40" />
                <span className="text-xs text-white/30 uppercase tracking-widest font-['Michroma']">
                  Built by
                </span>
              </div>
              <div className="flex flex-wrap gap-8">
                {developers.map((dev, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-400/20 border border-white/10" />
                    <div>
                      <p className="font-['Michroma'] font-medium text-white">
                        {dev.name}
                      </p>
                      <p className="font-['Michroma'] text-sm text-white/40">
                        {dev.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-4">
              <IconUsers className="w-8 h-8 text-white/40" />
              <h2 className="font-['Michroma'] text-4xl lg:text-5xl font-light text-white">
                Our Team
              </h2>
            </div>
            <p className="font-['Michroma'] text-white/50 text-lg">
              Meet the people who make Xpecto happen
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
              />
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="backdrop-blur-md bg-red-900/40 border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl"
            >
              <p className="font-['Michroma'] text-red-200">
                Unable to load team members. Please try again later.
              </p>
            </motion.div>
          ) : teamMembers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="backdrop-blur-md bg-black/60 border border-white/10 rounded-3xl p-8 text-center shadow-2xl"
            >
              <p className="font-['Michroma'] text-white/40">
                No team members to display yet.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member._id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="backdrop-blur-md bg-black/60 border border-white/10 rounded-3xl p-6 hover:bg-black/70 hover:border-white/20 transition-all duration-500 group shadow-2xl"
                >
                  {/* Member Image */}
                  <div className="relative mb-6">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl font-['Michroma'] font-light text-white/20">
                          {member.name?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>

                    {/* Corner accents */}
                    <motion.div
                      className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Member Info */}
                  <div className="space-y-2">
                    <h3 className="font-['Michroma'] text-xl font-medium text-white group-hover:text-cyan-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="font-['Michroma'] text-white/60 text-sm uppercase tracking-wide">
                      {member.team}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <motion.div
          className="relative py-20 text-center border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
            <p className="font-['Michroma'] text-gray-400 text-sm tracking-[0.3em]">
              XPECTO'26
            </p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
          </motion.div>
          <p className="font-['Michroma'] text-gray-500 text-xs tracking-widest mb-8">
            MARCH 14-16, 2026 • HIMALAYAS' BIGGEST TECHFEST
          </p>

          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <p className="font-['Michroma'] text-sm text-white/30">
                © 2026 Xpecto, IIT Mandi
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="mailto:tech@xpecto.org"
                  className="font-['Michroma'] text-sm text-white/30 hover:text-white/60 transition-colors"
                >
                  Tech Support
                </a>
                <a
                  href="https://instagram.com/xpecto_iitmandi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Michroma'] text-sm text-white/30 hover:text-white/60 transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
              <a
                href="/terms-of-service"
                className="font-['Michroma'] text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Terms of Service
              </a>
              <span className="text-white/20">•</span>
              <a
                href="/privacy-policy"
                className="font-['Michroma'] text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
