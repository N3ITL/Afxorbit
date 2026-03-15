import PrivacyPage from "../../content/PrivacyPage";

export const metadata = {
  title: "Privacy Policy | AFXoRBIT",
  description: "Read the AFXoRBIT privacy policy to understand how information is collected, used, and protected.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "https://afxorbit.com/privacy" },
};

export default function Page() {
  return <PrivacyPage />;
}
