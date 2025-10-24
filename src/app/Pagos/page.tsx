import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";

export default function Page() {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <LeftSection />
      <RightSection />
    </div>
  );
}
