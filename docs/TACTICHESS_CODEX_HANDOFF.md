# TactiChess | Codex Project Handoff

## Required Codex workflow

Before starting work, read the local `AGENTS.md`, [Version control](VERSION_CONTROL.md), [Code style](CODE_STYLE.md), and the latest checkpoint in [Development documentation](DEVELOPMENT_DOCUMENTATION.md). Follow the version-control guide for branch handling, staged review, commits, pull requests, and recovery. Inspect and preserve existing work before making changes.

File-edit approval does not authorize Git mutations or deployment. Follow the guide's explicit approval gates, honor approvals already given, and present the concrete proposed commit and actual validation before requesting commit approval. These current workflow instructions apply alongside the historical project record below.

Updated: November 2, 2026
Project: TactiChess, offline ECLAT-powered chess tactic association explorer  
Current status: Stages 1-5 and approved local frontend migration Steps 1-6 are complete. Research Stage 6 remains open for separately approved protected deployment/access validation. See development checkpoint 7.12 for actual checks and limits.

## 1. Goal and scope

Build a responsive, static website where a learner selects a chess tactic, sees related tactics based on genuine co-occurrence in Lichess puzzles, examines the training-derived support, confidence, lift, and counts, and views real puzzles tagged with both tactics. Users can filter examples by rating and open the puzzle on Lichess.

- ECLAT ran **offline in Google Colab**. The website **does not rerun ECLAT** or train a model.
- Mine and present **two-item tactical pairs only**; no triples.
- This is association discovery, **not** chess move prediction, classification accuracy, causal inference, or proof of educational effectiveness.
- MVP excludes accounts/profiles, databases, backend APIs, and a playable chess engine. A correct static board preview and Lichess practice link suffice.
- Preserve the existing prototype's design where practical. Keep custom code and changes minimal. The approved implementation uses Vite + React, JavaScript/JSX, ordinary CSS, native hash navigation and dialogs, and cm-chessboard for static previews.
- Use the user-approved development plan and completed documentation for research decisions. Do not silently change model parameters or JSON metrics.

## 2. Completed research and data pipeline

| Stage | Actual outcome |
|---|---|
| 1. Acquire/sample/split | Scanned **6,157,341** Lichess source puzzles; excluded all **50,000** previously examined puzzle IDs; uniform reservoir sample **500,000**, seed **42**; random split **400,000 train / 100,000 test**, seed **43**; zero ID overlap. |
| 2. Training EDA | Training data passed reported missing/duplicate/basic numeric checks; **73** observed source themes; **47** eligible tactical themes (basic, advanced, checkmate patterns, selected special moves); **400,000** transactions, including **145,856** with zero motifs, **168,227** with one, **85,917** with two or more; **664** observed unordered candidate pairs. |
| 3. ECLAT + selection | ECLAT uses vertical theme → transaction-ID sets and intersections, exactly two items. Minimum support **0.002 = 800/400,000**. **30** frequent singleton themes; **58** frequent unordered pairs; **116** directional raw rules. Independent direct pair counting found **zero missed/unexpected/mismatched pairs**. |
| 4. Frozen holdout evaluation | All **58** pairs and **116** rules checked on **100,000** distinct test puzzles, no overlap; **55/58 = 94.83%** retained the 0.20% support threshold (200/100K); **zero undefined test confidences**; **12,304/100,000 = 12.304%** of test puzzles covered at least one selected pair. These are retention and coverage, **not accuracy**. |
| 5. Website JSON export | **48** curated directed rules, **20** starting themes, **34** unique unordered curated pairs; **506** pair-specific genuine puzzle example entries across 34 keys; **zero invalid candidate puzzle sequences** reported; JSON validation passed. |

The previous dataset and Colab notebooks are in Google Drive, not the website repository:
- Notebook: `TactiChess_V2_ECLAT_500K.ipynb`
- Drive root: `MyDrive/TactiChess_V2/`
- Samples: `data/lichess_sample_500k.csv`, `data/train_400k.csv`, `data/test_100k.csv`
- Training outputs: `outputs/frequent_pairs.csv`, `outputs/association_rules_all.csv`, `outputs/association_rules_curated.csv`
- Evaluation: `outputs/pair_evaluation_100k.csv`, `outputs/rule_evaluation_100k.csv`, `outputs/evaluation_summary.csv`
- Website exports: `exports/associations.json`, `exports/puzzles.json`, `exports/metadata.json`

Do **not** copy raw 500K/400K/100K CSV datasets into the website repository.

## 3. The 48 frozen rules

- **58 frequent unordered pairs** yielded **116 directional rules** (`A → B` and `B → A`). They share joint count, support, and lift, but confidence depends on the source theme.
- Selection was finalized **using training data only**: joint count ≥800, lift ≥**1.20**, exclude four semantically overlapping unordered pairs, rank by **confidence → joint count → lift** (descending) within each source theme, and keep **up to three recommendations per source theme**.
- Excluded unordered pairs: `advancedPawn + promotion`; `discoveredAttack + discoveredCheck`; `discoveredCheck + doubleCheck`; `discoveredAttack + doubleCheck`.
- This produced exactly **48 directional recommendations**, **34 unique unordered pairs**, and **20 starting themes**.
- **Frozen** means neither membership, rank, selection thresholds, nor training metrics are to be changed based on the 100K holdout results. The site must display **training** metrics, not holdout metrics.
- Example `fork → sacrifice`: joint count **5,259**, confidence ~**10.29%**, lift ~**1.38**, training support ~**1.31475%**.
- Support = pair_count / 400,000; confidence = pair_count / source_count; lift = confidence / (related_count / 400,000). Store the raw fractional values, format only for display.

## 4. Website JSON contract (already generated in Colab)

The **actual exports** are in `public/data/`. Do not regenerate, invent, or edit their numbers.

- `public/data/associations.json` (~17.4 KB): object with `themes` (20 objects `{id,name,description}`) and `rules` (48 objects with `source_theme`, `related_theme`, `pair_key`, `source_count`, `related_count`, `pair_count`, `support`, `confidence`, `lift`). `pair_key` is the two theme IDs alphabetically sorted and joined by `|`.
- `public/data/puzzles.json` (~293.3 KB): object keyed by `pair_key` (34 keys). Each value is a list of real example entries containing `puzzle_id`, `themes`, `rating`, `difficulty`, `original_fen`, `preview_fen`, `moves`, and `puzzle_url`. There are 506 total **entries**, not necessarily 506 distinct IDs. Candidate counts are up to 5 per pair per rating band.
- `public/data/metadata.json` (~0.8 KB): project/source/provenance, sample and split sizes, ECLAT support, curated lift threshold, rating-band descriptions, limitations.
- Rating groups used in exports: **Easy ≤1200**, **Medium 1201–1800**, **Hard >1800**. These are project-defined UI bands, not official Lichess classifications.
- **Critical chess detail:** Official Lichess `FEN` is the position **before** the opponent's first recorded UCI move. `preview_fen` has that first move already applied and represents the position where the learner starts solving. Render `preview_fen`, not `original_fen`, for the displayed puzzle start. The second UCI move begins the user's solution. The frontend does not need to recompute this.
- Practice links use `https://lichess.org/training/{puzzle_id}`. The sample generated URL was `https://lichess.org/training/2eQYf`. Manually QA that exported links open the intended puzzles.
- Rules must map to examples by `pair_key`; both directions of a pair use the same puzzle example list. Filtering example ratings must **not** change global ECLAT metrics.

## 5. Original prototype and current frontend

Original ZIP: `tacticpair_website_prototype(1).zip`, containing `tacticpair_site/index.html` and `tacticpair_site/README.md`.

The original prototype used inline CSS/JavaScript and fabricated demo associations/boards. The approved six-step migration replaced that implementation while retaining the design and sticky header.

Current entry points are `index.html`, `src/main.jsx`, and `src/App.jsx`. Page navigation is in `src/navigation.js`; components, features, styles, loading, and validation have focused modules under `src/`. Frozen exports are in `public/data/`, artwork/notices are in `public/chess/` and `public/licenses/`, and Node tests are in `tests/`. See [Code style](CODE_STYLE.md) for the module map.

Use the Vite commands in [Running the project](RUNNING.md), not `file://` or a source-folder Python server. Keep large research CSVs outside this repository.

## 6. Current approval gate and next phases

Approved frontend migration Steps 1-6 are complete locally: asset extraction, React/Vite setup, genuine JSON integration, filtering, static previews, and final local QA/documentation. The actual evidence is in development checkpoints 7.6-7.12. This does not mark protected deployment as complete.

Preserve the existing uncommitted work. No branch/staging/commit/push/deployment action is authorized by implementation approval. Present the concrete diff, proposed commit, checks, and limits before seeking Git approval. Follow [Version control](VERSION_CONTROL.md).

Before release, complete or explicitly accept the remaining manual screen-reader, physical-device, Firefox/WebKit, and browser-zoom checks. Deploy only after separate approval, then verify protected access for signed-out and authorized visitors on every intended deployment URL.

Keep the approved framework/dependencies and JSON schemas. ECLAT stays offline; boards render only `preview_fen`, use unchanged practice URLs, and disable moves. Never change frozen rules or recompute metrics when filtering examples. Artwork attribution and license notices must remain available.

Update the existing development record after approved work, distinguishing actual checks from plans and unverified behavior. Do not infer permission for a new feature, dependency, Git operation, or release from this checkpoint.

## 7. Authoritative supporting documentation

The source record before transfer is `TacticPair_V2_Development_Documentation_v1.4.md`, which documents Stages 1–5 in detail and the start of Stage 6.1. The original approved requirements are `TacticPair_V2_Comprehensive_Development_Plan(1).md`.

If those files are copied into `docs/`, read them for details. The current status and verified figures above take precedence over any older *planned* figure. Treat the actual JSON files as authoritative for runtime data, and do not assume their bytes are present until inspected locally.

## 8. Historical architecture-audit request (November 1, 2026)

This paragraph records the original audit request; the completed implementation and current approval gates above supersede its pending-work wording.

The user has renamed the project **TactiChess**. The old prototype and historic Colab/Drive filenames may retain older names, but frontend branding and future repository files must use TactiChess. Stage 6.1 now includes an evidence-based architecture review before any implementation: separate markup, styles, and JavaScript into appropriate modules/components, consider Vite + Preact vs Vite + vanilla modules, and search official documentation and maintained GitHub libraries for reusable static chessboard rendering. Favor minimum custom code and clean responsibilities over copying the entire single-file prototype. No changes are approved until the audit and plan are reviewed. Local `AGENTS.md` governs behavior and is not intended for Git tracking.
