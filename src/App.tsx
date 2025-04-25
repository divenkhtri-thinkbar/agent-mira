import { useEffect } from "react";
import ResponsiveRoutes from "./layouts/ResponsiveLayout";

function App() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.classList.add("circular-cursor");
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);

  const handleButtonRef = (button: HTMLAnchorElement | null) => {
    if (!button) return;

    const handleMouseEnter = () => {
      document.querySelector(".circular-cursor")?.classList.add("cursor-hover");
    };

    const handleMouseLeave = () => {
      document.querySelector(".circular-cursor")?.classList.remove("cursor-hover");
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  };

  return <ResponsiveRoutes onButtonRef={handleButtonRef} />;
}

export default App;