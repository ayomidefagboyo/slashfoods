interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <div className={`${className} flex-shrink-0`}>
      <img
        src="/slashfood-logo.png"
        alt="SlashFood Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}