import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accessibility,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Cloud,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Lock,
  Menu,
  Smartphone,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const DIGI_LOGO =
  "https://digilockergovin-tu6.caffeine.xyz/assets/uploads/digi_logo_copy-removebg-preview-019d32f5-1b26-744b-ac87-a57a710500be-2.png";
const _HERO_BG =
  "https://digilockergovin-tu6.caffeine.xyz/assets/uploads/hd-wallpaper-satyamev-jayate-bharat-civil-service-history-ias-india-indian-ips-lion-emblem-motivatio-019d32f5-1841-736f-bc00-cb53f3681824-1.jpg";
const ISO_LOGO =
  "https://digilockergovin-tu6.caffeine.xyz/assets/uploads/logo_iso-removebg-preview-019d32f5-1b4b-73dd-a1a9-145927dd6b1a-3.png";
const INDIA_FLAG =
  "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg";

// Dynamic record map — update URLs here to add/change documents
const VERIFIED_RECORDS: Record<
  string,
  { docType: string; label: string; documentUrl: string }
> = {
  "220504250731|Degree Certificate": {
    docType: "Degree Certificate",
    label: "Degree Verified",
    documentUrl:
      "/assets/degree_verified-019d48b4-e5b7-74db-a133-6ce10e2c96f8.jpeg",
  },
  // Add more entries like: "ROLLNUMBER|10th Marksheet": { ... }
};

const slides = [
  { image: "/assets/generated/photo_digi1.png" },
  { image: "/assets/generated/photo_digi2.png" },
];

const features = [
  {
    icon: Lock,
    title: "Secure",
    desc: "Military-grade encryption protects all your documents.",
  },
  {
    icon: CheckCircle,
    title: "Legally Valid",
    desc: "Documents issued through DigiLocker are legally on par with originals.",
  },
  {
    icon: Accessibility,
    title: "Accessible",
    desc: "Designed for all citizens with WCAG 2.1 compliance.",
  },
  {
    icon: Globe,
    title: "Multilingual",
    desc: "Available in all 22 scheduled languages of India.",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    desc: "Available on Android, iOS, and web browsers.",
  },
  {
    icon: Cloud,
    title: "Cloud Backed",
    desc: "Documents are backed up on NIC cloud infrastructure.",
  },
];

const milestones = [
  {
    year: "2015",
    text: "DigiLocker launched as part of Digital India initiative",
  },
  {
    year: "2017",
    text: "Integration with Aadhaar eKYC for seamless verification",
  },
  { year: "2020", text: "Crossed 50 million registered users" },
  { year: "2023", text: "200 million+ users, 1 billion+ documents issued" },
  { year: "2024", text: "AI-powered document verification launched" },
];

const documentTypes = [
  { name: "Aadhaar Card", issuer: "UIDAI", icon: "🪪" },
  { name: "PAN Card", issuer: "Income Tax Department", icon: "💳" },
  { name: "Passport", issuer: "Ministry of External Affairs", icon: "📕" },
  { name: "Driving License", issuer: "Ministry of Road Transport", icon: "🚗" },
  { name: "Birth Certificate", issuer: "Municipal Corporation", icon: "📄" },
  { name: "Marksheet", issuer: "CBSE Board", icon: "📋" },
  {
    name: "Income Tax Certificate",
    issuer: "Income Tax Department",
    icon: "📊",
  },
  { name: "Electricity Bills", issuer: "JVVNL Limited", icon: "⚡" },
];

const verifyDocumentTypes = [
  "Degree Certificate",
  "10th Marksheet",
  "12th Migration Marksheet",
];

const issuers = [
  { name: "Ministry of External Affairs", type: "Central Government" },
  { name: "CBSE Board", type: "Central Board of Secondary Education" },
  { name: "Income Tax Department", type: "Ministry of Finance" },
  { name: "Ministry of Road Transport", type: "Central Government" },
  { name: "Passport Seva", type: "MEA" },
  { name: "Municipal Corporation", type: "Urban Local Body" },
  { name: "Urban Local Bodies", type: "State Government" },
  { name: "State Reserve Police Force", type: "State Government" },
  { name: "Jaipur Vidyut Vitran Nigam", type: "JVVNL" },
];

interface HomePageProps {
  onNavigateDashboard: () => void;
}

export default function HomePage({ onNavigateDashboard }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verifyDocType, setVerifyDocType] = useState("");
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState<
    null | "failed" | { label: string; documentUrl: string; docType: string }
  >(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { login, loginStatus, identity } = useInternetIdentity();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goSlide = (dir: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentSlide((prev) => (prev + dir + slides.length) % slides.length);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const handleLogin = async () => {
    if (identity) {
      onNavigateDashboard();
    } else {
      await login();
    }
  };

  useEffect(() => {
    if (loginStatus === "success" && identity) {
      onNavigateDashboard();
    }
  }, [loginStatus, identity, onNavigateDashboard]);

  const handleVerify = () => {
    if (!verifyDocType.trim() || !verifyId.trim()) return;
    const key = `${verifyId.trim()}|${verifyDocType}`;
    const record = VERIFIED_RECORDS[key];
    if (record) {
      setVerifyResult({
        label: record.label,
        documentUrl: record.documentUrl,
        docType: record.docType,
      });
      return;
    }
    setVerifyResult("failed");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Message sent successfully! We'll respond within 2 business days.",
    );
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Government Bar */}
      <div className="gov-blue-bg text-white py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={INDIA_FLAG}
              alt="India Flag"
              className="w-5 h-4 object-cover"
            />
            <span className="font-medium">Government of India</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">A- A A+</span>
            <span className="hidden sm:inline">|</span>
            <select className="bg-transparent text-white text-xs border-none outline-none cursor-pointer">
              <option value="en" className="text-black">
                English
              </option>
              <option value="hi" className="text-black">
                हिन्दी
              </option>
            </select>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline cursor-pointer hover:underline">
              Screen Reader Access
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollTo("hero")}
            className="flex items-center"
          >
            <img
              src={DIGI_LOGO}
              alt="DigiLocker"
              className="h-12 object-contain"
            />
          </button>
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium"
            data-ocid="main.nav"
          >
            <button
              type="button"
              onClick={() => scrollTo("hero")}
              className="gov-blue-text hover:text-orange-500 transition-colors"
              data-ocid="nav.home.link"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollTo("about")}
              className="gov-blue-text hover:text-orange-500 transition-colors"
              data-ocid="nav.about.link"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="gov-blue-text hover:text-orange-500 transition-colors"
              data-ocid="nav.contact.link"
            >
              Contact Us
            </button>
            <Button
              onClick={handleLogin}
              disabled={loginStatus === "logging-in"}
              className="rounded-full px-5 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "#003366" }}
              data-ocid="nav.login.button"
            >
              {loginStatus === "logging-in"
                ? "Logging in..."
                : identity
                  ? "My DigiLocker"
                  : "Login / Register"}
            </Button>
          </nav>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-ocid="nav.menu.toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-3 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => scrollTo("hero")}
                  className="gov-blue-text text-left"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("about")}
                  className="gov-blue-text text-left"
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("contact")}
                  className="gov-blue-text text-left"
                >
                  Contact Us
                </button>
                <Button
                  onClick={handleLogin}
                  className="rounded-full text-white w-full"
                  style={{ backgroundColor: "#003366" }}
                  data-ocid="mobile.login.button"
                >
                  {identity ? "My DigiLocker" : "Login / Register"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Carousel */}
      <section
        id="hero"
        className="relative overflow-hidden"
        style={{ height: 340 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide].image}
            alt={`Slide ${currentSlide + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full object-cover block"
            style={{ height: 340 }}
          />
        </AnimatePresence>
        <button
          type="button"
          onClick={() => goSlide(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          data-ocid="hero.pagination_prev"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => goSlide(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          data-ocid="hero.pagination_next"
        >
          <ChevronRight size={20} />
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: slide index is stable
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentSlide ? "bg-orange-500" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <div className="gov-blue-bg text-white py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-blue-500">
          {[
            { num: "200M+", label: "Registered Users" },
            { num: "1B+", label: "Documents Issued" },
            { num: "10,000+", label: "Document Issuers" },
          ].map((stat, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: stat index stable
            <div key={i} className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold gov-orange-text">
                {stat.num}
              </div>
              <div className="text-sm mt-1 text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why DigiLocker */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center gov-blue-text mb-2">
            Why DigiLocker?
          </h2>
          <div
            className="w-16 h-1 mx-auto mb-10"
            style={{ backgroundColor: "#F4811F" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: feature index stable
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow hover:border-blue-200"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#003366" }}
                >
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg gov-blue-text mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About DigiLocker */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center gov-blue-text mb-2">
            About DigiLocker
          </h2>
          <div
            className="w-16 h-1 mx-auto mb-10"
            style={{ backgroundColor: "#F4811F" }}
          />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-700 mb-4">
                DigiLocker is a flagship initiative of the Ministry of
                Electronics &amp; IT (MeitY) under the Digital India Programme.
                It aims at transforming India into a digitally empowered society
                and knowledge economy.
              </p>
              <p className="text-gray-700 mb-4">
                DigiLocker is a platform for issuance and verification of
                documents &amp; certificates digitally. It enables citizens to
                store, share and verify their documents and certificates
                digitally. This reduces administrative overhead of government
                agencies and provides ease of service delivery to citizens.
              </p>
              <p className="text-gray-700 mb-6">
                The goal is to eliminate the use of physical documents and
                enable sharing of e-documents across government agencies.
              </p>
              <Button
                onClick={() => scrollTo("hero")}
                className="rounded px-6 py-2 text-white"
                style={{ backgroundColor: "#003366" }}
                data-ocid="about.explore.button"
              >
                Explore DigiLocker
              </Button>
            </div>
            <div className="flex flex-col items-center gap-6">
              <img
                src={ISO_LOGO}
                alt="ISO Certification"
                className="h-32 object-contain"
              />
              <p className="text-center font-semibold gov-blue-text">
                ISO 27001:2022 and ISO 27034 Certified
              </p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold gov-orange-text">
                    200M+
                  </div>
                  <div className="text-xs text-gray-600">Registered Users</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold gov-orange-text">1B+</div>
                  <div className="text-xs text-gray-600">Documents Issued</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center gov-blue-text mb-2">
            Documents in Your Wallet
          </h2>
          <div
            className="w-16 h-1 mx-auto mb-10"
            style={{ backgroundColor: "#F4811F" }}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {documentTypes.map((doc, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: doc index stable
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
              >
                <div className="text-3xl mb-2">{doc.icon}</div>
                <div className="font-semibold text-sm gov-blue-text">
                  {doc.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">{doc.issuer}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 gov-dark-bg text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Our Journey</h2>
          <div className="w-16 h-1 mx-auto mb-10 bg-orange-500" />
          <div className="relative border-l-2 border-orange-500 ml-4 md:ml-8">
            {milestones.map((m, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: milestone index stable
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8 pb-8 timeline-item"
              >
                <div className="font-bold text-orange-400 text-lg">
                  {m.year}
                </div>
                <div className="text-gray-200 text-sm mt-1">{m.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Issuers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center gov-blue-text mb-2">
            Document Issuers
          </h2>
          <div
            className="w-16 h-1 mx-auto mb-10"
            style={{ backgroundColor: "#F4811F" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {issuers.map((issuer) => (
              <div
                key={issuer.name}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: "#003366" }}
                >
                  <span className="text-white font-bold text-sm">
                    {issuer.name[0]}
                  </span>
                </div>
                <div className="font-semibold text-sm gov-blue-text">
                  {issuer.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">{issuer.type}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verify Document */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center gov-blue-text mb-2">
            Verify a Document
          </h2>
          <div
            className="w-16 h-1 mx-auto mb-10"
            style={{ backgroundColor: "#F4811F" }}
          />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <p className="text-gray-600 text-sm mb-6">
              Select document type and enter the Roll Number to verify its
              authenticity
            </p>

            {/* Document Type Dropdown */}
            <div className="mb-4">
              <label
                htmlFor="verify-doc-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                id="verify-doc-type"
                value={verifyDocType}
                onChange={(e) => {
                  setVerifyDocType(e.target.value);
                  setVerifyResult(null);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-ocid="verify.select"
              >
                <option value="">-- Select Document Type --</option>
                {verifyDocumentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Roll Number Input — only shown for Degree Certificate */}
            {verifyDocType === "Degree Certificate" && (
              <div className="flex gap-3">
                <Input
                  value={verifyId}
                  onChange={(e) => {
                    setVerifyId(e.target.value);
                    setVerifyResult(null);
                  }}
                  placeholder="Enter Roll Number"
                  className="flex-1"
                  data-ocid="verify.input"
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                />
                <Button
                  type="button"
                  onClick={handleVerify}
                  style={{ backgroundColor: "#003366" }}
                  className="text-white px-6"
                  data-ocid="verify.submit_button"
                >
                  Verify
                </Button>
              </div>
            )}

            {/* For 10th / 12th — always show not verified */}
            {(verifyDocType === "10th Marksheet" ||
              verifyDocType === "12th Migration Marksheet") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200"
                data-ocid="verify.error_state"
              >
                ❌ Not Verified — Record Not Found.
              </motion.div>
            )}

            {!verifyDocType && verifyId && (
              <p className="mt-2 text-xs text-red-500">
                Please select a document type first.
              </p>
            )}

            <AnimatePresence>
              {/* Failed state for Degree Certificate */}
              {verifyResult === "failed" &&
                verifyDocType === "Degree Certificate" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-4 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200"
                    data-ocid="verify.error_state"
                  >
                    ❌ Not Verified — Record Not Found.
                  </motion.div>
                )}

              {/* Success state — show verified banner + View Document button */}
              {verifyResult !== null &&
                verifyResult !== "failed" &&
                typeof verifyResult === "object" && (
                  <motion.div
                    key="verify-success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 rounded-lg overflow-hidden border border-green-200"
                    data-ocid="verify.success_state"
                  >
                    {/* Green success banner */}
                    <div className="bg-green-50 px-4 py-3 border-b border-green-200">
                      <p className="text-green-700 text-sm font-semibold">
                        ✅ {verifyResult.label} — Record Verified Successfully.
                      </p>
                    </div>
                    {/* Certificate type + action */}
                    <div className="bg-white px-4 py-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">
                          Certificate Type
                        </p>
                        <p className="text-sm font-semibold gov-blue-text">
                          {verifyResult.docType}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            verifyResult.documentUrl,
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-white text-sm font-medium transition-colors"
                        style={{ backgroundColor: "#003366" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#004488";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#003366";
                        }}
                        data-ocid="verify.primary_button"
                      >
                        <ExternalLink size={15} />
                        View Document
                      </button>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Download App */}
      <section
        className="py-16"
        style={{
          background: "linear-gradient(135deg, #F4811F 0%, #e06b0c 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Download DigiLocker App
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Access your documents anywhere, anytime
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
              data-ocid="app.play_store.button"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <title>Google Play</title>
                <path d="M3.18 23.76c.29.17.63.19.94.07l12.33-7.12-2.64-2.64L3.18 23.76zm-1.1-1.82V2.06L13.6 12 2.08 21.94zM20.4 10.06l-2.45-1.42-2.91 2.91 2.91 2.91 2.47-1.42c.7-.4.7-1.57-.02-1.98zM4.12.17c-.31-.12-.65-.1-.94.07l10.63 9.69-2.64 2.64L4.12.17z" />
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-80">GET IT ON</div>
                <div className="font-semibold">Google Play</div>
              </div>
            </a>
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
              data-ocid="app.app_store.button"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <title>App Store</title>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-80">DOWNLOAD ON THE</div>
                <div className="font-semibold">App Store</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center gov-blue-text mb-2">
            Contact Us
          </h2>
          <div
            className="w-16 h-1 mx-auto mb-10"
            style={{ backgroundColor: "#F4811F" }}
          />
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold gov-blue-text mb-4">
                Get in Touch
              </h3>
              <p className="text-gray-600 mb-3">
                We're here to help. Reach out to us anytime.
              </p>
              <p className="text-gray-600 mb-6">
                We'll respond within 2 business days.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#003366" }}
                  >
                    <span className="text-white text-sm">@</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium gov-blue-text">
                      support@digilocker.gov.in
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#003366" }}
                  >
                    <span className="text-white text-sm">📞</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Helpline</div>
                    <div className="font-medium gov-blue-text">
                      1800-111-555
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <form
              onSubmit={handleContactSubmit}
              className="space-y-4"
              data-ocid="contact.panel"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Name
                  </label>
                  <Input
                    id="contact-name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    placeholder="Your Name"
                    required
                    data-ocid="contact.name.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Email
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    required
                    data-ocid="contact.email.input"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact-subject"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Subject
                </label>
                <Input
                  id="contact-subject"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  placeholder="Subject"
                  required
                  data-ocid="contact.subject.input"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  placeholder="Your message..."
                  rows={4}
                  required
                  data-ocid="contact.message.textarea"
                />
              </div>
              <Button
                type="submit"
                style={{ backgroundColor: "#003366" }}
                className="text-white w-full rounded"
                data-ocid="contact.submit_button"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gov-dark-bg text-white pt-12 pb-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10">
            <div className="md:col-span-2">
              <img
                src={DIGI_LOGO}
                alt="DigiLocker"
                className="h-14 object-contain mb-4 brightness-0 invert"
              />
              <p className="text-gray-400 text-sm leading-relaxed">
                DigiLocker aims at 'Digital Empowerment' by providing access to
                authentic digital documents to the citizen's digital document
                wallet.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <img
                  src={ISO_LOGO}
                  alt="ISO"
                  className="h-10 object-contain brightness-0 invert opacity-70"
                />
                <span className="text-xs text-gray-400">
                  ISO 27001:2022 and ISO 27034 Certified
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {[
                  "Home",
                  "About Us",
                  "FAQ",
                  "Sitemap",
                  "DigiLocker Policy",
                  "Terms & Condition of Use",
                ].map((l) => (
                  <li key={l}>
                    <button
                      type="button"
                      className="hover:text-orange-400 transition-colors text-left"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {["Circulars", "Feedback", "Helpline", "Various Services"].map(
                  (l) => (
                    <li key={l}>
                      <button
                        type="button"
                        className="hover:text-orange-400 transition-colors text-left"
                      >
                        {l}
                      </button>
                    </li>
                  ),
                )}
              </ul>
              <h4 className="font-semibold text-white mb-4 mt-6">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    type="button"
                    className="hover:text-orange-400 transition-colors"
                  >
                    MeriPehchaan
                  </button>
                </li>
                <li>
                  <a
                    href="https://digitalindia.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 transition-colors inline-flex items-center gap-1"
                  >
                    Digital India <ExternalLink size={10} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://india.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 transition-colors inline-flex items-center gap-1"
                  >
                    India.gov.in <ExternalLink size={10} />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Twitter, label: "Twitter" },
                  { icon: Instagram, label: "Instagram" },
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Youtube, label: "YouTube" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="https://digilocker.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F4811F";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255,255,255,0.1)";
                    }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-gray-400">
              <div>
                <p>
                  Copyright &copy; {new Date().getFullYear()}, Website
                  maintained by{" "}
                  <a
                    href="https://negd.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 inline-flex items-center gap-0.5"
                  >
                    National eGovernance Division (NeGD){" "}
                    <ExternalLink size={10} />
                  </a>
                </p>
                <p className="mt-1">Last Updated: March 10, 2026</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://digitalindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400"
                >
                  Digital India
                </a>
                <span>|</span>
                <button type="button" className="hover:text-orange-400">
                  MeriPehchaan
                </button>
                <span>|</span>
                <a
                  href="https://digilocker.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400"
                >
                  digilocker.gov.in
                </a>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Ministry of Electronics &amp; IT (MeitY) | Digital India
              Corporation | Government of India
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
