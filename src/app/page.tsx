import React from "react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    icon: "/images/icon-topup.png",
    title: "Mobile Topup",
    description: "Instant topup for Aliv, BTC, Digicel, and Natcom carriers across The Bahamas.",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: "/images/icon-giftcards.png",
    title: "Digital Gift Cards",
    description: "Purchase iTunes, PlayStation, Xbox, and more digital gift cards instantly.",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    icon: "/images/icon-billpay.png",
    title: "Bill Pay",
    description: "Pay your bills conveniently through our secure platform.",
    gradient: "from-orange-500 to-amber-600",
  },
];

const features = [
  { text: "Mobile topup for Aliv, BTC, Digicel, Natcom", icon: "phone" },
  { text: "Digital gift cards (iTunes, PlayStation, Xbox)", icon: "gift" },
  { text: "Jail funds (inmate deposits)", icon: "wallet" },
  { text: "Become a merchant today", icon: "store" },
];

const FeatureIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    gift: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />,
    wallet: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    store: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
  };
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icons[type]}
    </svg>
  );
};

const WaveDivider = ({ fill = "#fffcf7", flip = false }: { fill?: string; flip?: boolean }) => (
  <div className={`wave-divider ${flip ? 'wave-divider-top' : ''}`}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        fill={fill}
        opacity=".25"
      />
      <path
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
        fill={fill}
        opacity=".5"
      />
      <path
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,googletag172.46-45.71,248.8-84.81V0Z"
        fill={fill}
      />
    </svg>
  </div>
);

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        >
          {/* Multi-layer gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-emerald-900/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fffcf7] via-transparent to-transparent" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#7cb342]/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-float delay-300" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-float delay-500" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              {/* Logo & Title */}
              <div className="animate-fade-in-up flex items-center justify-center lg:justify-start gap-5 mb-8">
                <div className="relative">
                  <Image
                    src="/images/logo.png"
                    alt="Mobile Go Bahamas"
                    width={100}
                    height={88}
                    className="w-auto h-24 drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-[#7cb342]/30 blur-2xl rounded-full animate-pulse-glow" />
                </div>
                <div>
                  <h1 className="font-[family-name:var(--font-syne)] text-5xl sm:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
                    MOBILE GO
                  </h1>
                  <p className="text-white/60 text-sm font-medium tracking-widest uppercase mt-1">
                    Bahamas
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <p className="animate-fade-in-up delay-100 text-xl sm:text-2xl text-white/90 mb-10 font-light leading-relaxed">
                Your all-in-one digital services platform for{" "}
                <span className="text-[#7cb342] font-semibold">The Bahamas</span>
              </p>

              {/* Features List */}
              <ul className="space-y-4 mb-10">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className={`animate-fade-in-up delay-${(index + 2) * 100} flex items-center gap-4 text-white/90`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#7cb342] to-[#558b2f] flex items-center justify-center shadow-lg shadow-[#7cb342]/25">
                      <FeatureIcon type={feature.icon} />
                    </div>
                    <span className="text-lg font-medium">{feature.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="animate-fade-in-up delay-600 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/inquiry"
                  className="btn-glow group inline-flex items-center justify-center px-8 py-4 bg-[#7cb342] hover:bg-[#558b2f] text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-[#7cb342]/30"
                >
                  Become a Merchant
                  <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="#services"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  Explore Services
                  <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right: App Store Links */}
            <div className="animate-scale-in delay-300 flex flex-col items-center gap-8">
              <div className="glass-card-dark rounded-3xl p-8 text-center max-w-sm">
                <p className="text-white/90 text-xl font-semibold mb-2 font-[family-name:var(--font-syne)]">
                  Download the App
                </p>
                <p className="text-white/60 text-sm mb-6">
                  Available on iOS and Android
                </p>
                <div className="flex flex-col gap-4">
                  <a
                    href="https://apps.apple.com/app/mobile-go-bahamas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-3 px-6 py-4 bg-white text-slate-900 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs text-slate-500">Download on the</div>
                      <div className="text-lg font-bold -mt-0.5">App Store</div>
                    </div>
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.mgobahamas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-3 px-6 py-4 bg-white text-slate-900 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs text-slate-500">GET IT ON</div>
                      <div className="text-lg font-bold -mt-0.5">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <WaveDivider />
      </section>

      {/* Our Story Section */}
      <section id="about" className="relative py-24 gradient-mesh noise-overlay">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Logo with floating effect */}
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="Mobile Go Bahamas"
                  width={320}
                  height={283}
                  className="w-auto h-56 sm:h-72 animate-float drop-shadow-2xl"
                />
                <div className="absolute -inset-8 bg-gradient-to-br from-[#7cb342]/20 to-sky-500/10 rounded-full blur-3xl -z-10" />
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-[#7cb342]/10 text-[#558b2f] text-sm font-semibold mb-6 tracking-wide uppercase">
                Our Story
              </span>
              <h2 className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Changing How{" "}
                <span className="text-gradient">The Bahamas</span>{" "}
                Connects
              </h2>
              <div className="space-y-5 text-slate-600 text-lg leading-relaxed">
                <p>
                  Every groundbreaking app begins with a series of small ideas that are combined into an all-inclusive one. At Mobile Go Bahamas, we wanted to change how consumers see the concept of Mobile Topup and Digital Vouchers.
                </p>
                <p>
                  We envisioned a platform that makes these services accessible to everyone, providing a seamless and user-friendly experience that caters to the needs of Bahamians and visitors alike.
                </p>
                <p className="font-semibold text-slate-800 text-xl">
                  Use your Mobile Go daily to make life one step easier for you and family!
                </p>
              </div>
              <Link
                href="/inquiry"
                className="btn-glow inline-flex items-center justify-center mt-10 px-8 py-4 bg-[#7cb342] hover:bg-[#558b2f] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-[#7cb342]/25 hover:shadow-[#7cb342]/40"
              >
                Join Our Network
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product & Services Section */}
      <section id="services" className="relative py-24 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/images/services-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-emerald-900/80" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#7cb342]/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-sky-500/10 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-[#7cb342] text-sm font-semibold mb-6 tracking-wide uppercase backdrop-blur-sm">
              What We Offer
            </span>
            <h2 className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Product & Services
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Everything you need to stay connected and manage your digital transactions in one convenient app.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card glass-card-dark rounded-3xl p-8 text-center group"
              >
                {/* Icon Container */}
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={48}
                    height={48}
                    className="w-12 h-12 brightness-0 invert"
                  />
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {/* Jail Funds Feature */}
          <div className="mt-16 text-center">
            <div className="inline-block glass-card-dark rounded-3xl px-12 py-8 max-w-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white mb-3">
                Jail Funds (Inmate Deposits)
              </h3>
              <p className="text-white/70">
                Easily deposit funds for inmates at correctional facilities across The Bahamas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7cb342] via-[#65a30d] to-[#0ea5e9]" />

        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl sm:text-2xl text-white/90 mb-12 font-light">
            Download the Mobile Go Bahamas app today or become a merchant partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/inquiry"
              className="group inline-flex items-center justify-center px-10 py-5 bg-white text-[#558b2f] font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25"
            >
              Become a Merchant
              <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="mailto:info@mgobahamas.com"
              className="group inline-flex items-center justify-center px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-2xl transition-all duration-300 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
