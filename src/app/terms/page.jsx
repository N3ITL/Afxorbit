import TermsPage from "../../content/TermsPage";

export const metadata = {
  title: "Terms and Conditions | AFXoRBIT",
  description: "Read the terms and conditions for using AFXoRBIT website and services.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "https://afxorbit.com/terms" },
};

export default function Page() {
  return <TermsPage />;
}
