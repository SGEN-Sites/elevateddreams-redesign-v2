# Elevated Dreams LLC: redesign concept, "Heliotrope Nocturne"

A static, platform-free redesign concept for Elevated Dreams LLC, a New York State licensed adult-use cannabis
dispensary at 190 South Plank Road, Unit 10, Newburgh, NY 12550 (licence OCM-CAURD-26-000353). This is a design
concept preview, not the official website: every page carries a noindex robots tag, and every Order, Menu, Deals and
Account button opens the client's live online store.

## Design
Glassmorphism, an ethereal light and tenebrism on the brand's own palette (heliotrope, plum, sage, gold, lavender):
warm dark plum bands lit by one strong key light alternate with luminous lavender bands. Pictures sit in rounded
frames and cross the seams between bands while resting on a ledge, a band floor or a grid column. Scroll reveals,
light sweeps that bring photos out of the dark, gentle depth on framed pictures, pointer-lit cards, still buttons.
Type: Zilla Slab (display, a nod to the brand's slab serif) and Manrope (text), both under the SIL Open Font License
and self-hosted.

## Content
Every word on the live pages is carried over: the home page, Deals, About, Education, Learn (all 20 guides, from the
site's own content), Community, Contact, Menu and Rewards, plus the New York compliance block (licence, warning, the
four rotating warnings with a pause control, and the HOPEline). Added for search, from the store's own facts only:
per-page titles, descriptions and canonicals, a Newburgh location page (Visit), Questions and Answers, Pickup and
Delivery, and seven category pages (Flower, Pre-Rolls, Edibles, Vapes, Concentrates, CBD, Accessories), with
LocalBusiness, breadcrumb, article and FAQ structured data.

## Media
The storefront, interior, category and guide images are the client's own. Generated images (fal: FLUX 1.1 Pro Ultra
stills, BiRefNet cutouts, Kling image-to-video for the home film) are mood and category illustration only, never a
picture of the store or its products; each generated image carries `data-ai="1"` in the markup.

## This repository
The built static site: plain HTML, one CSS file, one small script and the media. Every link is page-relative, so it
serves from any folder or host with no build step.
