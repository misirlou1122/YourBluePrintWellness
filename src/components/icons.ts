import {
  Activity,
  Bell,
  BookOpen,
  Brain,
  Calendar,
  Camera,
  Droplets,
  Dumbbell,
  FileText,
  FlaskConical,
  HeartPulse,
  Pill,
  Scissors,
  Sparkles,
  UploadCloud,
  Utensils,
  Wine
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const tileIcons: Record<string, LucideIcon> = {
  activity: Activity,
  bell: Bell,
  book: BookOpen,
  brain: Brain,
  calendar: Calendar,
  calendarHeart: Calendar,
  camera: Camera,
  droplets: Droplets,
  dumbbell: Dumbbell,
  flask: FlaskConical,
  food: Utensils,
  heart: HeartPulse,
  note: FileText,
  pill: Pill,
  scissors: Scissors,
  sparkles: Sparkles,
  upload: UploadCloud,
  wine: Wine
};
