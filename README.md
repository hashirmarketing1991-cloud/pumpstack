# Pump Stack Shopify store

Premium, conversion-focused storefront for Pump Stack supplements, built on Shopify's Horizon theme.

## What is here

- `theme/` holds custom files layered on top of Horizon. Only files that differ from stock Horizon are in this repo.
  - `assets/pump-stack.css` is the shared design system (colors, type, buttons, cards).
  - `sections/ps-*.liquid` are the custom Pump Stack sections. All of them can be edited in the theme editor.
  - `snippets/ps-tub-mock.liquid` renders a branded tub whenever a product has no photo yet.
  - `templates/index.json` and `templates/product.json` wire the sections into the homepage and product pages.
  - `config/settings_data.json` and `sections/header-group.json` set brand colors, type and the announcement bar.
- `docs/LAUNCH-CHECKLIST.md` lists everything to finish before the store goes live.

## Luxury product page

- `theme/sections/psx-lux.liquid` is the product page: big word and pack on top, label numbers, story band, highlights, pictures, facts, directions and the full range. `theme/templates/product.json` uses it. The earlier page is kept as `theme/templates/product.classic.json`.
- `theme/snippets/psx-lux-look.liquid` picks the big word and the pack pictures for each product from its handle.
- `theme/assets/psx-lux.css` and `theme/assets/psx-lux.js` style it and run the pack picker, the bottom bar and the picture row.
- `theme/assets/ps-lux-*.webp` are the pack pictures (front with floor shadow, back of pack, and the Blue Raspberry gummies set). `theme/assets/ps-pouch-*.webp` are the same packs cut out with no shadow, used on cards.

## Where it lives in Shopify

- Store: `2beg3z-y0.myshopify.com`
- Theme: **Pump Stack CRO Build** (unpublished copy of Horizon). Preview it from Online Store > Themes.

## Pushing changes with Shopify CLI

```bash
cd theme
shopify theme push --store 2beg3z-y0 --theme "Pump Stack CRO Build" --nodelete
```

`--nodelete` matters. This folder only holds the Pump Stack overrides, not the full Horizon theme.
