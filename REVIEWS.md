# Google reviews section

This is a manually maintained snapshot of the First Texas Brokerage Co Google listing at 80 S Main St, Salado. It does not use Elfsight, the Google Places API, or a subscription.

## Install in BoomTown

1. Paste the complete `pele.html` into the homepage HTML block. It includes the reviews section and the CSS/JavaScript CDN tags. There is no separate reviews HTML file to install.
2. Remove the older `sierra-custom-home.css` and project `script.js` tags from BoomTown’s custom code settings or other blocks, so each asset loads only once. The embedded tags are pinned to `6b56a70`, the published revision containing the reviews code and data.
3. Swiper 12.2.0 and `google-reviews.json` load automatically. No additional script tags or JSON links are needed in BoomTown.

The script resolves the JSON beside its own URL. For example, a script loaded from `…@COMMIT/script.js` loads `…@COMMIT/google-reviews.json`. This keeps the code and data on the same revision.

## Update reviews next year

Edit `google-reviews.json`. Each review has:

```json
{
  "author": "Reviewer display name",
  "rating": 5,
  "excerpt": "A short, exact excerpt from their review.",
  "sourceUrl": "https://www.google.com/maps/contrib/REVIEWER_ID/reviews"
}
```

- Keep the reviewer’s name, rating, and source link accurate.
- Use a short excerpt of up to 25 words; preserve the meaning and link to the original. Use an empty string for a rating without a written comment.
- The array order is the carousel order. The initial 34 entries follow Google's most relevant ordering as retrieved.
- Update `rating`, `totalReviews`, and `collectedAt` from the business profile. The displayed score and count describe the Google listing, not a recalculated score from a selected subset.
- `collectedAt` is maintenance metadata. No dates are displayed on the page.
- Commit and push the JSON, then update the `script.js` CDN URL to that new commit. Existing commit-pinned URLs do not automatically pick up later edits.

The initial snapshot includes all 34 ratings: 32 five-star ratings and two one-star ratings. Six entries have no written comment. Written feedback is displayed as attributed excerpts, with links to the reviewers' Google pages.

## Behavior

Four cards are visible at 1200px and wider, three at 1024px, two at 640px, and one on phones. Visitors can swipe or drag, use the arrows, or navigate with the keyboard. There is no autoplay. Reduced motion is respected.

If Swiper cannot load, the cards remain available in a horizontally scrollable row. If the JSON cannot load, the section displays a link to Google instead of empty or invented reviews.

The section uses the existing primary green, secondary yellow accents, and site typography. Its HTML and CSS are scoped to the reviews section.
