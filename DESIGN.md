# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Calm editorial travel planner: off-white canvas, near-black ink typography, one deep-teal accent and a muted six-colour category family — restrained like Linear/Stripe, never a colourful holiday brochure.

## Colors

- `--color-bg`: **#F6F7F9**
- `--color-surface`: **#FFFFFF**
- `--color-surface_alt`: **#F1F3F6**
- `--color-fg`: **#14171C**
- `--color-fg_soft`: **#3D434D**
- `--color-muted`: **#6B7280**
- `--color-border`: **#E2E5EA**
- `--color-border_strong`: **#C9CED6**
- `--color-accent`: **#0E7C86**
- `--color-accent_hover`: **#0B666E**
- `--color-accent_active`: **#095057**
- `--color-accent_soft`: **#E4F2F3**
- `--color-accent_fg`: **#FFFFFF**
- `--color-danger`: **#B42318**
- `--color-danger_soft`: **#FDECEA**
- `--color-success`: **#067647**
- `--color-focus_ring`: **#0E7C86**
- `--color-disabled_bg`: **#EDEFF2**
- `--color-disabled_fg`: **#9AA1AC**
- `--color-overlay`: **rgba(20,23,28,0.48)**
- `--color-cat_anreise`: **#0E7C86**
- `--color-cat_unterkunft`: **#3B5BDB**
- `--color-cat_verpflegung`: **#B54708**
- `--color-cat_aktivitaet`: **#067647**
- `--color-cat_shopping`: **#8E44AD**
- `--color-cat_sonstiges`: **#6B7280**

## Typography

- `font_family`: 'Inter', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif
- `font_numeric`: 'Inter', ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, monospace (only for time and money columns, tabular-nums)
- `heading_weight`: 600
- `body_weight`: 400
- `size_display`: 32px / 40px line-height, weight 600, letter-spacing -0.02em
- `size_h1`: 26px / 34px, weight 600, letter-spacing -0.015em
- `size_h2`: 19px / 26px, weight 600
- `size_h3`: 16px / 24px, weight 600
- `size_body`: 15px / 23px, weight 400
- `size_small`: 13px / 20px, weight 400
- `size_caption`: 12px / 16px, weight 500, letter-spacing 0.02em, uppercase for section labels
- `rules`: max two weights (400/600); no italics; tabular-nums for all times and amounts so digits align in lists

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px
- `--space-7`: 64px

## Border-Radii

- `--radius-sm`: 6px
- `--radius-md`: 10px
- `--radius-lg`: 16px
- `--radius-pill`: 999px

## Components

### Button (primary)

Height 44px (min-height 44px, always), padding 0 20px, radius md=10px, bg=accent #0E7C86, text=accent_fg #FFFFFF, font-size 15px weight 600, border none, gap 8px to icon. States: default bg #0E7C86; hover bg accent_hover #0B666E; active bg accent_active #095057 and transform translateY(1px); focus-visible outline 2px solid focus_ring offset 2px; disabled bg disabled_bg #EDEFF2, text disabled_fg #9AA1AC, cursor not-allowed, opacity 1 (no half-transparency), aria-disabled=true and no click handler. Loading state: label replaced by 'Speichern …' with spinner 16px, pointer-events none.

### Button (secondary)

Same box (44px, radius md, padding 0 20px) but bg=surface #FFFFFF, text=fg #14171C, border 1px solid border_strong #C9CED6. Hover bg surface_alt #F1F3F6, border #6B7280. Active bg #E7EAEF. Disabled same as primary. Use for 'Abbrechen', 'Zurück zur Reiseliste'.

### Button (ghost / icon)

Height 44px, min-width 44px, transparent bg, text fg_soft #3D434D, radius md, padding 0 12px, no border. Hover bg surface_alt #F1F3F6, active #E7EAEF. Used for 'Bearbeiten', 'Löschen', day prev/next arrows. Icon-only buttons get aria-label. Delete variant uses danger #B42318 text with hover background danger_soft #FDECEA.

### Button (danger, confirm dialog)

Height 44px, bg danger #B42318, text #FFFFFF, radius md, weight 600. Hover #971B12, active #7D160F. Only inside ConfirmDialog for the destructive confirm action; never the default focused button (default focus goes to 'Abbrechen').

### Field (Input / Date / Time / Number)

Label above input, 13px/500 fg_soft, margin-bottom 6px. Input: height 44px, padding 0 12px, radius sm=6px, bg surface, border 1px solid border #E2E5EA, font 15px, width 100%, box-sizing border-box. Focus: border accent #0E7C86 + outline 2px accent_soft. Error state: border danger #B42318, bg #FFFBFB, error text below 13px danger with 4px gap, prefixed by a 14px warning glyph (colour + glyph, never colour alone). Disabled: bg disabled_bg, text disabled_fg. Placeholder text muted #6B7280. Number inputs: text-align right, tabular-nums. Time input: tabular-nums, placeholder 'HH:MM'. Native date/time pickers allowed; no custom widget.

### FieldError

Rendered only after the field is touched (blur with change) or the form was submitted — an untouched form is neutral and shows nothing. Text 13px/400 danger #B42318, margin-top 4px, id linked via aria-describedby and aria-invalid=true on the input. Wording is German and field-specific, e.g. 'Bitte ein Ziel angeben.', 'Das Enddatum darf nicht vor dem Startdatum liegen.', 'Bitte eine gültige Uhrzeit im Format HH:MM angeben.', 'Die Kosten müssen eine Zahl ab 0 sein.'

### Card / Panel

bg surface #FFFFFF, border 1px solid border #E2E5EA, radius lg=16px, padding 24px (16px on viewports < 640px), shadow 0 1px 2px rgba(20,23,28,0.04). Section headings inside: size_h2, margin-bottom 16px. Cards never nest more than one level; lists inside a card use row separators instead of sub-cards.

### AppHeader / Navigation

Sticky top, height 64px desktop / 56px mobile, bg surface with bottom border 1px border, content in the max-width container. Left: product wordmark text 16px/600 'Reiseplaner' as a link to '/'. Right (desktop): text nav links 15px, 44px tall hit area, active = fg #14171C + 2px accent underline; inactive = muted #6B7280. Mobile (<640px): nav collapses into a 44x44px hamburger toggling a full-width dropdown panel with the same links at 48px row height. Trip-scoped nav (Tagesplan / Budget / Packliste) is a segmented row below the header, showing the trip name 19px/600 and the formatted date range underneath.

### SegmentedControl (trip sub-navigation & day selector)

Row of equal-weight segmented links/tabs, height 44px, radius md, bg surface_alt #F1F3F6, 1px border, 4px inner padding. Selected item: bg surface #FFFFFF, border 1px border_strong, text fg, weight 600. Unselected: text muted. Overflow behaviour: horizontally scrollable with no page-level horizontal scroll, snap to item, edge fade 16px. Used for Tagesplan | Budget | Packliste and for the day strip ('Tag 1 · Mo, 12.05.2025').

### TripCard (list item)

Card, full width, padding 20px 24px. Left block: destination as size_h2 (19px/600), underneath the date range 13px muted, then a caption line with '{n} Aktivitäten · {x} Einträge auf der Packliste'. Right block: actions 'Öffnen' (secondary button) plus ghost icon buttons 'Umbenennen' and 'Löschen' (with aria-label). Hover: border accent #0E7C86, shadow 0 2px 8px rgba(20,23,28,0.06). Whole card is clickable to the trip detail page, but the inner action buttons stop propagation. 16px gap between stacked cards.

### EmptyState

Centered inside a dashed 1px border-strong panel, radius lg, padding 48px 24px, max-width 560px, margin 0 auto. Simple inline SVG illustration (suitcase/route glyph, 64px, drawn with accent + border tones, 2 tones minimum — no grey box). Heading size_h2 'Noch keine Reisen geplant', one sentence of body text 15px muted explaining that trips live only in this browser, then a primary Button 'Erste Reise anlegen'. Variants used verbatim for: empty day plan ('Für diesen Tag ist noch nichts geplant.'), empty budget ('Noch keine Kosten erfasst.'), empty packing list ('Deine Packliste ist noch leer.'), and the 404 page ('Diese Seite gibt es nicht.' + secondary Button 'Zurück zur Reiseliste').

### BarChart (hand-built budget chart)

No chart library: one flex row per category, gap 12px, each row = label column (140px desktop / stacked 100% above the bar below 640px, 13px/500 fg_soft) + track (height 20px, bg surface_alt, radius pill, 1px inset border) + value column (right aligned, tabular-nums, 15px/600). Bar fill: width = value / maxCategoryValue * 100%, minimum visible width 4px for any value > 0, colour = the category colour token, radius pill, transition width 200ms ease-out. Zero-value categories render a 1px hairline in border tone plus value '0,00 €' and stay visible. Each row has aria-label 'Kategorie: Betrag' and the track uses role='img' with the same label for screen readers. A total row sits above the chart with the trip total, size_display-ish 26px/600 tabular-nums, caption label 'Gesamtsumme'. Axis-free by design; if helpful, one thin baseline in border tone at the top of the track column.

### ProgressIndicator (packing list)

Caption label 'Gepackt' left, counter '{checked} von {total}' right (tabular-nums, 13px/600). Track height 8px, radius pill, bg surface_alt #F1F3F6, 1px border; fill accent #0E7C86, radius pill, width = checked/total %, min-width 8px when checked > 0, transition width 200ms. At 100% the fill switches to success #067647 and the caption reads 'Alles gepackt'. Counter always shows '0 von {total}' when nothing is checked.

### Checkbox row (packing item)

Row min-height 44px, padding 8px 0, bottom border 1px border (last row none). 24x24px checkbox, radius sm, border 1px border_strong; checked = bg accent, white check glyph, and the item text gets line-through + muted #6B7280. Unchecked = surface + fg text. Label is a real <label for>, the whole row is clickable (not just the 24px box). Trailing ghost delete button with aria-label, 44x44px. Hover on the row: bg surface_alt.

### ListItem row (activity in the day plan)

Row grid: time column 64px (tabular-nums, 15px/600, fg), main column (place 15px/600, optional note 13px muted), category tag column, amount column 96px right-aligned tabular-nums 15px/600, actions 88px. Row min-height 56px, padding 12px 0, separated by 1px border lines. Below 640px the row stacks: line 1 time + category tag, line 2 place, line 3 amount right-aligned, actions as a 44px row of ghost buttons. Hover bg surface_alt. Time column stays tabular so lists never jitter.

### CategoryTag (Badge)

Pill, height 24px, padding 0 10px, radius pill, font 12px/500. Background = the category colour at 12% opacity (e.g. cat_verpflegung #B54708 → #FBF0E6), text = the full category colour, 1px matching border at 24% opacity. Six fixed labels, never invented at runtime: 'Anreise', 'Unterkunft', 'Verpflegung', 'Aktivität', 'Shopping', 'Sonstiges'. Colour is never the only signal — the label text always sits inside the badge.

### Modal / ConfirmDialog

Overlay bg rgba(20,23,28,0.48), dialog bg surface, radius lg, max-width 480px, width calc(100% - 32px), padding 24px, shadow 0 12px 32px rgba(20,23,28,0.18), centered; on <640px it docks to the bottom with radius lg lg 0 0 and slide-up 200ms. Title size_h2, one sentence of body copy naming what will be removed (e.g. 'Reise „Lissabon“ mit allen Aktivitäten und Packlisteneinträgen löschen?'), then actions right-aligned: 'Abbrechen' (secondary, initial focus) and the destructive confirm ('Löschen', danger). Esc closes, click on overlay closes, focus trapped inside, focus returns to the trigger. Identical dialog pattern used for activity deletion.

### Toast / InlineStatus

For confirmations after save/delete: 13px row above the affected list inside the card, bg accent_soft #E4F2F3 for success (border accent at 30%) or danger_soft #FDECEA for errors, radius sm, padding 8px 12px, auto-dismiss after 4s but also dismissible with a 44px close button. Announced via role='status'. Never used to report a broken-storage recovery (that must stay silent).

### TripForm (create / rename)

Fields in one column, 16px between fields, 24px before the action row: 'Ziel' (text), 'Startdatum' (date), 'Enddatum' (date). Actions: primary 'Reise speichern' / 'Änderungen speichern', secondary 'Abbrechen'. Same component for create and rename so labels, errors and spacing cannot drift; rename opens it pre-filled inside a dialog or inline on the detail page.

### ActivityForm

Fields: 'Uhrzeit' (time, HH:MM), 'Ort' (text), 'Kosten (€)' (number, min 0, step 0.01, right-aligned tabular-nums), 'Kategorie' (select with exactly the six fixed options, first option empty and invalid until chosen). 16px between fields; on ≥640px clock and amount may share a row. Submit primary 'Aktivität speichern', secondary 'Abbrechen'. Validation identical in create and edit mode.

### PackingListAddRow

Single-line form: text input (placeholder 'z. B. Zahnbürste') + primary icon+text button 'Hinzufügen', gap 8px. Below 640px it stacks with the button full width, both 44px tall. Empty input triggers the field error 'Bitte einen Eintrag eingeben.' and stores nothing.

## Layout Principles

- Container: max-width 1080px, centered, horizontal padding 24px; 16px padding below 640px. Content never exceeds this width — the budget chart and activity lists fill it, forms inside cards cap at 560px.
- Breakpoints: 360px (minimum supported, smartphone portrait), 640px (single column → up to two columns, nav becomes a real header row), 1024px (desktop: sticky header, day strip and content side by side where useful), 1440px (no further growth, only more whitespace). Nothing may overflow horizontally at 360px — long destination names wrap, the day strip scrolls internally, never the page.
- Vertical rhythm: page top padding 32px (24px mobile), 24px between page sections, 32px between major blocks (list ↔ chart ↔ packing list), 16px between stacked cards and rows. Section headings get 16px bottom spacing, labels 6px above their input, form fields 16px apart.
- Vertical flow per page: sticky header → page title row (h1 left, primary action right, wrapping to two stacked blocks under 640px) → trip-scoped segmented sub-nav (detail pages only) → content cards → closing whitespace 64px.
- Two-column desktop layouts only for form fields (clock + amount) and day strip + selected day plan; everything else stays one readable column. Side-by-side blocks are separated by 24px gap, not by borders.
- Grid: activity rows and chart rows use a CSS grid with fixed numeric columns (time 64px, amount 96px, actions 88px) so headings, bars and amounts align across all rows and all pages; numeric columns are right-aligned and tabular.
- Numbers and text formatting is global and identical on every screen: dates as DD.MM.YYYY (12.05.2025), date ranges joined with '–' ('12.05.2025 – 18.05.2025'), times always 24h HH:MM (09:30), amounts in euros with German formatting via Intl.NumberFormat('de-DE', {style:'currency', currency:'EUR'}) → '1.234,56 €', always two decimals, no space before €; day labels 'Tag 3 · Mi, 14.05.2025'; counts '{checked} von {total}' and '{n} Aktivitäten'.
- Colour usage: surfaces and text carry the layout, accent appears only on the primary action, active navigation, progress fill and bar chart. No gradients, no drop shadows beyond the two defined card/modal shadows, no accent-coloured body text. Category colours exist only inside tags and bars.
- Interaction: every visible control is either functional or visibly disabled (bg disabled_bg, text disabled_fg, cursor not-allowed, aria-disabled) — silently dead controls are not allowed. Touch targets are at least 44x44px on every breakpoint, including icon buttons and checkbox rows, with 8px minimum spacing between adjacent targets.
- Focus and accessibility: visible 2px focus ring (focus_ring, offset 2px) on all interactive elements, logical tab order, real <button>/<a>/<label> elements, colour never the sole carrier of meaning (status text plus colour, check glyph plus line-through), text contrast ≥ 4.5:1 — fg #14171C on bg #F6F7F9 and white on accent #0E7C86 both clear it.
- Empty, error and loading states are designed, not implicit: each list has an EmptyState variant with a specific sentence and a next action; field errors are inline under the field; a corrupted localStorage read results in the normal empty state with no warning message shown.
- Motion is minimal and functional: 200ms ease-out on bar widths, progress fills and modal fade/slide, 120ms on hover backgrounds; everything respects prefers-reduced-motion: reduce by dropping transitions.
