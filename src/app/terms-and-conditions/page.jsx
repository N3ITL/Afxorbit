import TermsPage from "../../content/TermsPage";

export const metadata = {
  title: "Terms and Conditions | AFXoRBIT",
  description: "Read the terms and conditions for using AFXoRBIT website and services.",
  alternates: { canonical: "/terms-and-conditions" },
  openGraph: { url: "https://afxorbit.com/terms-and-conditions" },
};

export default function Page() {
  return <TermsPage />;
}
