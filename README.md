# Root & Render Studio Furniture

A one-page transformation archive and inquiry site for one-of-one furniture art.

## Stack

- Plain HTML, CSS, and JavaScript
- Netlify deployment and form capture
- Decap CMS at `/admin`
- GitHub-backed furniture data in `data/pieces.json`

## Deploy to Netlify

1. In Netlify, choose **Add new site → Import an existing project**.
2. Select this GitHub repository.
3. Leave the build command empty.
4. Set the publish directory to `.`.
5. Deploy.

Netlify will detect the `commission` and `reservation` forms during deployment.

## Finish Decap CMS setup

The CMS is scaffolded, but GitHub authentication still needs to be connected.

1. Replace every `YOUR-NETLIFY-SITE` value in `admin/config.yml` with the real Netlify subdomain.
2. Configure a supported GitHub OAuth provider for Decap CMS.
3. Visit `/admin` and sign in.
4. Edit the furniture list and publish. Decap will commit the updated JSON and uploaded images to the repository.

## Content workflow

Each furniture entry includes its number, name, finish, status, price, progress, story, dimensions, materials, and main image. Status values are:

- `planned`
- `in-workshop`
- `available`
- `reserved`
- `found-a-home`

When a piece is marked `available`, its detail panel automatically shows a reservation button.

## Images

CMS uploads are stored in `images/uploads`. Until real photos are added, the two founding pieces use atmospheric colour placeholders.
