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

## Bilder som saknas

Två bilder från designprojektet är ännu inte incheckade. Ladda ner dem och lägg
i `assets/`:

- `assets/portrait-soft.png` – porträttet i sista sektionen på startsidan.
  **Behåll den förberedda alpha-toningen** – en hårt beskuren bild bryter
  övergången mot bakgrundsgradienten.
- `assets/step-3-blush-v2.jpg` – steg 03 under "Från data till beslut".

Tills de finns tar respektive `<img>` bort sig själv, så sidan visar en tom
tonad cirkel i stället för en trasig bild.

## Founding Members

Sektionen visar erbjudandet (1 495 kr) men **tar inte emot någon betalning** –
knappen leder till väntelistan, och texten säger uttryckligen att ingen
betalning sker nu. När Stripe är på plats: byt knappen mot en riktig kassa med
server-side PaymentIntent, kvitto via mail och en spärr på 30 platser.

## Publicering

Hostas via GitHub Pages (Settings → Pages → main branch, root). Domänen
mentmarkers.com pekas via A-records till GitHub Pages.
