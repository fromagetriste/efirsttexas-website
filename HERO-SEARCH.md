# Homepage search integration

Install `pele.html` in the BoomTown homepage custom HTML block and update the CSS and JS URLs together. Keep BoomTown’s existing homepage search component enabled. This project does not contain or replace BoomTown’s search service.

`setupHeroSearch()` moves the existing `.jsx-hero__search-bar` React mount into `#ft-hero-search`, directly below the custom hero title. Moving the complete mount retains the native Search By menu, live suggestions, keyboard handling, submit behavior, and nearby search. The original hero is hidden after the move. An observer handles delayed rendering. If the native component is absent, a link to the property search page remains available.

A standalone `pele.html` file cannot initialize the live BoomTown form; preview it with the BoomTown homepage runtime. Do not paste a second static copy of the form or load a second copy of the project script.

## Validation

Tested against the current public homepage runtime in a local preview:

- Search By menu and Cities / ZIP Code modes.
- Live autocomplete responses, including Salado and ZIP 76571.
- Selecting Salado's Location suggestion produces `custom=136122`, matching the original homepage.
- Selecting Salado, TX in Cities mode produces `city=179231~39194`.
- Find Your Home button submission on desktop and mobile.
- Enter-key submission for ZIP 76571 produces `postalcode=76571`, matching the original homepage.
- One search form and one native React mount after page initialization.
- Mobile suggestions appear below the stacked submit button so both remain usable.

Nearby search retains the native BoomTown handler. Actual device-location lookup was not exercised; it requires the visitor’s browser location permission.

The three replacement S3 image URLs are intentionally retained exactly as supplied. Their upload is managed separately by the site owner. The preview used matching local image files while those URLs were unavailable.
