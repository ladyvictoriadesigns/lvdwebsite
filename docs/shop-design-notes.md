# Shop design notes (TJ, Nov 28, 2026)

Branch: `shop-design-tj`, built on top of Muse's `store-preview` branch.
Muse's branch itself hasn't been touched. Merge this into `store-preview` once Irene has seen it.

## What's done on this branch

1. **Hero:** a full-screen photo (white Fisher bowls table) with text at the bottom left, like the homepage.
2. **No em dashes** anywhere in the shop copy. TJ hates them, so keep it that way.
3. **Product grid photos fixed.** Each card fills its frame, and on computers a plain product photo fades in on hover.
4. **Three-photo strip under the hero** (idea from delvaux.com): Candlelight, Crystal Lamp Shades, Risers & Bowls. Each opens that piece. On phones it swipes sideways.
5. **Full-width photo break** between Pre-Sale and Available Now: "Styled by the studio" over `/gallery/laura-ken/1sm08322.jpg` (white florals, candlelit room), with a "See our work" link to /gallery.
6. **Modern store cards:**
   - rounded photos with a hover lift
   - a Pre-sale / In stock pill
   - a Reserve / Shop now button that slides up on hover
   - a sans-serif name, the size, then the price with the deposit beside it
   - two across on phones, up to four on wide screens
7. **Two-tone headings:** "**Pre-sale.** Reserve today, arriving Spring 2027." and "**Available now.** Ready to bring home today." Each has a piece count.

## Decisions

- The shop **does not have to match the rest of the site** strictly. Modern store patterns are fine, as long as it keeps LVD's colors and logo.
- **Photo strip vs. product cards:** the taper holders and mirror riser cards lead with plain product photos. That way the strip's event photos aren't shown twice.

## Still open

- **Photos are the biggest weakness.** They're a mix of event shots, phone shots and vendor shots.
  - Next step: test background removal on 2 or 3 pieces (bowls, lamp shades, mirror riser) to put each on the same cream background. Use something local, like the macOS Vision "lift subject" feature, so nothing is uploaded. Glass may cut out badly.
  - The real fix is an afternoon photo session with Irene: same backdrop, same light, each piece alone plus one styled shot, vertical.
- **Mirror riser card photo** mostly shows reflected curtains. `mirror-riser-vendor.jpg` shows a silver riser next to the gold one, so don't use it. The riser is sold in gold only.
- **Tripod vase:** Irene sent a DHgate wholesale listing (clear crisscross acrylic vase, about $60–71 each, minimum 10). Don't use that seller's photo:
  - It isn't hers.
  - A reverse image search shows the wholesale price.
  - Ask her whether it's the tripod vase or a new piece.
- **Checkout:** which one to use is still undecided.
  - Muse's shop uses one Stripe Payment Link per product, so a cart with several items means several payments.
  - The `main` branch has a one-payment cart, Stripe Tax, the order webhook and the Meta purchase event.
  - The recommendation is Muse's products and design with main's checkout engine. It's TJ and Irene's call.
- **Header:** "JOURNAL" and "Menu" overlap at middle screen widths. This is the site-wide header.
- Stripe payment link product names still contain dashes. Irene changes those in Stripe.

## Preview locally

```
npm install
npx next dev --webpack -p 3107
```

Open http://localhost:3107/shop. Use `--webpack`, because Turbopack fails when node_modules is a symlink.
