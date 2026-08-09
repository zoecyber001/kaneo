import { toast } from "@/lib/toast";

export function triggerTaskCompletionCelebration(title?: string) {
  // 1. Subtle, elegant notification toast
  toast.success(
    title ? `Completed: "${title}" ✨` : "Task completed! Great momentum ✨",
  );

  // 2. Gentle visual confetti burst
  try {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.pointerEvents = "none";
    container.style.zIndex = "99999";
    document.body.appendChild(container);

    const colors = ["#88c0d0", "#a3be8c", "#ebcb8b", "#d08770", "#b48ead"];
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 6 + 4;
      const startX = window.innerWidth / 2 + (Math.random() * 200 - 100);
      const startY = window.innerHeight / 2;

      particle.style.position = "absolute";
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = "50%";
      particle.style.backgroundColor = color;
      particle.style.opacity = "0.9";
      particle.style.transition =
        "transform 0.8s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.8s ease-out";

      container.appendChild(particle);

      const vx = (Math.random() - 0.5) * 300;
      const vy = -Math.random() * 200 - 50;

      requestAnimationFrame(() => {
        particle.style.transform = `translate(${vx}px, ${vy}px) scale(0)`;
        particle.style.opacity = "0";
      });
    }

    setTimeout(() => {
      container.remove();
    }, 900);
  } catch {
    // Ignore DOM errors if in SSR
  }
}
