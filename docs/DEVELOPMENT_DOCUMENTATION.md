# TactiChess
## Development and Research Documentation

Document version: 1.15\
Last updated: November 2, 2026\
Current status: Stages 1-5 completed; approved frontend migration Steps 1-6 completed locally; protected deployment and release approvals remain pending\
Notebook: `TactiChess_V2_ECLAT_500K.ipynb`  
Google Drive project folder: `MyDrive/TactiChess_V2/`

Codex must read the local `AGENTS.md`, [Version control](VERSION_CONTROL.md), [Code style](CODE_STYLE.md), and the latest checkpoint before starting work. Follow the version-control guide for repository operations and approval gates. Permission to edit files does not authorize Git mutations or deployment; preserve existing work and honor approvals already provided.

---

## 1. Project overview

TactiChess is an unsupervised chess tactic association explorer. It uses ECLAT to find pairs of tactical tags that frequently occur together in Lichess chess puzzles. A user will select a tactic and view related tactics, the strength of their observed associations, and real examples of puzzles containing both themes.

The algorithm discovers patterns in existing puzzle labels. It does not solve chess positions, predict good moves, establish causality, or measure a player's improvement.

### 1.1 Main project requirements

| Area | Agreed requirement |
|---|---|
| Source | Official Lichess open puzzle database |
| Sample | 500,000 puzzles selected uniformly from eligible source records |
| Earlier exploration | Exclude puzzle IDs from the previous 50,000-puzzle sample, if available |
| Data split | 400,000 training puzzles and 100,000 untouched testing puzzles |
| Leakage prevention | Split before analytical EDA; make all theme, threshold, and ranking decisions on training data |
| Mining algorithm | ECLAT using vertical transaction-ID sets and set intersections |
| Pattern size | Exactly two tactical themes per pair, with no three-item mining |
| Evaluation | Compare frozen training associations with the holdout; report stability and coverage, not classification accuracy |
| Website | Responsive static site using real exported association and puzzle JSON |
| Hosting | Access-controlled Vercel demonstration |

### 1.2 Six development stages

| Stage | Name | Status |
|---|---|---|
| 1 | Acquire, Sample, and Split Data | Completed |
| 2 | Training-Only EDA and Tactical Preprocessing | Completed |
| 3 | ECLAT Mining and Rule Selection | Completed |
| 4 | Held-Out Rule Evaluation | Completed |
| 5 | Export Validated Results for the Website | Completed |
| 6 | Website Integration and Vercel Validation | Local integration and QA complete; protected deployment pending |

This record will be revised after each stage is actually completed. Planned activities are not reported as results.

---

## 2. Stage 1: Acquire, Sample, and Split Data

Status: Completed and validated.

### 2.1 Purpose

Create a new, sufficiently large puzzle dataset and keep training and testing records separate before examining tactical patterns. Avoid reusing puzzle IDs examined in the earlier project version.

### 2.2 Source and collection method

- Source: `https://database.lichess.org/lichess_db_puzzle.csv.zst`.
- Dataset update recorded in the approved plan: October 5, 2026.
- Source records scanned: 6,157,341.
- Source format: compressed CSV using Zstandard, with 11 fields.
- Data was streamed directly into Colab and decompressed while being read. The full compressed source was not separately stored in Colab.
- Uniform reservoir sampling was used. This method examines all eligible records and gives each one an equal probability of selection, using a fixed-size sample rather than loading the entire source into memory.
- Sampling random seed: 42.

### 2.3 Exclusion of earlier puzzle IDs

The previous sample file was found at `MyDrive/TactiChess/TactiChess_50k_sample.csv`. Its 50,000 puzzle IDs were excluded before sampling. This prevents the new sample from reusing records known to have been examined previously.

### 2.4 Splitting method

After the 500,000-puzzle sample was selected, its records were randomly shuffled using a separate fixed seed, 43. The first 400,000 records were assigned to training and the remaining 100,000 to testing.

The train/test split was made before analytical examination of tactical-theme frequencies or associations.

### 2.5 Recorded results

| Item | Result |
|---|---:|
| Source records scanned | 6,157,341 |
| Earlier puzzle IDs excluded | 50,000 |
| Eligible source records | 6,107,341 |
| Sampled puzzles | 500,000 |
| Training puzzles | 400,000 |
| Testing puzzles | 100,000 |
| Train/test overlapping IDs | 0 |

The sampling and splitting cells passed their programmed uniqueness and non-overlap checks.

### 2.6 Saved files

| Google Drive path | Contents |
|---|---|
| `data/lichess_sample_500k.csv` | Complete 500,000-puzzle sample |
| `data/train_400k.csv` | Training records for analysis and ECLAT |
| `data/test_100k.csv` | Reserved evaluation records |

A separate metadata JSON was deliberately omitted to keep the student workflow simple. The source URL and random seeds are documented in the notebook and in this record. No source-file SHA-256 fingerprint was recorded, so reproducibility relies on the saved sample and the documented procedure rather than on a verified source-file hash.

---

## 3. Stage 2: Training-Only EDA and Tactical Preprocessing

Status: Completed and validated.

### 3.1 Purpose

Check the integrity of the 400,000 training records, identify every observed theme, classify themes according to the Lichess taxonomy, select appropriate tactical items, and prepare the transaction data for ECLAT.

No analytical inspection of the 100,000 testing puzzles was performed in this stage.

### 3.2 Training data integrity

The training CSV contained all 11 expected Lichess fields: `PuzzleId`, `FEN`, `Moves`, `Rating`, `RatingDeviation`, `Popularity`, `NbPlays`, `Themes`, `GameUrl`, `OpeningTags`, and `DailyDate`.

| Check | Reported result |
|---|---:|
| Training records | 400,000 |
| Duplicate puzzle IDs | 0 |
| Missing puzzle IDs | 0 |
| Missing theme fields | 0 |
| Missing FEN fields | 0 |
| Missing move fields | 0 |
| Invalid Rating values | 0 |
| Invalid RatingDeviation values | 0 |
| Invalid Popularity values | 0 |
| Invalid NbPlays values | 0 |

No training rows needed removal under these checks. The checks did not establish that every chess position or puzzle solution was semantically valid; preview verification remains a later task.

### 3.3 Theme inventory and classification

Across the training records, 73 unique Lichess themes were observed. Every observed theme was recognized by the category mapping, with zero unrecognized labels.

The original proposal of 25 tactical themes was expanded after review. The resulting 47-theme candidate vocabulary includes:

| Included category | Number of defined theme identifiers | Purpose |
|---|---:|---|
| Basic tactical motifs | 14 | Common tactical mechanisms, such as forks, pins, and sacrifices |
| Advanced tactical motifs | 11 | Techniques such as attraction, clearance, and deflection |
| Checkmate patterns | 19 | Specific mating patterns, such as back-rank mate |
| Selected special moves | 3 | Promotion, underpromotion, and en passant |
| Total | 47 | Candidate items for association mining |

The excluded categories include game phase, solution length, general goals and mate length, game origin, and castling. These labels can be useful as metadata, but would often produce less meaningful associations in a tactic-to-tactic explorer.

### 3.4 Transaction preparation

One unique puzzle ID was treated as one transaction. Each transaction contains the set of eligible tactical themes attached to its puzzle:

- The original Themes field was separated into individual labels.
- Duplicate labels within a puzzle were removed.
- Only items in the approved 47-theme vocabulary were retained.
- Puzzles with zero or one eligible tactical theme were kept.
- All 400,000 training puzzles remained in the denominator for support calculations.

### 3.5 Recorded transaction results

| Measure | Count | Share of training puzzles |
|---|---:|---:|
| Zero eligible tactical themes | 145,856 | 36.46% |
| Exactly one eligible tactical theme | 168,227 | 42.06% |
| Two or more eligible tactical themes | 85,917 | 21.48% |
| Total transactions | 400,000 | 100% |

All 47 eligible themes appeared at least once. Independent descriptive counting found 664 distinct unordered two-theme pairs before any minimum-support filtering.

### 3.6 Important observations

The most frequent eligible themes included fork (51,132 puzzles), kingsideAttack (35,224), sacrifice (29,895), advancedPawn (24,723), defensiveMove (24,123), and pin (24,007).

The 10 most common observed pairs began with:

| Pair | Joint count |
|---|---:|
| advancedPawn + promotion | 9,711 |
| attraction + sacrifice | 8,532 |
| kingsideAttack + sacrifice | 6,022 |
| fork + sacrifice | 5,259 |
| discoveredAttack + discoveredCheck | 5,126 |

The first and fifth pairs illustrate possible semantic overlap. High co-occurrence can reflect related tag definitions rather than independently informative tactics.

Only 85,917 training puzzles have at least two selected motifs, setting an upper bound of 21.48% for coverage by any two-item association among this vocabulary.

---

## 4. Stage 3: ECLAT Mining and Rule Selection

Status: Completed and validated.

### 4.1 Purpose

Use ECLAT to find frequent pairs of tactical themes in the training transactions, verify the mining results independently, calculate directional association rules, and select a limited set of recommendations suitable for the website.

### 4.2 How ECLAT was implemented

A vertical transaction-ID representation was constructed. For each theme, the system stored the set of training transaction indices containing that theme. The intersection of two themes' index sets identifies puzzles containing both themes; the size of the intersection is their joint count.

Only pairs of two frequent themes were considered. No three-item itemsets were generated. Single-theme frequencies were retained to calculate confidence and lift.

### 4.3 Frozen mining settings

| Setting | Value |
|---|---|
| Training denominator | 400,000 |
| Candidate themes | 47 |
| Minimum support | 0.002, or 0.20% |
| Minimum joint frequency | 800 training puzzles |
| Maximum itemset size | 2 |
| Mining approach | Vertical transaction-ID set intersection |

The threshold of 800 applied to both frequent single themes and frequent pairs. It was chosen on the training side of the split.

### 4.4 Mining correctness

| Measure | Result |
|---|---:|
| Frequent single themes | 30 |
| Frequent unordered pairs | 58 |
| Directional rules | 116 |
| Missing frequent pairs compared with independent counting | 0 |
| Unexpected frequent pairs | 0 |
| Incorrect joint counts | 0 |

The independent direct pair counts calculated in Stage 2 exactly matched the ECLAT result. This validates the counted pairs, not the educational value of the associations.

### 4.5 Association metrics

Each frequent unordered pair yielded two directed rules, one in each direction.

- Support: joint pair count divided by all 400,000 training puzzles.
- Confidence for A to B: joint count divided by the number of training puzzles containing A.
- Lift for A to B: confidence divided by the training prevalence of B.

Support and lift are identical in both directions of a pair, whereas confidence usually differs. Lift above 1 indicates positive co-occurrence relative to independence; it does not prove causality or instructional usefulness.

Examples from the training results:

| Directed association | Joint count | Confidence | Lift |
|---|---:|---:|---:|
| attraction → sacrifice | 8,532 | 58.69% | 7.85 |
| sacrifice → attraction | 8,532 | 28.54% | 7.85 |
| fork → sacrifice | 5,259 | 10.29% | 1.38 |
| promotion → advancedPawn | 9,711 | 99.98% | 16.18 |
| discoveredCheck → discoveredAttack | 5,126 | 73.85% | 14.63 |

The near-perfect confidence of promotion → advancedPawn illustrates a redundant or nearly definitional association rather than necessarily a useful recommendation.

### 4.6 Curation decisions

The initial review produced 49 candidate directed recommendations across 21 starting themes. A final training-only curation step was then applied:

1. Retain rules with lift at least 1.20.
2. Exclude the four unordered semantic-overlap pairs listed below.
3. Rank each starting theme's rules by descending confidence, then descending joint count, then descending lift.
4. Retain at most three related themes for each starting theme.

Excluded unordered pairs:

- advancedPawn + promotion
- discoveredAttack + discoveredCheck
- discoveredCheck + doubleCheck
- discoveredAttack + doubleCheck

These exclusions affect only curated website recommendations. The underlying mined results remain preserved.

### 4.7 Final curated results

| Measure | Final result |
|---|---:|
| Curated directional recommendations | 48 |
| Starting themes with a recommendation | 20 |
| Minimum curated lift | 1.20 |
| Maximum recommendations per starting theme | 3 |

Examples include attraction → sacrifice, fork → sacrifice, kingsideAttack → sacrifice, and zugzwang → quietMove. The 48 selected rules and their ordering were frozen before test-data evaluation.

### 4.8 What the 48 frozen rules mean

ECLAT initially identified **58 unordered tactical pairs** satisfying the minimum support threshold of 800 training puzzles. Each unordered pair can produce two *directional* recommendations: theme A → theme B and theme B → theme A. This gives **116 raw directional association rules**. The rule direction matters because the confidence denominator changes with the starting theme. The two directions share the same pair count, support, and lift.

A **frozen rule** is a directional recommendation that passed the finalized training-only selection criteria. These criteria retained positive associations with lift at least 1.20, excluded four conceptually overlapping pairs, ranked by confidence followed by joint count and lift, and kept at most three recommendations for each starting theme. The finalized results contain **48 directional rules** representing **34 distinct unordered pairs** and **20 starting themes**. The number of directions retained differs by pair because the top-three ranking is applied separately to each starting theme.

For example, **fork → sacrifice** is one of the selected directions: 5,259 of the 400,000 training puzzles contain both themes (support about **1.315%**). Of the 51,132 training puzzles bearing fork, about **10.29%** also bear sacrifice (confidence). The pair's lift is about **1.38**, indicating more co-occurrence than under statistical independence. The reverse direction, sacrifice → fork, has a different confidence because the denominator is the number of sacrifice-tagged puzzles.

The term *frozen* means that this exact set of rules, their ordering, their selection conditions, and the original training measurements were fixed **before** examination of the independent test results. Even if a pair becomes less frequent in the test dataset, it is **not** removed or replaced on the basis of that result. Changing the rule selection after viewing the holdout would turn the holdout into development data and undermine its independence.

These are associations between Lichess puzzle *tags*, not chess moves or instructions on how to solve a position. The website will display the frozen **training-derived** support, confidence, and lift; the held-out measures will be presented separately as evaluation findings, not substituted for the original rule values.

### 4.9 Saved Stage 3 files

| Google Drive path | Contents |
|---|---|
| `outputs/frequent_pairs.csv` | 58 frequent unordered pairs and training counts/support |
| `outputs/association_rules_all.csv` | 116 directed training rules with support, confidence, lift, and counts |
| `outputs/association_rules_curated.csv` | 48 selected directed rules for prospective website recommendations |

---

## 5. Stage 4: Held-Out Rule Evaluation

Status: Completed and validated on November 1, 2026.

### 5.1 Purpose

Test whether associations mined and selected on 400,000 training puzzles are also present in 100,000 previously untouched test puzzles. The mining threshold, curated-rule selection rules, semantic exclusions, and ranking remained fixed. No new pairs were mined on the test set, and no parameters were changed after examining the evaluation.

### 5.2 Data and separation checks

The test CSV and the three saved Stage 3 outputs were loaded. The training and test puzzle ID sets were checked for overlap before evaluation.

| Validation | Result |
|---|---:|
| Testing puzzles | 100,000 |
| Previously mined unordered pairs | 58 |
| Original directional rules | 116 |
| Curated directional recommendations | 48 |
| Overlapping training and test puzzle IDs | 0 |

### 5.3 Evaluation method

- For each theme appearing in the existing training rules, the evaluation collected the indices of test puzzles bearing that theme.
- For each of the **58 frozen pairs**, the intersection of its two test-side theme-index sets provided the test joint count. Pair support was calculated by dividing that count by 100,000.
- The original 0.20% minimum support was applied proportionally: 800 out of 400,000 in training corresponds to 200 out of 100,000 in testing. The test threshold was used to assess retention, not to select replacement rules.
- For each of the **116 original directional rules**, test confidence and lift were calculated from test joint and single-theme counts, and then compared with training values.
- For website coverage, the 48 curated directional rules were reduced to **34 distinct unordered pairs**. Each test puzzle containing at least one of those pairs was counted once.
- The original training values were preserved. The test results are diagnostic measurements and do not represent classification accuracy or proof of educational effectiveness.

### 5.4 Final quantitative results

| Measure | Actual result |
|---|---:|
| Test puzzles | 100,000 |
| Frozen frequent pairs evaluated | 58 |
| Pairs still meeting 0.20% test support | 55 |
| Pairs below 0.20% test support | 3 |
| Support retention rate | 94.83% (55/58) |
| Original directional rules evaluated | 116 |
| Rules with undefined test confidence | 0 |
| Curated directional recommendations | 48 |
| Distinct curated unordered pairs | 34 |
| Test puzzles covered by curated pairs | 12,304 |
| Curated pair coverage | 12.304% |

These results support good **threshold retention** for the original frequent pairs in this holdout, although retention alone does not show that every rule has stable confidence or lift. The three pairs below the support threshold are retained in the frozen records; they were not removed or replaced based on test outcomes. Their identities were not included in the shared Stage 4 output excerpt.

### 5.5 Example pair-support comparisons

Support is expressed below as a percentage of all puzzles within the respective split. Support differences use *percentage points* (test minus training), not percentage changes.

| Tactical pair | Training count | Test count | Training support | Test support | Difference (percentage points) |
|---|---:|---:|---:|---:|---:|
| advancedPawn + promotion | 9,711 | 2,383 | 2.42775% | 2.383% | -0.04475 |
| attraction + sacrifice | 8,532 | 2,120 | 2.133% | 2.120% | -0.01300 |
| fork + sacrifice | 5,259 | 1,320 | 1.31475% | 1.320% | +0.00525 |
| backRankMate + sacrifice | 3,446 | 862 | 0.8615% | 0.862% | +0.00050 |
| advancedPawn + discoveredCheck | 984 | 246 | 0.246% | 0.246% | 0.00000 |

The smallest reported absolute differences were advancedPawn + discoveredCheck (0), backRankMate + sacrifice (0.000005 support units), and discoveredCheck + doubleCheck (0.000017 support units). The largest were advancedPawn + promotion (-0.0004475 support units), advancedPawn + deflection (+0.0003625), and advancedPawn + quietMove (+0.0003525). Even the largest displayed difference is below 0.05 percentage points; this describes the observed results, not a formal statistical significance test.

### 5.6 Example directional rule comparisons

| Directional rule | Training confidence | Test confidence | Training lift | Test lift |
|---|---:|---:|---:|---:|
| attraction → sacrifice | 58.69% | 57.67% | 7.85 | 7.69 |
| sacrifice → attraction | 28.54% | 28.26% | 7.85 | 7.69 |
| kingsideAttack → sacrifice | 17.10% | 17.02% | 2.29 | 2.27 |
| fork → sacrifice | 10.29% | 10.29% | 1.38 | 1.37 |
| promotion → advancedPawn | 99.98% | 100.00% | 16.18 | 16.01 |

The displayed examples show similar measurements across the splits. The nearly perfect promotion → advancedPawn confidence remains a case of semantic overlap, rather than automatically a useful recommendation.

### 5.7 Coverage interpretation and limitations

The curated rules matched **12,304 distinct test puzzles**, giving **12.304% coverage** among all 100,000 test puzzles. A puzzle matching more than one curated pair was counted once. Coverage indicates how often website-ready tactic pairs occur in the held-out sample; it is not a model accuracy score, user satisfaction metric, or evidence of learning improvement.

Coverage is constrained by the project definition: a puzzle needs at least two eligible tactical tags and must match one of the **34 curated pairs**. Using the full 100,000-test-puzzle denominator is consistent with the training methodology. Higher coverage could require changing selection criteria, but doing so **after** this evaluation would compromise its unbiased status; no such changes were made.

The 94.83% threshold-retention rate does not establish formal statistical significance, and the supplied output does not identify the three pairs that fell below the test-support cutoff. Those details can be consulted in the saved full pair-evaluation CSV without changing the frozen rules.

### 5.8 Saved Stage 4 files

| Google Drive path | Contents |
|---|---|
| `outputs/pair_evaluation_100k.csv` | Frozen-pair training/test counts, support, differences, and test threshold retention |
| `outputs/rule_evaluation_100k.csv` | All 116 directional rule comparisons, including counts, support, confidence, lift, and differences |
| `outputs/evaluation_summary.csv` | Overall retention, curated pair count, and coverage |

### 5.9 Stage 4 decision

The evaluation completed without changing ECLAT, support threshold, motif vocabulary, semantic exclusions, or the 48 curated rules. The same saved curated training rules will be used for website JSON export in Stage 5, while test results remain documented separately and must not be displayed as if they were training-derived rule values.

---

## 6. Stage 5: Export Validated Results for the Website

Status: Completed and validated on November 1, 2026, according to the user's Colab outputs. The website integration itself has not started.

### 6.1 Purpose

Convert the completed ECLAT work into compact, genuine JSON assets for the website. The exported associations must preserve the frozen **training-derived** metrics; the practice examples must come from real training puzzles. The 100,000-puzzle test split remains dedicated to evaluation and was not used to select website examples or change rule values.

The three planned files were `associations.json`, `puzzles.json`, and `metadata.json`, saved under `MyDrive/TactiChess_V2/exports/`. Website metadata is separate from the optional sampling metadata omitted in Stage 1.

### 6.2 Step 5.1: Load and check project data

The training CSV and finalized curated-rule CSV were loaded into Colab. A chess-rules library was made available for validating puzzle positions and recorded move sequences. The export directory was prepared.

| Reported check | Result |
|---|---:|
| Training puzzles loaded | 400,000 |
| Frozen directional recommendations loaded | 48 |
| Starting themes covered | 20 |
| Export directory | Created successfully |

This step reused completed results, without new ECLAT mining or test-based model selection.

### 6.3 Step 5.2: Export associations and theme descriptions

The 48 selected directional rules were converted from CSV to structured JSON without changing their training support, confidence, lift, or counts. Twenty readable tactical theme names and descriptions were included for the interface.

Each directed rule records its starting theme, related theme, supporting counts, support, confidence, and lift. Both directions of one unordered pair share a `pair_key`, constructed from the alphabetically sorted theme identifiers. This lets the interface retrieve the same examples for A → B and B → A without incorrectly treating them as different underlying puzzle combinations.

| Reported output | Result |
|---|---:|
| Theme descriptions | 20 |
| Directed association rules | 48 |
| File | `exports/associations.json` |
| Reported size | 17.4 KB |

The curated rules remain **frozen**: 58 initially mined unordered pairs generated 116 raw directions, and the training-only curation reduced these to 48 directions covering 34 unordered pairs and 20 starting themes. Their selection was completed before held-out evaluation; Stage 5 simply exports that final set.

### 6.4 Step 5.3: Select genuine matching puzzles

Real example puzzles were selected from `train_400k.csv` for each of the **34 distinct curated pairs**. A candidate puzzle needed both tags of its pair. Candidate selection was shuffled reproducibly using a fixed random seed, and examples were divided into project-defined rating groups:

| Rating group | Range | Target number per pair |
|---|---|---:|
| Easy | 1,200 or below | Up to 5 |
| Medium | 1,201–1,800 | Up to 5 |
| Hard | Above 1,800 | Up to 5 |

These are convenient website filter bands, **not official Lichess difficulty classifications**. A pair may have fewer than five suitable examples in a band; the code does not fabricate missing puzzles.

The original `FEN` is Lichess's position before the opponent's initiating move. For each chosen example, the export validated the original chess position and every recorded move, applied the first UCI move, and saved the resulting **preview FEN** so that the website can show the player's move-ready position. Each exported example also contains the puzzle ID, the actual tags, numeric rating, move sequence, rating band, original FEN, and Lichess practice URL.

| Reported output | Result |
|---|---:|
| Distinct curated pairs with examples | 34 |
| Puzzle example entries exported | 506 |
| Maximum possible at 15 entries per pair | 510 |
| Difference from maximum | 4 entries |
| Invalid candidate puzzles skipped | 0 |
| File | `exports/puzzles.json` |
| Reported size | 293.3 KB |

**Interpretation:** 506 of the maximum 510 pair-specific example slots were filled (99.22%). This count is of *exported example entries*, not necessarily 506 distinct puzzle IDs, because one puzzle can legitimately match multiple tactic pairs. The four unfilled slots may reflect insufficient examples in certain rating bands; the shared summary does not identify the affected pairs. Zero skipped invalid candidates is the code's reported validation result, not a guarantee that the source tags are instructionally perfect.

### 6.5 Step 5.4: Export website metadata and validate JSON

The website metadata JSON records project provenance and presentation parameters, including Lichess as source, the 500,000-puzzle sample, 400,000 training and 100,000 testing split, two-item ECLAT, 0.002 minimum support, 1.20 minimum curated lift, fixed random seeds, rating bands, and limitations. It contains descriptive facts, not a new mining model.

The export files were reopened and checked. Validation included the rule count, unique curated-pair count, training-support and training-confidence formulas, the presence of each rule's shared pair key in the puzzle export, each exported puzzle's two required tags, expected Lichess URL structure, and validity of the saved preview positions.

| Reported validation | Result |
|---|---|
| Overall JSON integrity test | Passed |
| Rules in association export | 48 |
| Unique pair keys in puzzle export | 34 |
| Training-derived metrics | Formula checks passed |
| Puzzle theme matching | Checks passed |
| Corrected preview FEN | Validity checks passed |
| File | `exports/metadata.json` |
| Reported size | 0.8 KB |

The program printed the example URL `https://lichess.org/training/2eQYf`. The URL opens a Lichess Puzzles page in a browser check. The page's retrieved text did not independently confirm the puzzle-specific board or move line, so a manual in-browser check of sample exported puzzles remains a Stage 6 quality-assurance item.

### 6.6 Stage 5 deliverables and completion decision

| Google Drive file | Actual purpose |
|---|---|
| `exports/associations.json` | 20 theme descriptions and 48 frozen directed rules with genuine training metrics |
| `exports/puzzles.json` | 506 real pair-matching puzzle entries across 34 pair keys, including corrected preview FEN |
| `exports/metadata.json` | Source, algorithm, parameters, data sizes, rating bands, and limitations |

The user reported `STAGE 5 JSON VALIDATION PASSED`; all three files were saved. Stage 5 is marked complete on the basis of those reported Colab validation outputs, without independently inspecting the Google Drive JSON bytes in this conversation. No new source data, model training, or changes to the frozen rule selection were required.

---

## 7. Stage 6: Website Integration and Vercel Validation

Status: **Local frontend migration Steps 1-6 are complete. Genuine data, filtering, static previews, page navigation, and local QA are implemented. Stage 6 remains open for separately approved protected Vercel deployment and access validation.**

### 7.1 Stage 6 objective

Integrate the three validated JSON files into the existing responsive static website, replace illustrative associations and chessboards with real data, verify interactions and puzzle links, and deploy an access-controlled Vercel demonstration. ECLAT was already run offline in Colab; the website will read and display its frozen results rather than rerun mining.

### 7.2 Step 6.1: Audit and prepare the website files

The following records the original preparation discussion. Its single-file recommendation and pending local-file transfer are superseded by the November 2, 2026 checkpoint in Section 7.3. Historical project and Drive paths below are retained as recorded.

**Inspection completed:** The attached `tacticpair_website_prototype(1).zip` contains a `tacticpair_site/` directory with `index.html` and `README.md`. The HTML currently includes both CSS and JavaScript inline, so no framework, package installation, database, or build tooling is needed. Its `themes`, `pairs`, and `boards` JavaScript variables contain demo content, not the Colab exports. The present practice-board previews are synthetic, and the current support slider was designed for illustrative percentages. The code does not yet load JSON files.

**Preparation selected:** Keep the prototype's structure simple for the MVP instead of unnecessarily splitting HTML, CSS, and JavaScript. Extract the ZIP to a local folder named `TacticPair_website`, create a `data` subfolder, and place the three exact Stage 5 files in it:

| Intended local path | Contents |
|---|---|
| `TacticPair_website/index.html` | Existing responsive prototype, unchanged in Step 6.1 |
| `TacticPair_website/README.md` | Existing prototype instructions; revise after integration |
| `TacticPair_website/data/associations.json` | 48 frozen directional rules and 20 theme descriptions |
| `TacticPair_website/data/puzzles.json` | 506 verified example entries arranged by 34 pair keys |
| `TacticPair_website/data/metadata.json` | Model source, parameters, sizes, and limitations |

**Why this step exists:** It separates the website's compact deployment assets from the 500K raw sample and both train/test CSV files. No analysis file or testing data should be placed in the website directory. A local HTTP server will be used for JSON fetching during subsequent integration because opening a page directly as `file://` can block local `fetch()` requests.

**Status and checkpoint:** The project ZIP and its contents were inspected in this conversation. Local extraction, copying the three JSON files from Google Drive, and opening the folder in VS Code remain for the user to perform. Step 6.2 must not begin until the user explicitly confirms that the folder is prepared. The current prototype may still show demo metrics during Step 6.1; this is expected.

### 7.3 November 2, 2026: Frontend migration Step 1 completed

The actual TactiChess checkout was inspected, including the three JSON exports. The user selected a staged Vite + React migration, with this implementation approval limited to extracting the existing assets and establishing parity. This does not mark the remaining Stage 6 integration work complete.

- Extracted the complete inline stylesheet into `src/styles/site.css` and the existing demo script into `src/main.js`. The extracted contents are byte-identical to their original blocks, and HTML outside those blocks is unchanged apart from the external asset references.
- Preserved CSS order, responsive breakpoints, existing markup, demo metrics, board layouts, selection, sorting, filters, reset, and modal behavior. The existing visible prototype branding remains for the later branding/integration step.
- Updated the README with the local HTTP command and the requirement to retain the external assets alongside the HTML entry point.
- No packages were installed. No Vite/React scaffolding, JSON integration, data relocation, staging, commits, pushes, or deployment occurred. Pre-existing changes to `.gitignore` and the handoff were preserved.

Validation performed:

- `node --check src/main.js` passed, and `git diff --check` passed.
- All 32 automated assertions passed in isolated headless Chrome before and after extraction. They exercised the six theme selectors, three sort modes, association selection, all difficulty buttons, support filtering and recovery, empty states, reset, modal opening and all four dismissal paths, initial modal focus, navigation anchors, and external-link protection. Captured rendered list and board markup matched before and after.
- Desktop screenshots at 1440 × 2000 and narrow-screen screenshots at 500 × 3800 were inspected and compared. Both before/after PNG pairs were byte-identical. A 390-pixel capture was excluded because it clipped Chrome's minimum headless viewport.
- Local HTTP requests returned 200 with the expected HTML, CSS, and JavaScript content types. All three frozen JSON SHA-256 hashes remained unchanged.

Limitations: verification used headless Chrome, not a physical mobile device or a manual screen-reader session. Desktop browser access was unavailable. No build or lint scripts exist at this step, so no build or lint run is claimed. The temporary browser harness and screenshots are not project deliverables. The website still displays labeled demo content and does not load the exports.

Next approval gate: frontend migration Step 2, minimal Vite + React setup and a component migration preserving the existing behavior. JSON integration and subsequent stages remain separately approval-gated.

### 7.4 November 2, 2026: Readability and shared code style

Before Step 2, the user approved a readability pass and documentation for developers and agents. Formatted `index.html`, `src/main.js`, and `src/styles/site.css` with two-space indentation, expanded blocks and HTML templates, blank lines between related sections, and brief comments. Added braces around single-statement conditionals without changing their behavior. Existing selectors, responsive breakpoints, demo content, and interaction defaults were retained.

Added `.prettierrc.json` and `.prettierignore` so formatting is repeatable and the frozen exports are excluded. Used the Prettier 3.7.4 installation already bundled with the local VS Code extension; no packages were installed. Added [Code style](CODE_STYLE.md), linked it from the README, and added a pointer in the local agent instructions. The guide covers indentation, naming, brief comments, inline whitespace, CSS order, formatting, verification, and approval boundaries.

Validation performed:

- The formatter check, `node --check src/main.js`, and `git diff --check` passed.
- All 32 headless Chrome assertions passed before and after the readability pass, covering the existing controls and preview dismissal paths.
- Desktop screenshots at 1440 × 2300 and narrow-screen screenshots at 500 × 3800 were byte-identical before and after. Formatting initially introduced a space before inline punctuation; the final markup preserves the original spacing using narrowly placed formatter-ignore comments.
- All 163 parsed CSS rules retained their order and values, apart from equivalent whitespace and numeric notation in a custom property. The three frozen JSON hashes and unrelated pre-existing user files remained unchanged.

Limitations: checks used headless Chrome rather than a physical mobile device or manual screen-reader session. No Vite/React setup, data integration, package installation, staging, commit, push, or deployment occurred. Temporary verification files were removed after checking. Step 2 remains separately approval-gated.

### 7.5 November 2, 2026: Page and feature responsibilities separated

The user approved breaking down the remaining page markup before Step 2. `index.html` is now a 24-line document shell, and `src/main.js` only composes the page and starts features. Separate native modules own navigation, introduction, explorer markup and behavior, project information, demo data, board rendering, and the preview dialog. See the [current module map](CODE_STYLE.md#current-module-map).

The explorer retains one local state object and its original filtering and rendering flow. It receives a callback for opening previews rather than owning dialog markup or dismissal events. The preview component receives its board renderer; the pure board renderer receives a position array. These narrow function boundaries apply single responsibility and dependency separation without adding classes, a generic framework, packages, or a backend. Existing demo content and visible design were preserved.

The browser loads these files through native module imports, so the documented local HTTP server is required. No HTML-fragment loader or additional fetch layer was introduced. With JavaScript disabled, the shell displays a message explaining that the explorer requires JavaScript. README, run instructions, code-style guidance, and the local agent instructions were updated.

Validation performed:

- Syntax checks and the formatter check passed for all nine JavaScript modules and the HTML entry point. `git diff --check` passed.
- All 32 browser assertions passed before and after the split. Rendered theme lists, association lists, puzzle lists, hero boards, modal boards, and preview descriptions matched exactly.
- Desktop screenshots at 1440 × 2300 and narrow-screen screenshots at 500 × 3800 were byte-identical to the baseline. Final headless Chrome checks ran sequentially with sufficient module-loading time.
- All module URLs returned 200 with JavaScript content types. The existing stylesheet, all frozen JSON exports, formatter configuration, and unrelated user files retained their SHA-256 hashes.

Limitations: verification used headless Chrome, not a physical phone or manual screen-reader session. The interface still uses demo content. No React/Vite setup, genuine JSON loading, packages, staging, commits, pushes, or deployment were added. Temporary verification files were removed after checking. Step 2 remains separately approval-gated.

### 7.6 November 2, 2026: Sticky header

The user approved a sticky header before Step 2. The header now stays at the top while scrolling, with an opaque background matching the page. Its stacking order remains below the preview overlay. A shared responsive height variable preserves the existing desktop and narrow-screen heights and provides anchor-scroll spacing so linked sections are not hidden beneath the header.

Eight headless Chrome assertions passed at both desktop and narrow-screen widths: sticky positioning, background, responsive height, scrolling, anchor visibility, overlay layering, preview dismissal, and the initial top-of-page layout. The stylesheet formatter check and `git diff --check` passed. HTML, all JavaScript modules, frozen JSON, and unrelated user files remained unchanged. No packages or Step 2 work were added; temporary verification files were removed.

### 7.7 November 2, 2026: Frontend migration Step 2 completed

The user approved Step 2 only: minimal Vite + React setup and a component migration preserving the existing design and demo behavior. No scaffolding template was copied. The original CSS and demo arrays remain byte-identical, including the responsive sticky header. The HTML shell now mounts one React root; `src/main.jsx` enables Strict Mode, and `src/App.jsx` composes the page.

- Verified the exact approved versions against the npm registry before installation: `react` and `react-dom` **19.3.1**, Vite **8.3.5**, and `@vitejs/plugin-react` **6.1.2**. All four declare MIT licenses. Their Node requirements and peer requirements are compatible with the installed Node **24.13.0** and npm **11.6.2**. No React Compiler, board library, router, state library, TypeScript, or UI framework was added.
- Added `package.json`, lockfile version 3, and the standard Vite React plugin configuration. Scripts provide loopback-only development serving, static production builds, local production preview, and Node's built-in test runner. The installation reported zero vulnerabilities. Generated `node_modules/` and `dist/` are ignored, preserving existing ignore entries.
- Converted page markup to JSX components. Explorer state is shared by controlled filters and result components; pure selectors handle demo sorting, filtering, defaults, and selection fallback without mutating source data. Stable keys preserve control identity and focus. Superseded native DOM-rendering modules and delegated listeners were removed.
- The demo preview is rendered through a React portal. Its effect handles Escape, scroll locking, initial focus, and cleanup, including restoring the opening control's focus. The existing overlay design and dismissal paths remain. Native `<dialog>` and genuine FEN-board integration remain part of the later preview step.
- Updated README, [run instructions](RUNNING.md), [code style and module map](CODE_STYLE.md), and the local agent guidance. Source startup now requires Vite; the previous Python-only source-server instructions have been replaced.

Validation performed:

- `npm.cmd test`: **7/7 tests passed**, covering demo defaults/reset, descending sorts, inclusive support boundaries, nonmutation, selection fallback, empty results/recovery, theme changes, and difficulty-independent metrics.
- `npm.cmd run build` passed. Final output: HTML **0.77 kB**, CSS **17.64 kB** (**4.96 kB gzip**), and JavaScript **237.47 kB** (**73.56 kB gzip**), as reported by Vite. The JSON exports are not imported or copied into this build.
- The pre-migration baseline passed **66/66** browser assertions. React development mode and the production preview each passed the expanded **80/80** assertions at desktop **1440 ? 2300** and narrow **500 ? 3800** viewports. Checks covered all existing controls, sorting, filters, empty states, reset, preview dismissal, repeated reopening, focus retention/restoration, external-link protection, sticky scrolling, anchor spacing, overlay layering, and absence of genuine-data requests. No JavaScript exceptions or application resource errors were observed; the baseline static server's missing favicon was unrelated to application behavior.
- Compared and inspected desktop/narrow screenshots. Visible text, hero-board contents, and measured page-section positions and dimensions matched the baseline. The final captures differed by **38 pixels per viewport**, confined to the small result-count text; this is visual parity, not a byte-identical screenshot claim. JSX whitespace corrections preserved the original inline wording and spacing.
- All three frozen JSON SHA-256 hashes, the stylesheet, demo arrays, `docs/.gitignore`, and the handoff remained unchanged. Existing root ignore entries were retained. Formatter and patch-whitespace checks passed.

Limitations: checks used isolated headless Chrome, not a physical phone, cross-browser matrix, or manual screen-reader session. The existing custom preview's complete keyboard containment and native-dialog conversion remain later preview/accessibility work. There is no separate lint command. The interface still displays labeled demo metrics, synthetic boards, and preserved prototype branding; it is not yet a genuine data explorer. Temporary browser files were removed after verification. No staging, commits, pushes, deployment, or Step 3 integration occurred.

Implementation references: [React integration guidance](https://react.dev/learn/add-react-to-an-existing-project), [React root ownership](https://react.dev/reference/react-dom/client/createRoot), and [Vite setup and requirements](https://vite.dev/guide/). The actual package manifests and generated lockfile record the installed versions.

Next approval gate: **frontend migration Step 3**, loading and validating the unchanged exports, replacing demo themes/associations with real values, and applying TactiChess branding. Do not begin it automatically.

### 7.8 November 2, 2026: Frontend migration Step 3 completed

The user approved Step 3: integrate the frozen exports while retaining the current design. The three files moved byte-for-byte from `data/` to `public/data/`; Vite serves them at `/data/*.json` and copies them unchanged into `dist/data/`. Their schemas, provenance, historical project value inside metadata, rankings, exclusions, numeric values, FEN strings, move lists, and puzzle URLs were not edited.

- `src/main.jsx` starts one concurrent loading operation outside React component effects, passes loading/success/failure status to `App`, and never substitutes demo associations. Each export is fetched once per page load, including development Strict Mode. Native `fetch`, `Promise.all`, and Vite's public-directory handling were sufficient; no packages or configuration changes were added.
- A focused loader reports network, HTTP, and JSON-parsing failures with the affected filename. Boundary validation checks required fields, finite positive metrics, training-count formulas, theme/pair references, duplicate directions, metadata parameters, difficulty bands, Lichess URL identity, and the expected 20 themes, 48 rules, 34 pairs, and 506 entries. Validation returns the original objects without changing them. Loading and error states are accessible; errors offer a full page reload.
- Replaced demo themes and associations with exported names/descriptions, directional training rules, support, confidence, lift, and source/related/joint counts. Visible product branding and metadata now say TactiChess. The page also shows the genuine dataset totals and source/license/date provenance. Frozen metadata still retains its historical project name internally.
- Adapted existing association controls to the actual fields and fractional metrics. Initial/reset state is Fork and its first exported recommendation (Sacrifice), minimum support 0.20%, and curated order. Optional lift/support/confidence sorts operate on copies, preserve ties, and do not change the frozen export order. Display formatting is support to three decimal places, confidence to two, and lift to two with a multiplier sign. No ranking was recomputed from holdout results.
- Removed fabricated association arrays, synthetic practice cards, and their unused preview code. The practice area shows a pending-preview message with the real matching entry count from the selected rule's `pair_key`. Rating controls are explicitly disabled at this checkpoint. The original hero decoration remains clearly labeled as decorative; genuine `preview_fen` rendering and Lichess practice links remain Step 5.
- Preserved the existing stylesheet apart from two data-display corrections: count descriptions wrap rather than truncate, and the dataset summary stays visible below the heading on narrow screens. Colors, breakpoints, responsive structure, and the sticky header remain. README, run instructions, module/style guidance, and local agent guidance reflect the new data location and approval gate.

Validation performed:

- `npm.cmd test`: **27/27 passed**. Tests cover original SHA-256 hashes, exact dataset totals, required fields/references, formulas, frozen rankings/exclusions, rating boundaries 1200/1201 and 1800/1801, unsafe links, missing data, nonmutation, curated/sorted order and ties, default/reset behavior, selection fallback, and loader network/HTTP/parse errors.
- `npm.cmd run build` passed. Final Vite output: HTML **0.79 kB**, CSS **17.65 kB** (**4.97 kB gzip**), JavaScript **238.83 kB** (**74.43 kB gzip**). JSON remains separate static files: associations **17,843 bytes**, puzzles **300,314 bytes**, metadata **802 bytes**. Source and built copies all match the original hashes recorded by the tests.
- Development Strict Mode passed **633 browser assertions**. The final production preview passed **639 browser assertions**, including the added count-visibility/wrapping checks. Viewports were **1440 x 2600**, **500 x 3800**, and **320 x 4200**. Every exported directional rule was visited and checked against its three formatted metrics, three training counts, and matching pair-entry count. Other checks covered all 20 themes, exact fetch counts, controls/defaults, stable focus, empty results and recovery, support boundaries, no horizontal overflow or label/metric overlap, sticky scrolling, and anchor spacing.
- Intercepted requests only in the temporary browser harness to verify accessible loading, missing-file (404), malformed-JSON, invalid-schema, and network-failure states. All failed without demo fallback; the reload action recovered after restoring normal responses. No JavaScript exceptions occurred. Desktop/narrow screenshots were inspected, including 320-pixel rendering of the genuine names and counts.
- Formatter and `git diff --check` passed. Package manifests, lockfile, existing ignore entries, `docs/.gitignore`, and the handoff stayed unchanged. No install, staging, commit, push, or deployment occurred. Temporary verification files and servers were removed after checking; an existing service on port 5173 was left untouched.

Limitations: browser checks used isolated headless Chrome, not a physical phone, other browser engines, or a manual screen reader. FEN legality/rendering and artwork are not part of this step; no playable board or engine was added. Rating-based example filtering remains for Step 4. Practice cards, preview dialogs, genuine hero position, and puzzle links remain for Step 5. Historical progress sections below retain the original Stage 6 research numbering, which differs from the frontend migration steps.

References checked: [Vite public directory](https://vite.dev/guide/assets.html#the-public-directory), [React root ownership](https://react.dev/reference/react-dom/client/createRoot), and [native Fetch error handling](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

Next approval gate: **frontend migration Step 4**, completing real example filtering, rating controls, selection, reset, and distinct empty states. Do not begin automatically.

### 7.9 November 2, 2026: Version-control guide

At the user's follow-up request, made the guide required reading in local `AGENTS.md`, the Codex handoff, code-style guidance, and this document. The guide remains the shared source for version-control procedures; the entry-point documents link to it and retain the same approval boundaries. This follow-up changes documentation only.

The user requested online research and a practical version-control document. Added [Version control](VERSION_CONTROL.md) based on official Git and GitHub documentation, and linked it from the README and local agent guidance. The recommended workflow uses stable `main`, short-lived task branches, explicit staging review, focused commits, pull requests, and approved squash merges. It distinguishes recommendations from Git requirements and respects the project's separate approvals for repository mutations and deployment.

The guide covers working-tree versus staged changes, branch/commit naming, actual project checks, frozen exports, dependency lockfiles, local exclusions, tracked-file behavior, conflicts, recovery, and proposed branch safeguards. A read-only audit found `main`, a configured `origin`, an ignored/untracked local `AGENTS.md`, and a tracked handoff despite an ignore entry. No ignore rules, tracking, Git configuration, branches, staging, commits, pushes, remote settings, CI, or deployment were changed.

Documentation validation: formatted the new guide and README, checked local links and documented paths, reviewed command examples against official references, and ran `git diff --check`. No application code changed, so application tests and builds were not repeated. This documentation does not mark the preceding page-navigation draft's outstanding visual/browser checks complete, or authorize frontend migration Step 4.

### 7.10 November 2, 2026: Frontend migration Step 4 completed

The user approved Step 4. Enabled the existing All/Easy/Medium/Hard controls and added a pure example selector using the chosen directional rule's `pair_key`. The selector filters the validated export's difficulty field, preserves export order and original puzzle objects, and never changes association metrics. Boundary validation already checks difficulty against ratings: Easy at 1200 or below, Medium at 1201-1800, and Hard from 1801. No duplicate classification algorithm or new package was needed.

- The explorer retains one selection state for theme, association, difficulty, support, and sorting. Visible rules and examples are derived rather than stored as duplicate arrays. Selection remains on a visible rule; if filtering removes it, the first remaining rule in the current sort is selected, or selection clears when there are no rules. Reset restores Fork, its first exported recommendation, All difficulties, 0.20% support, and curated order.
- `PuzzleExamples.jsx` displays the genuine matching IDs, ratings, and difficulty labels, plus filtered and total pair-entry counts. It has distinct no-association and no-matching-difficulty states. This metadata list makes filtering inspectable before Step 5; it does not render boards, moves, FENs, preview buttons, or practice links.
- Stable control keys and controlled React inputs retain focus during filtering. Difficulty descriptions use metadata's exported rating bands, and the support slider exposes its percentage to assistive technology. Live announcements are limited to result counts and status messages rather than the entire example list.
- Existing page navigation is preserved. Navigating away from the explorer and back retains its filters and association selection. The original decorative hero remains unchanged. No preview state or dialog was added before an actual preview interaction exists.

Validation performed:

- `npm.cmd test`: **33/33 tests passed**. Six new tests cover every rule's example order and object preservation, difficulty filtering against actual numeric ratings, reverse-direction pair lookup, empty results using a real restricted subset, difficulty-independent metrics/selection, and combined-filter reset. Existing tests retain frozen hash/count/schema/formula/ranking/exclusion checks and exact rating-boundary cases at 1200/1201 and 1800/1801.
- `npm.cmd run build` passed: HTML **0.79 kB**, CSS **20.40 kB** (**5.62 kB gzip**), JavaScript **247.42 kB** (**76.35 kB gzip**). Existing dependency manifests and lockfile are unchanged.
- Isolated headless Chrome passed **786 development Strict Mode assertions** and **2,358 production-preview assertions**. Production viewports were 1440, 390, and 320 pixels wide. Every one of the 48 rules was checked in all four difficulty modes for exact example membership/order, displayed ratings/bands, matching counts, preserved association selection, and unchanged metrics.
- Browser checks also covered combined filters, sorting and selection fallback, no-association empty state and recovery, complete reset, stable keyboard focus, native Enter activation, preserved state across page navigation, one fetch per JSON export, sticky header, visible mobile navigation, and absence of horizontal page overflow. No JavaScript exceptions occurred. Default desktop and 320-pixel screenshots were captured separately from scrolled keyboard-test views and inspected.
- Original JSON and built-copy SHA-256 hashes remain unchanged. Loaders, validation, application navigation, package manifests, lockfile, ignores, handoff, and version-control guide were unchanged. Formatting, local documentation links, and `git diff --check` passed. No branch operations, staging, commits, pushes, package installs, or deployment occurred.

Limitations: checks used headless Chrome, not physical devices, other browser engines, or a manual screen reader. Every current exported pair has examples in each difficulty band, so the no-matching-difficulty selector path was tested with a clearly scoped real-data subset; no frozen file or browser dataset was fabricated to create that case. Genuine boards, preview selection/dialogs, Lichess practice links, and real hero position remain Step 5. This step does not claim completion of the earlier page-navigation draft's broader outstanding QA.

References consulted: [React state structure](https://react.dev/learn/choosing-the-state-structure) and [stable list keys](https://react.dev/learn/rendering-lists). Temporary verification files and the two test servers were removed after checking.

Next approval gate: **frontend migration Step 5**, integrating the approved static chessboard library, genuine `preview_fen` boards, preview dialogs, and unchanged puzzle links. Do not begin automatically.

### 7.11 November 2, 2026: Frontend migration Step 5 completed

The user approved Step 5. Added the exact published `cm-chessboard` **8.15.4** package after verifying its registry integrity and contents. It adds one dependency with no runtime dependencies of its own. Existing React/Vite versions were retained. Installation reported zero vulnerabilities. No engine, move-validation library, backend, or playable board was added.

- `StaticBoard.jsx` encapsulates library creation, unanimated position/orientation updates, and destruction through refs and effects. It renders the supplied `preview_fen` exclusively, with the side to move at the bottom. Input is disabled. A shared artwork request prevents Strict Mode from duplicating the preflight download; unmounted components ignore its completion. Board destruction removes the library's observers and pending resize work.
- Real example cards retain export order, genuine IDs/ratings/difficulty/themes, and unchanged `puzzle_url` links. Preview selection belongs to the explorer. Native `<dialog>` supplies modal behavior; Close, Back to explorer, Escape, and backdrop clicks dismiss it. Cleanup restores scroll state and the opening control's focus, or the main landmark if that control has disappeared. Hash navigation closes an open dialog and does not reopen it on return.
- Accessible piece-location lists use cm-chessboard's position model and English piece descriptions rather than a custom board parser or engine. They contain no movement form. Compact card/hero descriptions remain available to assistive technology; the dialog offers an expandable description. A missing or invalid artwork response leaves a visible error, genuine piece descriptions, and original practice links. Reloading retries the shared artwork request.
- The hero now shows the first exported puzzle for Fork's first curated recommendation, with matching ID, rating, side-to-move caption, and Lichess link. Removed the decorative array, invented position markers/bars, and their obsolete styles. Reused existing card/modal styling and added scoped chessboard styles for the library and native dialog.
- Boundary validation now checks the preview's basic FEN structure and side to move, using the library's placement round-trip to reject malformed ranks. This validates display input only; it does not prove chess legality, solve positions, or replay moves. Original exports remain unchanged, including `original_fen` and move arrays, which are not displayed by the frontend.

Artwork and licenses:

Verified the actual pinned `assets/pieces/standard.svg`, rather than relying on the README's historical filename. Its embedded notice identifies Wikimedia Commons standard SVG pieces by **Cburnett** and **Rfc1394**, modified by **Stefan Haack**, under **CC BY-SA 3.0**. Copied it without changes to `public/chess/standard.svg`; SHA-256 **b85bba95342a9483420999cedeb1c503e6db16cdd7a0da1f3a228549a13134c5**. Retained embedded notices, copied the renderer's full MIT license, added a distributed artwork notice, and displayed attribution/links on About. These files are formatter-excluded. The differently licensed Staunty asset is not copied or used. This does not assign an MIT license to the whole TactiChess application.

Validation performed:

- `npm.cmd test`: **38/38 passed**, including frozen hashes/counts/formulas/rankings, preview-FEN rejection, unchanged artwork identity and notices, and library-model round-trips with readable pieces for all 506 exported entries. Every preview placement differs from its original placement.
- `npm.cmd run build` passed. Final output: HTML **0.79 kB**, CSS **26.89 kB** (**6.36 kB gzip**), JavaScript **286.82 kB** (**86.25 kB gzip**), plus the separate unchanged JSON and copied artwork/notices. The sprite is **23,131 bytes**. Existing dependency pins were retained; only the approved package and corresponding lockfile entry were added.
- Production preview passed **4,745 browser assertions** across desktop 1440, narrow 390, and small 320-pixel widths. Every one of the 506 pair-specific entries was rendered and checked for exact preview piece locations, side-to-move orientation, 64 squares, a single SVG, accessible descriptions, real labels/themes, and unchanged protected links. Checks also covered filters with fixed metrics, repeated mount/unmount cycles, observer cleanup, hero identity, attribution, mobile overflow, and single JSON requests.
- Native dialog checks covered initial focus, native Tab behavior excluding background controls, blocked background-control focus, Escape/Close/Back/backdrop dismissal, focus restoration, scroll cleanup, and route-change dismissal. Browser chrome remains keyboard-accessible as part of native browser behavior; no custom Tab trap was added. Missing-artwork responses were intercepted only in the temporary harness; real descriptions/links remained and reload restored the boards. No application JavaScript exceptions occurred.
- Development Strict Mode passed **1,585 assertions**, exercising the same renderer/dialog behavior and a temporary isolated component probe. Updating its FEN reused the existing SVG, changed its piece locations exactly to the new preview, and returned observer counts to baseline after unmount. Desktop, Home, and small-screen dialog screenshots were inspected.
- Public Lichess pages for **rPLaY** (Black to move) and **acE1D** (White to move) returned HTTP 200 with matching puzzle IDs/side-to-move metadata. Their linked board thumbnails were retrieved and visually compared with the exported/rendered positions. This was a public-page/thumbnail comparison, not a claim to have solved or interacted with those puzzles.
- All original JSON SHA-256 hashes and built copies remain unchanged. The sprite and notices are identical in source and build output. Application navigation, rule selectors, dataset loader, Git ignores, version-control guide, and handoff remained unchanged. Formatter, local-documentation links, and diff-whitespace checks passed. No branch operations, staging, commits, pushes, or deployment occurred.

Limitations: browser verification used isolated headless Chrome rather than physical devices, other engines, or a manual screen-reader session. Full contrast/accessibility review and the broader page-navigation QA remain part of Step 6. No runtime chess legality checking or engine is included. Temporary downloads, browser profiles, test scripts/screenshots, and the two test servers were removed after verification.

References: [cm-chessboard repository/API](https://github.com/shaack/cm-chessboard), [pinned npm package](https://www.npmjs.com/package/cm-chessboard/v/8.15.4), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), [React effects](https://react.dev/learn/synchronizing-with-effects), and [native dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog).

Next approval gate: **frontend migration Step 6**, broader quality assurance and documentation. Git operations and deployment remain separately approved actions.

### 7.12 Frontend migration Step 6: Final local QA and documentation (completed November 2, 2026)

Scope: the user approved the final local QA/documentation step. Existing uncommitted Step 5 work was preserved. No new project dependency, data change, Git mutation, or deployment was authorized or performed.

Corrections:

- Darkened secondary text, tags, badges, footer text, and light-background links within the existing green palette. Hero links retain their light color. The layout, imagery, responsive breakpoints, and sticky header remain intact.
- Corrected Explorer's heading order and the inherited serif/spacing styles on panel and Method headings. Named the Home context group explicitly and fixed spacing in the artwork credit.
- Added contrasting keyboard focus rings to the slider and position-description summary, retained focus for sorting, and increased the reset target to at least 24px. The two-color ring remains visible on light and dark backgrounds.
- Overrode the library's coordinate text selector correctly. Computed frame-coordinate colors are now `#14362b` on `#e0ddcc`, a 9.66:1 contrast ratio. The previous parent-only fill was overridden by the library.
- Home now uses the existing accessible loading/error component until the dataset succeeds. A failed download no longer leaves Home describing a position as still loading; the real error and Reload page action are visible.
- Removed obsolete single-page Method, demo-card number, and old board/dialog selectors. Updated existing startup, style, handoff, and agent guidance rather than adding another document.

Actual verification:

- **38/38 Node tests passed**, including original export hashes/counts, training formulas, frozen ordering/exclusions, references, rating boundaries, nonmutating selectors, empty examples, loader failures, and the exact licensed artwork.
- **Production build passed** with pinned dependencies. The three JSON files and distributed artwork/license notices match their source bytes. `npm audit --json` reported **zero known vulnerabilities** in the existing lockfile at this check; this is not a security guarantee.
- Isolated **headless Chrome 156.0.8078.74** passed **2,501 browser assertions** across production preview and development Strict Mode. These covered all 20 themes, 48 directions, all 506 pair-specific examples (including pairs displayed in both directions), actual piece maps from `preview_fen`, orientation, unchanged links/metrics, rating bands, support empty states, and reset. Navigation and filtering caused no further JSON downloads.
- Page checks covered all four pages, legacy hashes, unknown routes, active navigation, document titles, one visible labelled page heading, unique IDs, scroll/focus changes, browser history, and preserved Explorer selection.
- Native-dialog checks covered initial focus, inert background, Tab behavior, expanded position descriptions, Escape/Close/Back/backdrop dismissal, focus restoration, scroll-lock cleanup, route-change dismissal, reopening, and repeated Strict Mode filtering/dialog cycles. Active ResizeObserver counts matched the remaining rendered boards after cleanup. No uncaught browser runtime exceptions were observed.
- Request interception verified loading, missing/malformed/invalid-schema JSON, network failure, missing/invalid artwork, accessible fallbacks, and successful reload recovery. Source exports were never edited for these tests. Empty-example behavior uses the focused selector tests; the genuine export has examples in all rating bands.
- **126 layout/sticky-header checks** passed across all 20 themes at widths **320, 390, 768, 801, 1024, and 1440px**. No horizontal page overflow, overlapping rule metrics, or clipped theme labels was found. Desktop and mobile screenshots of all four pages were inspected; reduced-motion behavior was checked. A 320px CSS viewport checks reflow size, not physical-device rendering or actual browser zoom behavior.
- Temporary **axe-core 4.14.0 (MPL-2.0)**, downloaded outside the repository, ran **26 scans**: four pages at four widths plus the open dialog, unknown page, loading state, JSON failures, artwork failures, and a final About-page scan after the credit-spacing fix. No violations were reported for the selected WCAG 2 A/AA, 2.1 AA, 2.2 AA, and best-practice rules. Incomplete contrast results concerned decorative symbols, single-character coordinates, and the transformed hero; their relevant colors and screenshots were reviewed separately. The coordinate contrast correction above came from that follow-up review.
- Formatter, local documentation links, and diff-whitespace checks passed. Temporary audit downloads, scripts, screenshots, isolated Chrome profile, and the two task-owned servers were removed after checking.

Limits: this was local headless Chromium verification. A manual assistive-technology session, physical devices, Firefox/WebKit, actual browser zoom, and deployed signed-out/authorized-user access were not tested. Automated accessibility scans and screenshot inspection do not establish complete WCAG conformance. Step 5's representative public Lichess-page/thumbnail comparison remains the external-position evidence; this step did not repeat every public puzzle-page request.

Guidance consulted: [axe-core repository and license](https://github.com/dequelabs/axe-core), [WCAG contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), and [WAI modal-dialog guidance](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). The audit engine was temporary test tooling and was not copied into the site or added to the lockfile.

### 7.13 Remaining release work (not yet approved)

The approved six-step local frontend migration is complete. Research Stage 6 still includes deployment and access validation; these are separate from frontend migration Step 6.

- Review the complete uncommitted diff, including the preserved Step 5 work, before any separately approved branch/staging/commit/push operation. Follow the version-control guide.
- Before release, complete or explicitly accept the unverified manual screen-reader, device, other-engine, and zoom checks listed above.
- With separate deployment approval, configure protected static Vercel hosting, verify all intended deployment URLs, and test authorized and signed-out access. A private repository alone does not protect the hosted site.

---

### 7.14 Beginner usability improvements (completed November 2, 2026)

Scope: the user approved the recommended changes after a read-only beginner-perspective walkthrough. This is a local UX change, with no new dependency, frozen-data edit, Git mutation, or deployment.

- Added a clear three-step explorer, a Start with Fork action, an expandable list retaining all 20 tactics, and the selected tactic definition beside the results. Related cards explain each tactic and express genuine directional confidence in a sentence rather than a move-like arrow.
- Moved frequency filtering and sorting into Advanced filters. Default order preserves the original ranking. Connection details retains all original counts, support/confidence/lift, and direction/interpretation guidance; details controls are outside selection buttons.
- Changed Method navigation to How to use without changing URLs. Rewrote Home and usage guidance in plain language; research and formulas remain available on demand and provenance/licensing remains on About.
- Cards emphasize difficulty and side to move. Shared PuzzleTags reveals the original puzzle ID and readable tag labels under Puzzle details. Enlarge board and Solve on Lichess distinguish the static preview from external practice. The preview states that pieces cannot move; FENs, puzzle URLs, and original data remain unchanged.

Validation:

- `npm.cmd test`: 38/38 passed, including frozen export hashes, counts, formulas/rankings, rating selection, loader failures, board-model round trips, and artwork/notices.
- `npm.cmd run build` and `git diff --check` passed. Formatted only changed source files with the existing VS Code Prettier installation.
- Manually exercised the running Vite development site in Chrome: Home and How to use; opening all tactics and selecting Attraction; returning through Start with Fork; changing the selected connection; opening connection evidence; Easy filtering; raising frequency until zero connections; and reset restoring the original connections. Navigation preserved the current explorer selection.
- Inspected desktop layout and Chrome responsive views at 390px and 320px. At 320px, inspected controls, wrapping connection cards, empty state, a real puzzle card and its native preview, and expanded readable puzzle tags/ID. Escape dismissed the preview and visibly returned focus to Enlarge board. Full Medium wording fits the narrow difficulty control.

Limits: these checks are an agent walkthrough and selected local browser checks, not a study with beginner participants, a complete accessibility audit, or a new exhaustive puzzle/browser regression run. Production-preview runtime, screen-reader, physical-device, Firefox/WebKit, and deployed access were not checked in this step. The unchanged board/input model remains static.

Design references: [W3C clear words](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p01-clear-words/), [Nielsen usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/), and [progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/). Cognitive supplemental guidance is advisory, not an additional WCAG conformance requirement.

---

## 8. Methodological safeguards and limitations

1. Training and test records were split before analytical EDA. All theme choices, frequency thresholds, semantic exclusions, and ranking settings were made using training data and official theme definitions.
2. The 100,000-puzzle holdout was evaluated once in Stage 4. It must not be used to revise and re-score the same model without disclosing another iteration and obtaining a new independent holdout.
3. Lichess themes are existing dataset labels and can be semantically overlapping or imperfect. Co-occurrence does not establish causation, correct chess moves, or learner success.
4. The current mining denominator includes all training puzzles, including those with zero or one eligible theme. Changing that denominator would change reported support and lift.
5. The 0.20% support threshold means rare, meaningful patterns may not be selected. High lift can still arise from relatively small counts, so counts must accompany metrics.
6. The website will use precomputed ECLAT results, not perform mining in real time. This distinction must be explained during the demonstration.
7. The source dataset and website assets need not be committed together. Only compact exports should be distributed with the static site.
8. A separate *sampling* metadata JSON was omitted by decision, but the notebook and this documentation retain key sampling settings. The small `exports/metadata.json` was created later for website provenance. The original compressed source was not retained or hashed.

## 9. References and project records

- Approved comprehensive development plan, October 30, 2026, supplied with the project.
- Official Lichess database: https://database.lichess.org/
- Lichess puzzle themes: https://lichess.org/training/themes
- Notebook: `TactiChess_V2_ECLAT_500K.ipynb`
- Saved data and outputs: `MyDrive/TactiChess_V2/`
- Numerical results documented above were reported from the user's completed Google Colab runs.

## 10. Document update policy

Update this same document at each Stage 6 checkpoint and at the completion of Stage 6, rather than creating an unrelated record. Update the stage status, methods actually used, decisions, exact reported metrics, checks, saved deliverables, limitations, and next stage. Distinguish planned steps from executed work. Do not include implementation code in the documentation.
