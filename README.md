# Root & Render Objects

A lightweight public portfolio and concept archive for physical craft, furniture restoration, cosplay, creature fabrication, practical effects, speculative technology and small handmade art.

## Running the site

Static HTML, CSS, JavaScript and public JSON; Netlify publishes the repository root without a build step. No database is required. The public object catalog is stored in `data/pieces.json`, and /admin uses Decap CMS with GitHub authentication (which must be configured separately before editing).

## Archive model

Each object has a stable ID, a collection, concept or build status, public description, optional visuals and references to related Armoury technical records. Supported collections:

- Furniture & Transformations
- The Staffmaker's Collection
- Cosplay, Creatures & Props
- Creative Technology & Mobility
- Woodcraft & Decorative Arts
- Creatures & Curiosities
- Mechanical Experiments

Lifecycle stages are: idea, concept, prototype, in-workshop, complete, paused, retired. These are distinct from commercial status (`available`, `reserved`, etc). Unbuilt ideas must not be described as tested or fabricated. Use a stable project ID and create revisions rather than replacing history. Only publish real photos when the user supplies them or they have been explicitly approved.

## Workshop desk: local-only, not secure cloud storage

The Materials & Tools inventory and Build Journal are powered by `workbench.js`, stored in the current browser profile's `localStorage`. Users can add and delete records and export/import backups as JSON. **There is no login, backend, syncing, encryption, or cross-device restoration.** On a shared device anyone using the same browser profile can see the local records. Clearing site data deletes them without a backup. Do not enter secrets or sensitive personal information.

**Important:** Everything committed to `data/pieces.json` is publicly downloadable, including fields not rendered on the page. The `publication: unlisted` flag only hides a card from the public gallery; it does NOT secure or remove the underlying record. Never store confidential notes, unpublished client information, keys, proprietary schematics or private costs in this repository JSON. Real protected editing and private records require authenticated server-side storage and authorization, a separate follow-on development effort. Do not claim the current CMS is a private workbench.

## Quality standards

- Text differentiates ideas, prototypes, active work and completed artifacts.
- No fake images, fabricated sales or implied completed engineering.
- Mobile navigation remains usable; keyboard focus is visible; reduced motion supported.
- The workshop is a public portfolio, not a finished-product shop.
- Crosslinks to Armoury are references to related detailed technical records, not automatic synchronization.
- Before accepting commissions, confirm current capacity and expertise; the inquiry form is exploratory.

## Netlify deployment

Publish directory: repository root (see netlify.toml). The contact and reservation forms use Netlify Forms, subject to the site's actual plan and form activation. The Decap CMS under `/admin` requires a supported GitHub OAuth provider. `netlify.toml` sets baseline security headers.

## Verification

Inspect `script.js` and `workbench.js` syntax after changes, check the catalog loads, test every filter, open an object without imagery, use keyboard navigation and dialogs, add/export/import/delete inventory and journal records, check mobile at narrow widths, and verify that private notes do not appear in the published catalog. Netlify's deploy-ready state alone does not prove browser usability.
