import { SCROLL_OFFSET } from "@/components/HeadingWithAnchor";

export const scrollToElement = (elementId: string, offset = SCROLL_OFFSET) => {
  const element = document.getElementById(elementId);
  const parentElement = element?.parentElement;
  if (!element || !parentElement) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + parentElement.scrollTop - offset;

  parentElement.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

export const scrollToHash = (hash: string, offset = SCROLL_OFFSET) => {
  if (!hash) return;

  const id = hash.startsWith("#") ? hash.substring(1) : hash;

  const decodedId = decodeURIComponent(id);

  scrollToElement(decodedId, offset);
};
