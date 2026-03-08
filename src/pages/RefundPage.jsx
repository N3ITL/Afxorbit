import LegacyPageLayout from "../components/LegacyPageLayout";

const intro = [
  "Because our services are custom digital work, refunds are limited and depend on project stage.",
  "This page explains refund rules for projects and monthly services.",
];

const sections = [
  {
    heading: "Website Projects",
    paragraphs: ["Website projects normally require a non-refundable deposit before work begins."],
    bullets: [
      "Before work begins: full refund may be possible",
      "After work starts: deposit is non-refundable",
      "After completion: no refund is issued",
    ],
  },
  {
    heading: "Monthly Services",
    paragraphs: ["SEO or maintenance plans can be canceled before the next billing cycle."],
    bullets: ["No partial refund for active billing period", "Performance outcomes are not guaranteed"],
  },
  {
    heading: "Custom Integrations and Automation",
    paragraphs: ["Custom setup and delivered files are non-refundable once implementation starts."],
  },
  {
    heading: "Disputes",
    paragraphs: ["Please contact us first for any billing issue before filing a chargeback."],
    bullets: ["Email: contact@afxorbit.com", "Website: afxorbit.com"],
  },
];

export default function RefundPage() {
  return <LegacyPageLayout title="Refund Policy" updated="March 6, 2026" intro={intro} sections={sections} />;
}
