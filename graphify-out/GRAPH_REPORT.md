# Graph Report - client  (2026-06-01)

## Corpus Check
- 87 files · ~546,077 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 412 nodes · 414 edges · 57 communities (44 shown, 13 thin omitted)
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 58 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e092d36e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 56|Community 56]]

## God Nodes (most connected - your core abstractions)
1. `ProductDetails()` - 15 edges
2. `useStore` - 12 edges
3. `useAuth` - 8 edges
4. `apiFetch()` - 8 edges
5. `Order Details Page Implementation` - 8 edges
6. `formatPrice()` - 7 edges
7. `scripts` - 5 edges
8. `productUrl()` - 5 edges
9. `ProductCard()` - 4 edges
10. `useInfiniteProducts()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Navbar()` --calls--> `useStore`  [INFERRED]
  src/components/layout/Navbar.jsx → src/store/useStore.js
- `LoadingScreen()` --calls--> `useStore`  [INFERRED]
  src/components/ui/LoadingScreen.jsx → src/store/useStore.js
- `ProductCard()` --calls--> `useStore`  [INFERRED]
  src/components/ui/ProductCard.jsx → src/store/useStore.js
- `SearchOverlay()` --calls--> `useStore`  [INFERRED]
  src/components/ui/SearchOverlay.jsx → src/store/useStore.js
- `Toaster()` --calls--> `useStore`  [INFERRED]
  src/components/ui/Toaster.jsx → src/store/useStore.js

## Import Cycles
- None detected.

## Communities (57 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (21): useProduct(), OrderDetails(), ProductDetails(), breadcrumbSchema(), productSchema(), imagePreflightCache, isLocalPlaceholder(), preflightImage() (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (13): calculateTotals(), Cart(), Checkout(), Compare(), Wishlist(), useComparisonStore, useStore, ComparisonBar() (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (15): dependencies, framer-motion, gsap, @gsap/react, lenis, lucide-react, react, react-dom (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (15): useLenis(), idify(), MegaMenuGroup(), MobileNavItem(), Navbar(), Account(), tabs, Auth() (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (21): About, Account, Auth, BridalCollections, Cart, Checkout, ClientDiary, Compare (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (14): useInfiniteProducts(), BridalCollections(), PRICE_BOUNDS, useResolvedBridalCategory(), CategoryRail(), JewelleryCollections(), PRICE_BOUNDS, useResolvedCategory() (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (18): cardHover, fadeInDown, fadeInLeft, fadeInRight, fadeInUp, imageZoom, letterReveal, lineReveal (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (13): BRIDAL_CATEGORIES, _bridalBySlugPath, _byTypeId, JEWELLERY_CATEGORIES, _jewelleryBySlugPath, bridalNav, COLLECTIONS, jewelleryNav (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (14): 1. Routing Updates (`src/routes/index.jsx`), 2. New Page Created (`src/pages/OrderDetails.jsx`), 3. Account Page Updates (`src/pages/Account.jsx`), Browser Compatibility, Changes Made, Features, Navigation Flow, Notes (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (4): useProducts(), RelatedProducts(), FeaturedProducts(), RAILS

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (22): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sharp, tailwindcss (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.28
Nodes (12): API_BASE_URL, apiFetch(), buildUrl(), getGoogleReviews(), getInstagramFeed(), getProductById(), getProductDetail(), getProducts() (+4 more)

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (4): useGoogleReviews(), ClientDiary(), HeaderSummary(), ratingLabel()

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (8): BridalShowcase, CollectionsGrid, FeaturedProducts, Home(), RentalProcess, TestimonialSection, VideoSection, organizationSchema()

### Community 15 - "Community 15"
Cohesion: 0.28
Nodes (6): DateRangePicker(), isBefore(), MONTHS, startOfDay(), WEEKDAYS, addDays()

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (4): PHONES, SOCIALS, STUDIO_ADDRESS_LINES, SUBJECTS

### Community 19 - "Community 19"
Cohesion: 0.70
Nodes (4): useIsDesktop(), useIsMobile(), useIsTablet(), useMediaQuery()

### Community 20 - "Community 20"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 21 - "Community 21"
Cohesion: 0.50
Nodes (3): files, fs, glob

### Community 27 - "Community 27"
Cohesion: 0.83
Nodes (3): ProductImage(), proxyUrl(), resolveProductImage()

### Community 56 - "Community 56"
Cohesion: 0.29
Nodes (4): useProductSearch(), POPULAR_SEARCHES, RECENT_LINKS, SearchOverlay()

## Knowledge Gaps
- **138 isolated node(s):** `dirs`, `fs`, `glob`, `files`, `name` (+133 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProductDetails()` connect `Community 0` to `Community 1`, `Community 9`, `Community 15`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `useStore` connect `Community 1` to `Community 0`, `Community 56`, `Community 3`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `useAuth` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `ProductDetails()` (e.g. with `useProduct()` and `breadcrumbSchema()`) actually correct?**
  _`ProductDetails()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `useStore` (e.g. with `Navbar()` and `Cart()`) actually correct?**
  _`useStore` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `useAuth` (e.g. with `Navbar()` and `Account()`) actually correct?**
  _`useAuth` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dirs`, `fs`, `glob` to the rest of the system?**
  _138 weakly-connected nodes found - possible documentation gaps or missing edges._