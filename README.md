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

## Where it lives in Shopify

- Store: `2beg3z-y0.myshopify.com`
- Theme: **Pump Stack CRO Build** (unpublished copy of Horizon). Preview it from Online Store > Themes.

## Pushing changes with Shopify CLI

```bash
cd theme
shopify theme push --store 2beg3z-y0 --theme "Pump Stack CRO Build" --nodelete
```

`--nodelete` matters. This folder only holds the Pump Stack overrides, not the full Horizon theme.
