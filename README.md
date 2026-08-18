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

Oförändrad. Formulären på båda sidorna postar direkt till
[FormSubmit](https://formsubmit.co) via vanlig HTML-POST – ingen JavaScript
inblandad, så de fungerar även om `main.js` inte laddas. Första gången någon
anmäler sig skickas ett aktiveringsmail – klicka på länken i det så fungerar
formuläret därefter. Byt adress genom att ändra `action`-attributet i
`index.html` och `om-oss.html`.

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

## Founding Members

Sektionen visar erbjudandet (1 495 kr) men **tar inte emot någon betalning** –
knappen leder till väntelistan, och texten säger uttryckligen att ingen
betalning sker nu. När Stripe är på plats: byt knappen mot en riktig kassa med
server-side PaymentIntent, kvitto via mail och en spärr på 30 platser.

## Publicering

Hostas via GitHub Pages (Settings → Pages → main branch, root). Domänen
mentmarkers.com pekas via A-records till GitHub Pages.
