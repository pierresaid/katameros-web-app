import { useReadings } from "../store/readings";

function scrollToElement(element: HTMLElement) {
    var headerOffset = 75;
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}

export function scrollToId(id: string) {
    const element = document.getElementById(id);
    if (!element) {
        return;
    }
    scrollToElement(element);
}

export async function scrollProgressive(id: string | number) {
    let idStr = ''
    if (typeof id === "number") {
        idStr = `section-${id}`;
    }
    else
        idStr = id;
    let element = document.getElementById(idStr);
    if (!element) {
        await new Promise((r) => setTimeout(r, 150));
        element = document.getElementById(idStr);
        if (!element)
            return;
    }
    window.scrollTo(scrollX, scrollY - 1);
    scrollToElement(element);
    await new Promise((r) => setTimeout(r, 150));
    scrollToElement(element);
}

export async function scrollToSection(id: number) {
    const idStr = `section-${id}`;
    const readings = useReadings();

    if (!readings.panel.includes(id)) {
        scrollProgressive(idStr)
    }
    else
        scrollToId(idStr);
}

export async function scrollToSubSection(sectionId: number, subSectionId: number) {
    const idStr = `sub-section-${sectionId}-${subSectionId}`;
    const readings = useReadings();
    if (!readings.panel.includes(sectionId)) {
        scrollProgressive(idStr)
    }
    else
        scrollToId(idStr);
}

export async function scrollToReading(sectionId: number, subSectionId: number, readingIdx: number) {
    const idStr = `reading-${sectionId}-${subSectionId}-${readingIdx}`;
    const readings = useReadings();

    // Open the section if not already open
    if (!readings.panel.includes(sectionId)) {
        readings.openSection(sectionId);
        // Wait for the section to expand
        await new Promise((r) => setTimeout(r, 150));
    }

    // Wait for the element to be in the DOM
    let element = document.getElementById(idStr);
    if (!element) {
        await new Promise((r) => setTimeout(r, 150));
        element = document.getElementById(idStr);
        if (!element) {
            return;
        }
    }

    // Scroll with the small offset trick for better positioning
    window.scrollTo(scrollX, scrollY - 1);
    scrollToElement(element);
    // await new Promise((r) => setTimeout(r, 150));
    scrollToElement(element);
}