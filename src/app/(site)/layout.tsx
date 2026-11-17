import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollTop from "@/components/ScrollTop";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <ScrollTop />
    </>
  );
}
