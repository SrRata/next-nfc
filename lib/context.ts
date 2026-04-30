// lib/context.ts
export function getPageContext(): string {
  if (typeof window === 'undefined') return ""; // Evita errores en el servidor
  const mainContent = document.querySelector('main') || document.body;
  const clone = mainContent.cloneNode(true) as HTMLElement;
  const selectorsToRemove = ['script', 'style', '.chat-sheet', 'nav', 'header'];
  selectorsToRemove.forEach(selector => {
    clone.querySelectorAll(selector).forEach(el => el.remove());
  });
  return clone.innerText.substring(0, 2000); 
}