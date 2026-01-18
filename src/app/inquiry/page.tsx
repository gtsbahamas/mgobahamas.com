'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  island: string;
  message: string;
};

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  businessName: "",
  businessType: "",
  island: "",
  message: "",
};

const islands = [
  "New Providence",
  "Grand Bahama",
  "Abaco",
  "Eleuthera",
  "Exuma",
  "Long Island",
  "Andros",
  "Cat Island",
  "San Salvador",
  "Bimini",
  "Other",
];

const businessTypes = [
  "Retail Store",
  "Convenience Store",
  "Gas Station",
  "Restaurant/Bar",
  "Hotel/Resort",
  "Mobile Vendor",
  "Other",
];

const benefits = [
  { icon: "revenue", title: "Increase Revenue", description: "Add new income streams to your business" },
  { icon: "customers", title: "Attract Customers", description: "Bring more foot traffic to your location" },
  { icon: "support", title: "24/7 Support", description: "Our team is always here to help you succeed" },
];

const BenefitIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    revenue: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    customers: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    support: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />,
  };
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icons[type]}
    </svg>
  );
};

export default function InquiryPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(`${message}. Please try again or contact us directly at info@mgobahamas.com`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh py-20">
        <div className="max-w-md mx-auto px-4 text-center animate-fade-in-up">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#7cb342] to-[#558b2f] flex items-center justify-center shadow-2xl shadow-[#7cb342]/30 animate-pulse-glow">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-syne)] text-4xl font-bold text-slate-900 mb-4">
            Thank You!
          </h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Your merchant application has been submitted successfully. Our team will review your information and contact you within 24-48 hours.
          </p>
          <Link
            href="/"
            className="btn-glow inline-flex items-center justify-center px-8 py-4 bg-[#7cb342] hover:bg-[#558b2f] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-[#7cb342]/25"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7cb342] via-[#65a30d] to-[#0ea5e9]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20" />

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <Image
              src="/images/logo.png"
              alt="Mobile Go Bahamas"
              width={80}
              height={71}
              className="w-auto h-20 mx-auto mb-8 brightness-0 invert drop-shadow-lg"
            />
          </div>
          <h1 className="animate-fade-in-up delay-100 font-[family-name:var(--font-syne)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Become a Merchant
          </h1>
          <p className="animate-fade-in-up delay-200 text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto font-light">
            Join the Mobile Go Bahamas network and unlock new revenue streams for your business.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative -mt-12 z-20 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`animate-fade-in-up delay-${(index + 3) * 100} glass-card rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#7cb342] to-[#558b2f] flex items-center justify-center text-white shadow-lg shadow-[#7cb342]/20">
                  <BenefitIcon type={benefit.icon} />
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-bold text-slate-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 gradient-mesh">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-slate-900 mb-3">
                Merchant Application
              </h2>
              <p className="text-slate-600">
                Fill out the form below and our team will contact you within 24-48 hours.
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Row */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative">
                  <label
                    htmlFor="firstName"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      focusedField === 'firstName' || formData.firstName
                        ? '-top-2.5 text-xs bg-white px-2 text-[#7cb342] font-medium'
                        : 'top-4 text-slate-500'
                    }`}
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                    className="input-tropical w-full px-4 py-4 rounded-xl bg-white"
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="lastName"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      focusedField === 'lastName' || formData.lastName
                        ? '-top-2.5 text-xs bg-white px-2 text-[#7cb342] font-medium'
                        : 'top-4 text-slate-500'
                    }`}
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                    className="input-tropical w-full px-4 py-4 rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Contact Row */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      focusedField === 'email' || formData.email
                        ? '-top-2.5 text-xs bg-white px-2 text-[#7cb342] font-medium'
                        : 'top-4 text-slate-500'
                    }`}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="input-tropical w-full px-4 py-4 rounded-xl bg-white"
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="phone"
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      focusedField === 'phone' || formData.phone
                        ? '-top-2.5 text-xs bg-white px-2 text-[#7cb342] font-medium'
                        : 'top-4 text-slate-500'
                    }`}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className="input-tropical w-full px-4 py-4 rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Business Name */}
              <div className="relative">
                <label
                  htmlFor="businessName"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focusedField === 'businessName' || formData.businessName
                      ? '-top-2.5 text-xs bg-white px-2 text-[#7cb342] font-medium'
                      : 'top-4 text-slate-500'
                  }`}
                >
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('businessName')}
                  onBlur={() => setFocusedField(null)}
                  className="input-tropical w-full px-4 py-4 rounded-xl bg-white"
                />
              </div>

              {/* Business Type & Island */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-slate-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    required
                    value={formData.businessType}
                    onChange={handleChange}
                    className="input-tropical w-full px-4 py-4 rounded-xl bg-white appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
                  >
                    <option value="">Select a type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="island" className="block text-sm font-medium text-slate-700 mb-2">
                    Island *
                  </label>
                  <select
                    id="island"
                    name="island"
                    required
                    value={formData.island}
                    onChange={handleChange}
                    className="input-tropical w-full px-4 py-4 rounded-xl bg-white appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
                  >
                    <option value="">Select an island</option>
                    {islands.map((island) => (
                      <option key={island} value={island}>
                        {island}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="input-tropical w-full px-4 py-4 rounded-xl bg-white resize-none"
                  placeholder="Tell us about your business and why you want to become a Mobile Go merchant..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-glow w-full py-5 px-6 bg-gradient-to-r from-[#7cb342] to-[#558b2f] hover:from-[#558b2f] hover:to-[#7cb342] disabled:from-slate-400 disabled:to-slate-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-xl shadow-[#7cb342]/30 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Submit Application
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Contact Alternative */}
            <div className="mt-10 pt-8 border-t border-slate-200 text-center">
              <p className="text-slate-600">
                Prefer to reach out directly?{" "}
                <a
                  href="mailto:info@mgobahamas.com"
                  className="text-[#7cb342] hover:text-[#558b2f] font-semibold transition-colors"
                >
                  Email us at info@mgobahamas.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
