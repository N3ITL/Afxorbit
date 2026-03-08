import LegacyPageLayout from "../components/LegacyPageLayout";

const intro = [
  "By using this website, you agree to these terms and conditions.",
  "If you do not agree, please do not use the website or services.",
];

const sections = [
  {
    heading: "Use of Website",
    paragraphs: ["You agree to use this website lawfully and not interfere with security or availability."],
  },
  {
    heading: "Project Scope and Payments",
    paragraphs: ["Scope, timeline, and pricing are defined in project agreements."],
    bullets: ["Out-of-scope work may require additional approval and fees"],
  },
  {
    heading: "Intellectual Property",
    paragraphs: ["Content and assets remain property of their respective owners unless agreed otherwise in writing."],
  },
  {
    heading: "Contact",
    bullets: ["Email: contact@afxorbit.com", "Website: afxorbit.com"],
  },
];

export default function TermsPage() {
  return <LegacyPageLayout title="Terms and Conditions" updated="March 6, 2026" intro={intro} sections={sections} />;
}
