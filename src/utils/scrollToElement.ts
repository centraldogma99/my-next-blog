export const scrollToElement = (elementId: string, offset = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

export const scrollToHash = (hash: string, offset = 80) => {
  if (!hash) return;
  
  const id = hash.startsWith("#") ? hash.substring(1) : hash;
  
  const decodedId = decodeURIComponent(id);
  
  scrollToElement(decodedId, offset);
};