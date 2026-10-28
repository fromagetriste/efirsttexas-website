# Homepage search integration

Install `pele.html` in the BoomTown homepage custom HTML block and update the JS URL. Keep the site's normal BoomTown homepage bundles loaded; the custom-page template already provides them.

The hero contains BoomTown's supported placeholder:

```html
<div class="js-homesearchbar-shortcode bt-hero__search-bar" data-theme="search"></div>
```

BoomTown's `homeSearchBarShortcode()` initializes this placeholder as a native React search form, including its Search By menu, suggestions, keyboard handling, submit behavior, and nearby search. The placeholder must be present in the saved homepage HTML before BoomTown initializes. Merely updating the JS URL is insufficient when installing this fix.

`setupHeroSearch()` observes initialization, hides the fallback link once the form mounts, and applies the responsive hero layout. It also supports older templates that already contain `.jsx-hero__search-bar` by moving that complete mount. Custom homepages do not necessarily contain that original hero component; relying only on moving it caused the fallback-only defect.

A standalone `pele.html` file cannot initialize the live BoomTown form; it needs the BoomTown homepage runtime. Do not paste a static copy of the form or load a second copy of the project script.

## Validation

Tested against the current public homepage runtime. The fix was additionally tested using a snapshot of `/bt-custom-homepage/dev-original-template/`, with no original hero search component present:

- Search By menu and Cities / ZIP Code modes.
- Live autocomplete responses, including Salado and ZIP 76571.
- Selecting Salado's Location suggestion produces `custom=136122`, matching the original homepage.
- Selecting Salado, TX in Cities mode produces `city=179231~39194`.
- Find Your Home button submission on desktop and mobile.
- Enter-key submission for ZIP 76571 produces `postalcode=76571`, matching the original homepage.
- One search form and one supported shortcode mount after custom-page initialization; fallback hidden.
- Mobile suggestions appear below the stacked submit button so both remain usable.

Nearby search retains the native BoomTown handler. Actual device-location lookup was not exercised; it requires the visitor’s browser location permission.

The three replacement S3 image URLs are intentionally retained exactly as supplied. Their upload is managed separately by the site owner. The preview used matching local image files while those URLs were unavailable.
