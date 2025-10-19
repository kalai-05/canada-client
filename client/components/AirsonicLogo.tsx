export default function AirsonicLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        className="w-10 h-10"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Red triangle */}
        <polygon
          points="50,15 35,50 50,45"
          fill="#FF0000"
        />
        {/* Blue triangle */}
        <polygon
          points="50,45 65,50 50,15"
          fill="#0052CC"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-sm">
          <span className="text-red-600">AIRSONIC</span>
          <span className="text-blue-600">.</span>
        </span>
        <span className="text-xs text-gray-600 font-semibold">HVAC</span>
      </div>
    </div>
  );
}
