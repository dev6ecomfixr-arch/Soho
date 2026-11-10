<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Product catalogue lives in `src/data/products.ts`, imported from the real SOHO Shopify store; never invent products, prices, discounts, reviews or specs — that brief forbids fabricated claims.
- Policy text in `src/data/policies.ts` is SOHO's published copy; keep it verbatim so legal pages stay accurate.
- Cart, wishlist, orders and newsletter/contact submissions are frontend-only state persisted to localStorage via `src/lib/store.tsx`; the brief asked for no backend.
- Delivery fees and totals are computed only in `src/lib/pricing.ts` (covered by `pricing.test.ts`) so checkout, drawer and tests agree.
- Listing pages share `ListingPage`; curated pages without real data (best sellers, trending) must show a "demo curation" note.
- Complete the Look, Frequently Bought Together and Build Your Bundle share `src/components/site/ProductBundles.tsx`; they add each real product/size to the cart individually so cart totals stay in `pricing.ts`.
