export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-12 h-12">
        <div className="absolute w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute w-full h-full border-4 border-transparent border-b-blue-300 rounded-full animate-spin [animation-direction:reverse]"></div>
      </div>
    </div>
  );
}
