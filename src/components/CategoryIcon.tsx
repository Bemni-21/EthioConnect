import {
  Droplets,
  Zap,
  Car,
  GraduationCap,
  Scissors,
  Sparkles,
  Briefcase,
  Tv,
  Hammer,
  Paintbrush,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Droplets,
  Zap,
  Car,
  GraduationCap,
  Scissors,
  Sparkles,
  Briefcase,
  Tv,
  Hammer,
  Paintbrush,
};

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = ICONS[icon] ?? Briefcase;
  return <Icon className={className} />;
}
