'use client';
import LegacyPageLayout from "../components/LegacyPageLayout";

const intro = [
  "AFXOrbit (we, our, or us) respects your privacy and protects your personal information.",
  "This policy explains what we collect, how we use it, and your rights.",
];

const sections = [
  {
    heading: "Information We Collect",
    paragraphs: ["We may collect personal details when you contact us, request a quote, or purchase a service."],
    bullets: [
      "Full name, email address, phone number, business name",
      "Billing details when payment is required",
      "Technical data such as IP address, browser, and pages visited",
    ],
  },
  {
    heading: "How We Use Information",
    bullets: [
      "Respond to inquiries and deliver services",
      "Process payments and support requests",
      "Improve website performance and analytics",
      "Send service-related updates",
    ],
  },
  {
    heading: "Cookies and Tracking",
    paragraphs: ["We may use cookies and analytics tools to understand usage and improve user experience."],
  },
  {
    heading: "Third-Party Services",
    paragraphs: ["We may use third-party providers for hosting, analytics, and payments."],
    bullets: ["Examples: Stripe, PayPal, Google Analytics"],
  },
  {
    heading: "Data Rights",
    paragraphs: ["You can request access, correction, or deletion of your data by contacting us."],
    bullets: ["Email: contact@afxorbit.com", "Website: afxorbit.com"],
  },
];

export default function PrivacyPage() {
  return <LegacyPageLayout title="Privacy Policy" updated="March 6, 2026" intro={intro} sections={sections} />;
}
