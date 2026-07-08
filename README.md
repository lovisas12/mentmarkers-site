# Ment Markers – mentmarkers.com

Statisk webbplats för Ment Markers, byggd i ren HTML/CSS (flyttad från Figma Sites).

## Struktur

- `index.html` – startsida med intresselista
- `om-oss.html` – om oss + grundare
- `style.css` – all styling
- `assets/` – logotyp och bilder
- `CNAME` – custom domain för GitHub Pages

## Intresselistan

Formuläret skickar via [FormSubmit](https://formsubmit.co) till e-post. Första gången någon anmäler sig skickas ett aktiveringsmail – klicka på länken i det så fungerar formuläret därefter. Byt adress genom att ändra `action`-attributet i `index.html`.

## Publicering

Hostas via GitHub Pages (Settings → Pages → main branch, root). Domänen mentmarkers.com pekas via A-records till GitHub Pages.
