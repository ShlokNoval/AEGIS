import { Activity, ShieldAlert, History, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "New Intelligence", href: "/", icon: Activity },
    { name: "Threat Logs", href: "/logs", icon: History },
    { name: "Agent Config", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <ShieldAlert className="w-6 h-6 text-primary mr-2" />
        <h1 className="font-bold text-xl tracking-tighter">AEGIS</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          
          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">SYSTEM STATUS</p>
          <div className="flex items-center text-sm font-medium text-emerald-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            Agents Online
          </div>
        </div>
      </div>
    </aside>
  );
}
