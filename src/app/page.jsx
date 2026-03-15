import HomeContent from "../components/HomeContent";

export const metadata = {
  title: "AFXoRBIT | Web Design, SEO, and Growth Systems",
  description: "AFXoRBIT builds high-performance websites, SEO-ready pages, and automation systems that help businesses generate leads and grow.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "https://afxorbit.com/",
  },
};

export default function Page() {
  return <HomeContent />;
}
