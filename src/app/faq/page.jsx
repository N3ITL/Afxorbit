import FaqPage from "../../content/FaqPage";

export const metadata = {
  title: "FAQ | AFXoRBIT",
  description: "Answers to common questions about AFXoRBIT services, timelines, pricing, SEO, website redesign, and support.",
  alternates: { canonical: "/faq" },
  openGraph: { url: "https://afxorbit.com/faq" },
};

export default function Page() {
  return <FaqPage />;
}
