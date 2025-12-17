import { Cat } from "@phosphor-icons/react";

export function Header() {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="text-5xl">
          <Cat weight="duotone" color="#1c398e" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary" style={{ color: "#1c398e" }}>Pocky Wallet</h1>
      </div>
      <p className="font-regular text-muted-foreground text-lg" style={{ color: "#1c398e" }}>Track your expenses and income with Pocky!</p>
    </header>
  )
}
