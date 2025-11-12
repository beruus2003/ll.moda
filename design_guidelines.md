# Design Guidelines: Lara Moda - Loja de Roupas Online

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern fashion e-commerce leaders (Zara, H&M, Shopshop) with boutique sensibility. Focus on clean product presentation, feminine elegance, and intuitive shopping experience.

## Typography System

**Font Families**:
- Headlines: "Playfair Display" (serif, elegant) - via Google Fonts
- Body/UI: "Inter" (sans-serif, modern) - via Google Fonts

**Hierarchy**:
- H1 (Hero/Page titles): 3xl to 5xl, font-weight 600-700
- H2 (Section headers): 2xl to 3xl, font-weight 600
- H3 (Product names): xl to 2xl, font-weight 500
- Body text: base to lg, font-weight 400
- Prices: lg to xl, font-weight 600-700
- Buttons/CTAs: sm to base, font-weight 500, uppercase tracking

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-4 to p-8
- Section spacing: py-12 (mobile), py-20 to py-24 (desktop)
- Card gaps: gap-6 to gap-8
- Element margins: mb-2, mb-4, mb-6 for vertical rhythm

**Container Strategy**:
- Full-width sections with max-w-7xl inner containers
- Product content: max-w-6xl
- Product grids: w-full with responsive columns

## Page Structure & Layout

### Header/Navigation
- Fixed top navigation with transparent/solid background on scroll
- Logo positioned left
- Desktop: Horizontal navigation center (Início, Produtos, Categorias, Contato)
- Customer login/register button top right (outline style)
- Hamburger menu icon far right containing admin access
- Mobile: Hamburger replaces horizontal nav, customer login remains visible

### Hero Section
Full-width immersive hero with lifestyle photography:
- Height: 70vh to 85vh
- Large hero image showing clothing in context (lifestyle/model shots)
- Overlaid headline + subheadline centered or left-aligned
- CTA button with blurred background for visibility
- Optional: Carousel for multiple hero images showcasing different collections

### Product Grid Sections
Multi-column responsive layouts:
- Mobile: 2 columns (grid-cols-2)
- Tablet: 3 columns (md:grid-cols-3)
- Desktop: 4 columns (lg:grid-cols-4)
- Product cards with 3:4 aspect ratio images
- Hover: Subtle scale transform (scale-105), show secondary product image
- Below image: Product name, price, available colors indicator (small dots)

### Category Browsing
- Horizontal category pills/chips below hero (overflow-x-scroll on mobile)
- Large category cards in 2-3 column grid with representative images
- Each card shows category name overlaid on styled photography

### Featured Collections
- 2-column asymmetric layout alternating image/text blocks
- Collection name, description, "Ver Coleção" CTA
- Full-width background images with content overlay

### Social Proof Section
- Instagram-style grid showing customer photos/styling
- 3-4 columns of square images
- "Siga @laramoda" heading with Instagram integration

### WhatsApp CTA Section
Prominent conversion section before footer:
- Icon + compelling copy: "Dúvidas? Fale conosco no WhatsApp"
- Large WhatsApp button
- Supporting text: "Respondemos em minutos"

### Footer
Comprehensive 3-4 column layout:
- About Lara Moda + brand story
- Quick links (Sobre, Política de Troca, Entregas)
- Contact info (WhatsApp, Email, Instagram)
- Newsletter signup form
- Bottom row: Copyright, payment icons, social media links

## Component Library

### Product Cards
- Image container with overflow-hidden for hover effects
- Favorite/wishlist icon (heart) top right of image
- Product info section: name, price, color options
- Quick view button on hover (desktop)

### Product Detail Page
- 2-column layout: Gallery left (60%), Info right (40%)
- Gallery: Main large image + thumbnail strip below
- Info section: Name, price, rating stars, size selector (buttons), color selector (color swatches), quantity selector, WhatsApp purchase button, accordion for descrição/detalhes
- Below fold: Similar products carousel, reviews section

### Admin Panel Components
Dashboard layout:
- Sidebar navigation (Produtos, Adicionar Produto, Pedidos, Configurações)
- Main content area with data tables
- Product upload form: Multiple image upload with drag-drop, text inputs for name/description/price, multi-select for sizes/colors, category dropdown, rich text editor for description
- Product management table with thumbnail, edit/delete actions

### Authentication Forms
Modal overlays for login/register:
- Clean centered forms with logo at top
- Input fields with floating labels
- Primary CTA button
- Toggle between login/register
- Social login options (Google, Facebook) - placeholder for future

### Buttons
- Primary: Solid with full rounded corners (rounded-lg), font-weight 500
- Secondary: Outline style
- WhatsApp: Icon + text, distinctive styling
- Icon-only: Favorite, cart, hamburger menu

### Icons
Use Heroicons (outline for UI, solid for emphasis) via CDN

## Images

**Hero Section**: 
- Large lifestyle photography showing women wearing clothing in aspirational settings (outdoor, urban, studio)
- Professional fashion photography with natural lighting
- Models showing outfit styling and fit

**Product Images**:
- Clean white background product shots (primary)
- Model shots showing fit and styling (secondary/hover)
- Multiple angles per product
- Consistent aspect ratio 3:4 for all product thumbnails

**Category Headers**:
- Lifestyle images representing each category essence
- Fashion-forward photography with editorial quality

**Collection Showcases**:
- Full-width imagery showing seasonal collections
- Aspirational lifestyle photography

**Social Proof Grid**:
- User-generated content style photos
- Mix of product closeups and styled outfit photos

## Responsive Behavior

- Mobile-first approach with touch-friendly targets (min 44px)
- Hamburger menu collapses all navigation on mobile except customer login
- Product grids stack from 4→3→2 columns
- Typography scales down appropriately
- Spacing reduces proportionally (py-20 becomes py-12)
- Admin panel switches to mobile-optimized single column

## Animations

Use sparingly for polish:
- Smooth page transitions (fade)
- Product card hover effects (scale, image swap)
- Mobile menu slide-in
- Modal fade-in
- Scroll-triggered fade-up for sections (subtle)
- Loading states for image uploads

## Accessibility

- Semantic HTML structure
- Alt text for all product images
- Keyboard navigation support
- Focus states on interactive elements
- ARIA labels for icon buttons
- Form validation with clear error messages
- Sufficient contrast ratios throughout