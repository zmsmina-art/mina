'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, MapPin, ArrowDown, ArrowUpRight } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { getLatestArticles, articles } from '@/data/articles';

const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  const latestArticles = getLatestArticles(3);

  return (
    <div className="min-h-screen bg-[#050507] text-[#f0f0f5]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <span className="text-2xl italic font-light tracking-wide cursor-pointer logo-glow flex-shrink-0">
            <span className="text-[#8b5cf6]">m</span><span className="text-white">m</span><span className="text-[#8b5cf6] text-sm ml-0.5">.</span>
          </span>
          <div className="flex gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm">
            <a href="#about" className="text-[#8a8a9a] hover:text-white">About</a>
            <a href="#experience" className="text-[#8a8a9a] hover:text-white">Experience</a>
            <a href="#education" className="text-[#8a8a9a] hover:text-white">Education</a>
            <a href="#articles" className="text-[#8a8a9a] hover:text-white">Articles</a>
            <a href="#contact" className="text-[#8a8a9a] hover:text-white">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-start pt-32 md:justify-center md:pt-0 px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-[#8b5cf6]/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Image
              src="/headshot.png"
              alt="Mina Mankarious"
              width={192}
              height={192}
              className="w-full h-full object-cover scale-110"
              priority
            />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Mina <span className="gradient-text">Mankarious</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[#8b5cf6] mb-2 font-medium"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Founder & CEO of Olunix
          </motion.p>

          <motion.p
            className="text-[#6a6a7a] mb-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Marketing & Consulting
          </motion.p>

          <motion.p
            className="text-[#5a5a6a] text-sm mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            He/Him
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-2 text-[#6a6a7a] text-sm mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <MapPin size={14} />
            <span>Toronto, Canada</span>
          </motion.div>

          <motion.div
            className="flex gap-3 justify-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="https://olunix.com"
              target="_blank"
              className="btn-primary px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Olunix
            </a>
            <a
              href="https://linkedin.com/in/mina-mankarious"
              target="_blank"
              className="btn-secondary px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2"
            >
              <LinkedInIcon size={16} />
              LinkedIn
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <ArrowDown size={20} className="animate-bounce" />
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.h2 variants={fade} transition={{ duration: 0.5 }} className="text-2xl font-bold mb-8">
              About
            </motion.h2>
            <motion.div variants={fade} transition={{ duration: 0.5 }} className="space-y-5 text-[#b0b0c0] leading-relaxed">
              <p>
                I&apos;m the <span className="text-white">Founder and CEO of Olunix</span>, a marketing and consulting firm
                where I help businesses solve complex technical challenges and build practical, innovative solutions.
                As a <span className="text-white">businessman and engineer</span>, my approach is rooted in understanding
                client needs deeply, a skill I&apos;ve developed through experience across sales, partnerships, and engineering.
              </p>
              <p>
                As a <span className="text-white">Deal Partner at Boardy</span>, I&apos;ve built a strong network focused on
                providing value to the professionals I connect with. That same commitment to delivering value is at
                the core of everything we do at Olunix.
              </p>
              <p>
                Before this, I worked at <span className="text-white">Toyota</span>, where I managed high-volume customer
                interactions in a fast-paced environment. That experience taught me how to stay composed under pressure,
                communicate clearly, and deliver consistent results when it matters most.
              </p>
              <p>
                I&apos;m currently completing my final year in <span className="text-white">Automotive Engineering Technology</span> at
                McMaster University, which has given me a solid foundation in both technical problem-solving and business thinking.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="divider max-w-3xl mx-auto" />

      {/* Experience */}
      <section id="experience" className="py-28 px-6 section-fade">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.h2 variants={fade} transition={{ duration: 0.5 }} className="text-2xl font-bold mb-10">
              Experience
            </motion.h2>

            <div className="space-y-6">
              {/* Olunix */}
              <motion.div variants={fade} transition={{ duration: 0.5 }} className="glass rounded-xl p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/olunix-logo.png"
                      alt="Olunix"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-1">
                      <div>
                        <h3 className="font-semibold text-lg">Founder & CEO</h3>
                        <p className="text-[#8b5cf6] text-sm">Olunix</p>
                      </div>
                      <span className="text-[#6a6a7a] text-xs whitespace-nowrap">Sep 2024 - Present</span>
                    </div>
                    <p className="text-[#8a8a9a] text-sm">
                      Marketing & Consulting
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Boardy */}
              <motion.a
                href="https://boardy.ai"
                target="_blank"
                variants={fade}
                transition={{ duration: 0.5 }}
                className="glass rounded-xl p-5 block group"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/boardy-logo.png"
                      alt="Boardy"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg group-hover:text-[#8b5cf6] transition-colors">Deal Partner</h3>
                        <ExternalLink size={14} className="text-[#6a6a7a] group-hover:text-[#8b5cf6] transition-colors flex-shrink-0" />
                      </div>
                      <span className="text-[#6a6a7a] text-xs whitespace-nowrap">Jan 2026 - Present</span>
                    </div>
                    <div>
                      <p className="text-[#8b5cf6] text-sm">Boardy</p>
                    </div>
                    <p className="text-[#8a8a9a] text-sm mt-2">
                      Boardy Fellowship Fall 2025 · Expanding network and opportunities for Olunix
                    </p>
                  </div>
                </div>
              </motion.a>

              {/* Hope Bible Church */}
              <motion.a
                href="https://hopeoakville.ca"
                target="_blank"
                variants={fade}
                transition={{ duration: 0.5 }}
                className="glass rounded-xl p-5 block group"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1a2e] p-2">
                    <Image
                      src="/hope-logo.webp"
                      alt="Hope Bible Church"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg group-hover:text-[#8b5cf6] transition-colors">Intern</h3>
                        <ExternalLink size={14} className="text-[#6a6a7a] group-hover:text-[#8b5cf6] transition-colors flex-shrink-0" />
                      </div>
                      <span className="text-[#6a6a7a] text-xs whitespace-nowrap">Sep 2024 - Present</span>
                    </div>
                    <p className="text-[#8b5cf6] text-sm">Hope Bible Church</p>
                  </div>
                </div>
              </motion.a>

              {/* Habits Together */}
              <motion.a
                href="https://habitstogether.app/"
                target="_blank"
                variants={fade}
                transition={{ duration: 0.5 }}
                className="glass rounded-xl p-5 block group"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1a1a]">
                    <Image
                      src="/habits-together-logo.png"
                      alt="Habits Together"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg group-hover:text-[#8b5cf6] transition-colors">Habits Together</h3>
                        <ExternalLink size={14} className="text-[#6a6a7a] group-hover:text-[#8b5cf6] transition-colors flex-shrink-0" />
                      </div>
                      <span className="text-[#6a6a7a] text-xs whitespace-nowrap">Summer 2024</span>
                    </div>
                    <p className="text-[#8a8a9a] text-sm leading-relaxed">
                      A habit tracking app that helps you and your friends stay accountable and motivated to reach your goals. Built with a team of developers as an open-source project.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs px-2 py-1 rounded-md bg-[#8b5cf6]/10 text-[#8b5cf6]">Mobile App</span>
                      <span className="text-xs px-2 py-1 rounded-md bg-[#8b5cf6]/10 text-[#8b5cf6]">Open Source</span>
                    </div>
                  </div>
                </div>
              </motion.a>

              {/* Milton Toyota */}
              <motion.a
                href="https://miltontoyota.com"
                target="_blank"
                variants={fade}
                transition={{ duration: 0.5 }}
                className="glass rounded-xl p-5 block group"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white p-1.5">
                    <Image
                      src="/toyota-logo.png"
                      alt="Toyota"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg group-hover:text-[#8b5cf6] transition-colors">Customer Service Attendant</h3>
                        <ExternalLink size={14} className="text-[#6a6a7a] group-hover:text-[#8b5cf6] transition-colors flex-shrink-0" />
                      </div>
                      <span className="text-[#6a6a7a] text-xs whitespace-nowrap">Aug 2022 - Aug 2024</span>
                    </div>
                    <p className="text-[#8b5cf6] text-sm">Milton Toyota</p>
                    <p className="text-[#8a8a9a] text-sm mt-2">
                      2+ years in automotive customer service
                    </p>
                  </div>
                </div>
              </motion.a>

              {/* ZMS Media */}
              <motion.div variants={fade} transition={{ duration: 0.5 }} className="glass rounded-xl p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/zms-logo.svg"
                      alt="ZMS Media"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-1">
                      <div>
                        <h3 className="font-semibold text-lg">Founder & CEO</h3>
                        <p className="text-[#8b5cf6] text-sm">ZMS Media</p>
                      </div>
                      <span className="text-[#6a6a7a] text-xs whitespace-nowrap">2018 - 2021</span>
                    </div>
                    <p className="text-[#8a8a9a] text-sm">
                      Marketing
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="divider max-w-3xl mx-auto" />

      {/* Education */}
      <section id="education" className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.h2 variants={fade} transition={{ duration: 0.5 }} className="text-2xl font-bold mb-10">
              Education
            </motion.h2>

            <motion.a
              href="https://mcmaster.ca"
              target="_blank"
              variants={fade}
              transition={{ duration: 0.5 }}
              className="glass rounded-xl p-6 block group"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="/mcmaster-logo.png"
                    alt="McMaster University"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg group-hover:text-[#8b5cf6] transition-colors">McMaster University</h3>
                    <ExternalLink size={14} className="text-[#6a6a7a] group-hover:text-[#8b5cf6] transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-[#8b5cf6] text-sm mb-3">Automotive Engineering Technology</p>
                  <p className="text-[#8a8a9a] text-sm">
                    Final year · Combining mechanical engineering principles with automotive systems
                    for sustainable transportation solutions.
                  </p>
                </div>
              </div>
            </motion.a>
          </motion.div>
        </div>
      </section>

      <div className="divider max-w-3xl mx-auto" />

      {/* Articles */}
      <section id="articles" className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.h2 variants={fade} transition={{ duration: 0.5 }} className="text-2xl font-bold mb-10">
              Articles
            </motion.h2>

            <div className="space-y-6">
              {latestArticles.map((article, i) => (
                <ArticleCard key={article.slug} article={article} index={i} />
              ))}
            </div>

            {articles.length > 3 && (
              <motion.div variants={fade} transition={{ duration: 0.5 }} className="mt-8 text-center">
                <Link
                  href="/articles"
                  className="btn-secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm"
                >
                  View all articles
                  <ArrowUpRight size={16} />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <div className="divider max-w-3xl mx-auto" />

      {/* Contact */}
      <section id="contact" className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.h2 variants={fade} transition={{ duration: 0.5 }} className="text-2xl font-bold mb-10">
              Contact
            </motion.h2>
            <motion.a
              href="mailto:mina@olunix.com"
              variants={fade}
              transition={{ duration: 0.5 }}
              className="glass rounded-xl p-6 block group"
            >
              <p className="text-[#6a6a7a] text-sm mb-2">Email</p>
              <p className="text-lg text-white group-hover:text-[#8b5cf6] transition-colors">
                mina@olunix.com
              </p>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#5a5a6a] text-sm">
            &copy; {new Date().getFullYear()} Mina Mankarious
          </p>
          <div className="flex gap-4">
            <a href="https://linkedin.com/in/mina-mankarious" target="_blank" className="text-[#5a5a6a] hover:text-[#8b5cf6]">
              <LinkedInIcon size={18} />
            </a>
            <a href="https://x.com/minamnkarious" target="_blank" className="text-[#5a5a6a] hover:text-[#8b5cf6]">
              <XIcon size={18} />
            </a>
            <a href="https://olunix.com" target="_blank" className="text-[#5a5a6a] hover:text-[#8b5cf6]">
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
