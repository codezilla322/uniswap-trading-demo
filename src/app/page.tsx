import Logo from "@/components/Logo";
import MainPanel from "@/components/MainPanel";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex items-center flex-col">
      <Logo />
      <MainPanel />
      <Footer />
    </main>
  );
}
