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

async function waitForElement(id: string, timeoutMs = 3000): Promise<HTMLElement | null> {
    const deadline = Date.now() + timeoutMs;
    let element = document.getElementById(id);
    while (!element && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 100));
        element = document.getElementById(id);
    }
    return element;
}

// Panel content is rendered lazily while the panel is closed, so the target
// element only exists once the section is open. Open it, wait for the element,
// then scroll twice — the second pass corrects for the expand animation.
async function openPanelAndScrollTo(sectionIdx: number, elementId: string) {
    const readings = useReadings();
    if (!readings.panel.includes(sectionIdx)) {
        readings.openSection(sectionIdx);
    }
    const element = await waitForElement(elementId);
    if (!element) {
        return;
    }
    window.scrollTo(scrollX, scrollY - 1);
    scrollToElement(element);
    await new Promise((r) => setTimeout(r, 350));
    scrollToElement(element);
}

export async function scrollToSection(sectionIdx: number) {
    await openPanelAndScrollTo(sectionIdx, `section-${sectionIdx}`);
}

export async function scrollToSubSection(sectionIdx: number, subSectionIdx: number) {
    await openPanelAndScrollTo(sectionIdx, `sub-section-${sectionIdx}-${subSectionIdx}`);
}

export async function scrollToReading(sectionIdx: number, subSectionIdx: number, readingIdx: number) {
    await openPanelAndScrollTo(sectionIdx, `reading-${sectionIdx}-${subSectionIdx}-${readingIdx}`);
}