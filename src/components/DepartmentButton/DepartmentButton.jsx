// src/components/DepartmentButton/DepartmentButton.jsx
function DepartmentButton({ department, onClick, className }) {
  const { name, color, shape } = department;
  
  // Shape classes
  const shapeClass = () => {
    switch(shape) {
      case "circle": return "before:rounded-full";
      case "triangle": return "before:clip-path-triangle";
      case "square": return "before:rounded-md";
      case "wave": return "before:clip-path-wave";
      case "hexagon": return "before:clip-path-hexagon";
      case "star": return "before:clip-path-star";
      default: return "before:rounded-md";
    }
  };

  return (
    <button
      onClick={() => onClick(department)}
      className={`relative rounded-[2rem] bg-gradient-to-br ${color} text-white font-extrabold shadow-lg hover:scale-105 transition duration-300 flex items-center justify-center overflow-hidden ${shapeClass()} ${className}`}
    >
      <span className="z-10 text-center p-4">{name}</span>

      {/* Decorative shape */}
      <div className="absolute inset-0 before:content-[''] before:absolute before:w-40 before:h-40 before:opacity-20 before:bg-white before:-top-10 before:-left-10" />
    </button>
  );
}

export default DepartmentButton;