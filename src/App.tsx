import { useState } from "react";
import { Navigation, type Section } from "./components/Navigation";
import { GrainOverlay } from "./components/GrainOverlay";
import { Today } from "./pages/Today";
import { Objectifs } from "./pages/Objectifs";
import { EmploiDuTemps } from "./pages/EmploiDuTemps";
import { Lectures } from "./pages/Lectures";
import { Moodboard } from "./pages/Moodboard";
import { Souvenirs } from "./pages/Souvenirs";

const PAGES: Record<Section, () => React.ReactElement> = {
  aujourdhui: Today,
  objectifs: Objectifs,
  "emploi-du-temps": EmploiDuTemps,
  lectures: Lectures,
  moodboard: Moodboard,
  souvenirs: Souvenirs,
};

function App() {
  const [active, setActive] = useState<Section>("aujourdhui");
  const Page = PAGES[active];

  return (
    <div className="min-h-screen lg:flex">
      <Navigation active={active} onChange={setActive} />
      <main className="pb-20 lg:flex-1 lg:pb-0">
        <Page />
      </main>
      <GrainOverlay />
    </div>
  );
}

export default App;
