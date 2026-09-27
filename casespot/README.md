# CaseSpot: Privacy Anti-Spy Glass landing page

Store: `casespot101-3445.myshopify.com`, theme `138403905842`, page `/pages/privacy-anti-spy-glass`.

Page flow: Hero > Product buy box > Features > How it works > Product details > Proof/Reviews > Final CTA + trust strip > your theme footer.

Every section is self contained (own CSS in `assets/cs-privacy.css`), so it works on Dawn, Horizon or any Online Store 2.0 theme.

## Install (pick one)

**Shopify CLI**

```bash
cd casespot/theme
shopify theme push --store casespot101-3445 --theme 138403905842 --nodelete
```

**No CLI:** Online Store > Themes > ... > Edit code. Add `assets/cs-privacy.css`, each file in `sections/`, and a new page template called `privacy-anti-spy-glass`, then paste in `templates/page.privacy-anti-spy-glass.json`.

Then: Online Store > Pages > Privacy Anti-Spy Glass > Theme template > `privacy-anti-spy-glass`.

## Then in the theme editor (10 minutes)

1. **Pick the product** in CS Hero, CS Product buy box and CS Final CTA. Price, compare-at price, savings and the iPhone model dropdown all come from the product.
2. **Drop in your images:**
   - Hero: phone at an angle, screen black from the side
   - Features: one image per card (privacy, 9H glass, fit, thin)
   - How it works: clean, frame, press
   - Details: what's in the box flat lay
   - Proof: same phone front view vs side view (your strongest image, use it)
   - Final CTA: lifestyle shot (train, cafe, office)
3. **Reviews:** paste your Judge.me or Loox widget in the Proof section, or add real reviews as blocks. Leave the hero rating line blank until you have real numbers.
4. **Check the specs** in Product details (thickness, privacy angle, hardness) against your supplier sheet.

## Copy changes from the old page

- "Protects your data at any angle" became "dark from the side". Privacy glass is clear head-on by design, so "any angle" invites refunds.
- "Fits all iPhone models" became "cut for your exact model, pick yours". One protector cannot fit every model, so the model dropdown sells that instead.
- "Waterproof" and "anti-explosion" became "water resistant" and "shatter resistant". Same appeal, no claim you have to defend.
