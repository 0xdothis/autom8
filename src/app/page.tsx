'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Link from "next/link";
import HowItWorks from "../components/landing/HowItWorksSection";
import { Footer } from "../components/layout/Footer";
import WalletConnect from '@/components/WalletConnect';

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
<section className="relative overflow-hidden min-h-screen flex items-center" data-aos="fade-up" data-aos-delay="100">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/5" data-aos="fade-in" data-aos-delay="200">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-lg animate-pulse" data-aos="zoom-in" data-aos-delay="300"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/40 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s' }} data-aos="zoom-in" data-aos-delay="400"></div>
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-accent/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} data-aos="zoom-in" data-aos-delay="500"></div>
            <div className="absolute bottom-20 right-10 w-28 h-28 bg-primary/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '0.5s' }} data-aos="zoom-in" data-aos-delay="600"></div>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
          <div className="text-center fade-in" data-aos="fade-up" data-aos-delay="300">
            {/* Cool Blinking Animation instead of Wallet Connect Preview */}
            <div className="mb-6 sm:mb-8" data-aos="fade-down" data-aos-delay="400">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary animate-pulse">
                Blockchain-Powered Event Platform
              </h2>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight" data-aos="fade-up" data-aos-delay="500">
              Welcome to{" "}
              <span className="relative inline-block">
                Evenntz
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/70 max-w-2xl sm:max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4" data-aos="fade-up" data-aos-delay="600">
              Create events, sell NFT tickets, manage workers, and accept sponsorships—all powered by smart contracts on Lisk blockchain.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4" data-aos="fade-up" data-aos-delay="700">
              <Link
                href="/events"
                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 group w-full sm:w-auto animate-pulse hover:animate-none"
                data-aos="zoom-in" data-aos-delay="800"
              >
                <span>Explore Events</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link href="/contract-dashboard" className="btn-primary">Host Events</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-foreground/2" data-aos="fade-up">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 fade-in" data-aos="fade-down">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Why Choose Evenntz?
            </h2>
            <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto px-4">
              Experience the next generation of event management with blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="card p-6 sm:p-8 text-center group hover:scale-105 transition-all duration-300 slide-in" data-aos="fade-up" data-aos-delay="100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">NFT Tickets</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                ERC721 NFT tickets minted on purchase—each ticket is a unique, verified blockchain asset
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6 sm:p-8 text-center group hover:scale-105 transition-all duration-300 slide-in" data-aos="fade-up" data-aos-delay="200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Worker Payroll</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Add workers to events, set salaries, and automate payments after event completion
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6 sm:p-8 text-center group hover:scale-105 transition-all duration-300 slide-in" data-aos="fade-up" data-aos-delay="300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Sponsorship System</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Accept sponsors who contribute funds and earn percentage-based returns from event revenue
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-6 sm:p-8 text-center group hover:scale-105 transition-all duration-300 slide-in" data-aos="fade-up" data-aos-delay="400">
              <div className="w-14 h-14 sm:w-16 sm:h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Smart Contract Security</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Upgradeable UUPS contracts with Factory→Proxy→Implementation pattern for maximum security
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24" data-aos="fade-up">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-8 sm:p-10 lg:p-12 fade-in" data-aos="zoom-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Connect your wallet to create your organization proxy, launch events, manage teams, and accept sponsorships—all on-chain
            </p>

            {/* Wallet Connect Integration */}
            <div className="mb-6 sm:mb-8">
              <WalletConnect className="justify-center" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/events"
                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
              >
                Start Exploring
              </Link>
              <Link
                href="/contract-dashboard/create"
                className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
              >
                Create Organization
              </Link>
            </div>

            {/* Platform Stats */}
            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">ERC721</p>
                <p className="text-sm text-foreground/60">NFT Tickets</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">Lisk</p>
                <p className="text-sm text-foreground/60">Blockchain</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">UUPS</p>
                <p className="text-sm text-foreground/60">Upgradeable</p>
              </div>
            </div>

            {/* Demo coming soon section removed - replaced with platform info */}
            <div className="mt-8 sm:mt-10">
              <div className="glass-card p-6 rounded-lg">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">How It Works</h3>
                  <p className="text-sm text-foreground/70 mb-4">Simple 4-step process:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
                    <div className="glass p-3 rounded">
                      <p className="font-semibold text-primary mb-1">1. Create Proxy</p>
                      <p className="text-foreground/60">Deploy your organization</p>
                    </div>
                    <div className="glass p-3 rounded">
                      <p className="font-semibold text-primary mb-1">2. Launch Event</p>
                      <p className="text-foreground/60">Set price & capacity</p>
                    </div>
                    <div className="glass p-3 rounded">
                      <p className="font-semibold text-primary mb-1">3. Sell Tickets</p>
                      <p className="text-foreground/60">NFTs minted on purchase</p>
                    </div>
                    <div className="glass p-3 rounded">
                      <p className="font-semibold text-primary mb-1">4. Process Payments</p>
                      <p className="text-foreground/60">Workers & sponsors paid</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
