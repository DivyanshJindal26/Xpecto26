import React from "react";

const StarBackground = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{
        backgroundColor: "#020205",
        backgroundImage: `
          radial-gradient(1px 1px at 20% 30%, white, transparent),
          radial-gradient(1px 1px at 80% 40%, white, transparent),
          radial-gradient(1px 1px at 40% 70%, white, transparent),
          radial-gradient(2px 2px at 60% 20%, white, transparent),
          radial-gradient(1px 1px at 10% 90%, white, transparent),
          radial-gradient(2px 2px at 90% 80%, white, transparent)
        `,
        backgroundRepeat: "repeat",
        backgroundSize: "300px 300px",
      }}
    />
  );
};

export default StarBackground;
