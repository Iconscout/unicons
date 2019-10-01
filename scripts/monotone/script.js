const SVG_URL_BASE =
  "https://unicons.iconscout.com/release/feature-unicons-monotone/svg/monotone/";

const replaceWithSVG = (name, svg) => {
  // Replace it with SVG
  const elements = document.getElementsByClassName(`ui-${name}`);

  while (elements.length > 0) {
    const element = elements[0];
    const span = document.createElement("span");
    span.innerHTML = svg;
    span.classList.add("uim-svg");
    span.firstChild.setAttribute("width", "1em");
    // span.firstChild.setAttribute('height', '1em')

    // If user wants white bg rather than opacity
    if (element.classList.contains("uim-white")) {
      span.style.mask = `url(${SVG_URL_BASE}${name}.svg)`;
      span.style.webkitMask = `url(${SVG_URL_BASE}${name}.svg)`;
      span.style.background = "white";
    }

    element.replaceWith(span);
  }
};

const fetchIconsAndReplace = icons => {
  icons.forEach(icon => {
    fetch(`${SVG_URL_BASE}${icon}.svg`)
      .then(res => res.text())
      .then(svg => replaceWithSVG(icon, svg));
  });
};

window.onload = () => {
  const elements = document.getElementsByClassName("uim");
  const iconsToFetch = [];
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.classList.forEach(className => {
      if (className.indexOf("ui-") > -1) {
        const iconName = className.toLocaleLowerCase().replace("ui-", "");
        if (iconsToFetch.indexOf(iconName) === -1) {
          iconsToFetch.push(iconName);
        }
      }
    });
  }

  fetchIconsAndReplace(iconsToFetch);
};

// Append CSS
const style = document.createElement("style");
style.innerHTML = `:root {
  --uim-primary-opacity: 1;
  --uim-secondary-opacity: 0.6;
  --uim-tertiary-opacity: 0.2;
}
.uim-svg {
  display: inline-block;
  height: 1em;
  vertical-align: -0.125em;
  font-size: inherit;
  fill: var(--uim-color, currentColor);
}
.uim-svg svg {
  display: inline-block;
}
.uim-primary {
  opacity: var(--uim-primary-opacity);
}
.uim-secondary {
  opacity: var(--uim-secondary-opacity);
}
.uim-tertiary {
  opacity: var(--uim-tertiary-opacity);
}`;

document.head.appendChild(style);
