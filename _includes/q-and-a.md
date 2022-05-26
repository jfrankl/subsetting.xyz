#### How do I subset fonts?

We recommend using the library [glyphhanger](https://github.com/zachleat/glyphhanger). This [tutorial](https://florianbrinkmann.com/en/glyphhanger-4691/) by Florian Brinkmann provides helpful step-by-step instructions.

#### How big of a difference does it make?

The change in file size depends on how many characters you remove. When I’ve created a subset for English, a **reduction from 45KB to 15KB per font** has been typical.

#### Is there a downside?

There are a few pitfalls with subsetting that are hard to spot. First, subsetting can remove kerning or OpenType features; we haven't had that experience with [glyphhanger](https://github.com/zachleat/glyphhanger), but it has happened with other tools.

Second, subsetting can cause weirdness with website translation tools. If you create a subset with only English characters and a visitor uses Google Translate to read in Spanish, the letter E will use your custom typeface while the letter É will use the fallback. The solution: create multiple subsets—one for the primary language, and one for additional characters. You can use the [unicode-range](https://css-tricks.com/almanac/properties/u/unicode-range/) property to tell the browser which subset(s) to load.

#### Why don’t browsers do this automatically?

W3C is working on [Incremental Font Transfer](https://w3.org/TR/IFT/). If this effort is successful, manual subsetting would become unnecessary.

#### Does Google Fonts support subsetting?

Google Fonts sources from multiple foundries, and licenses vary. Most use
the [Open Font License](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL), which supports subsetting.
