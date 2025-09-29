import confetti from "canvas-confetti";
import { clsx, type ClassValue } from "clsx"
import { Eye, EyeOff, Users } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sideCannons() {
  const end = Date.now() + 2 * 1000;
  const colors = ["#4a37f6", "#ff00e2", "#e2ee4c"];
  const frame = () => {
    if (Date.now() > end) return;
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });
    requestAnimationFrame(frame);
  };
  frame();
}

export const projectVisibilityConfig = {
  PUBLIC: { icon: Eye, label: "Public" },
  PRIVATE: { icon: EyeOff, label: "Privé" },
  UNLISTED: { icon: Users, label: "Équipe" },
}

export const projectStatusConfig = {
  DRAFT: { label: "Brouillon" },
  ACTIVE: { label: "Actif" },
  ARCHIVED: { label: "Archivé" },
  PAUSED: { label: "En pause" },
  SEEKING: { label: "En recherche" },
}

export const projectStageConfig = {
  IDEA: { label: "Idéation" },
  MVP: { label: "MVP" },
  SCALE: { label: "En levé" },
  TRACTION: { label: "Tractation" },
}

export const memberRoleConfig = {
  MAINTAINER: { label: "Soutien" },
  MEMBER: { label: "Membre" },
  MENTOR: { label: "Mentor" },
  OWNER: { label: "Propriétaire" },
}

export const normalize = (v?: string) =>
    (v ?? "").toLocaleLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");