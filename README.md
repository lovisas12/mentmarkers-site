# Ment Markers – mentmarkers.com

Statisk webbplats för Ment Markers, byggd i ren HTML/CSS/JS utan byggsteg.

## Struktur

- `index.html` – startsida
- `om-oss.html` – om oss + grundare
- `style.css` – designtokens och all styling
- `main.js` – språkväxling, flikar, header-scroll, animationer
- `assets/` – logotyp och bilder
- `CNAME` – custom domain för GitHub Pages

## Intresselistan

Den kostnadsfria väntelistan på startsidan postar direkt till
[FormSubmit](https://formsubmit.co) via vanlig HTML-POST. Länkarna på Ment
Market och Om oss öppnar samma väntelista på startsidan. Första gången någon
anmäler sig skickas ett aktiveringsmail – klicka på länken i det så fungerar
formuläret därefter.

## Språk

Svenska ligger i HTML:en och är standard. `main.js` innehåller enbart den
engelska sidan, kopplad via `data-i18n`-attribut. Valet sparas i `localStorage`
och faller annars tillbaka på `navigator.language`.

Grundarnas biografier är ordagrann författartext och står kvar på svenska även
i engelskt läge – det är avsiktligt.

## Bilder

Alla bilder finns i `assets/`. Två av dem är efterbehandlade från
originalfoton och kan återskapas om råfilerna byts ut:

- `portrait-soft.webp` – porträttet i sista sektionen. Beskuren, nedtonad mot
  paletten och försedd med en alpha-toning åt vänster och uppåt så att den
  löses upp i bakgrundsgradienten utan synlig kant. **Behåll toningen** – en
  hårt beskuren bild bryter sektionen. WebP för att alpha-gradienten annars
  ger antingen banding (PNG-8) eller ~870 kB (PNG-24).
- `step-3-blush-v2.jpg` – steg 03. Kvadratiskt beskuren kring motivet och
  lätt duotonad mot plommon/blush (85 % originalfärg) så att grönskan inte
  krockar med paletten.

## Publicering

Hostas via GitHub Pages (Settings → Pages → main branch, root). Domänen
mentmarkers.com pekas via A-records till GitHub Pages.
