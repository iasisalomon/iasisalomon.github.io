# Iasi Salomon Portfolio Website

![Portfolio Website](https://via.placeholder.com/800x400?text=Iasi+Salomon+Portfolio)

A modern, responsive portfolio website built with Astro.js featuring an innovative context-aware navigation system. This site serves as a platform for showcasing professional work, brand partnerships, projects, and blog content with a clean, minimalist design.

## ✨ Features

-   **Dynamic Context-Aware Navigation** - Navigation adjusts based on current page context
-   **Smooth Section Scrolling** - Elegant scrolling with proper offset calculation
-   **Active State Tracking** - Intelligent tracking of current page/section/category
-   **Responsive Design** - Fully optimized for all screen sizes
-   **Blog Category System** - Organized blog with filterable categories
-   **SEO-Friendly** - Built with SEO best practices
-   **Performance Optimized** - Fast loading and rendering
-   **Modern Aesthetic** - Clean, professional design with subtle animations

## 🚀 Quick Start

### Prerequisites

-   Node.js 16+
-   npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/username/iasi-portfolio.git
    cd iasi-portfolio
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

## 🧰 Tech Stack

-   **[Astro.js](https://astro.build/)** - Core framework
-   **[Bootstrap 5](https://getbootstrap.com/)** - Responsive layout and components
-   **JavaScript** - Dynamic navigation and interactions
-   **CSS/SCSS** - Custom styling
-   **Markdown/MDX** - Content management

## 📁 Project Structure

```text
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.astro  # The context-aware navigation component
│   │   └── ...
│   ├── content/          # Blog posts and content collections
│   ├── layouts/          # Page layouts
│   └── pages/            # Page routes
├── astro.config.mjs      # Astro configuration
├── README.md             # Project documentation
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## 🧩 Navigation System

The site features a sophisticated navigation system with:

### Primary Navigation

Always visible across all pages, featuring core site links (Home, Blog)

### Secondary Navigation

Context-sensitive navigation that changes based on the current page:

-   **Home Page**: Shows section links (About, Brands, Projects, Contact)
-   **Blog Page**: Shows category tags (Tech, Business, Other)
-   **Other Pages**: Hides secondary navigation entirely

## 🛠️ Customization

### Adding New Primary Navigation Links

```html
<ul class="navbar-nav primary-nav">
    <!-- Existing links -->
    <li class="nav-item">
        <a class="nav-link" href="/new-page">New Page</a>
    </li>
</ul>
```

### Adding New Blog Categories

```html
<ul class="navbar-nav section-nav" id="blogNav">
    <!-- Existing categories -->
    <li class="nav-item">
        <a class="nav-link" href="/blog/category/new-category">New Category</a>
    </li>
</ul>
```

### Adding New Homepage Sections

1. Add to the navigation:

```html
<ul class="navbar-nav section-nav" id="sectionNav">
    <!-- Existing sections -->
    <li class="nav-item">
        <a class="nav-link" href="#newSection">New Section</a>
    </li>
</ul>
```

2. Create the corresponding section:

```html
<section id="newSection">
    <!-- Content here -->
</section>
```

## 🧞 Commands

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `npm install`       | Installs dependencies                            |
| `npm run dev`       | Starts local dev server at `localhost:4321`      |
| `npm run build`     | Build your production site to `./dist/`          |
| `npm run preview`   | Preview your build locally, before deploying     |
| `npm run astro ...` | Run CLI commands like `astro add`, `astro check` |

## 🔍 Browser Compatibility

-   Chrome/Edge (latest)
-   Firefox (latest)
-   Safari (latest)
-   Mobile browsers (iOS Safari, Android Chrome)

## 🚧 Future Enhancements

-   [ ] Add dropdown support for nested navigation categories
-   [ ] Implement color theme switching (dark/light mode)
-   [ ] Add animation effects for page transitions
-   [ ] Enhance blog search functionality
-   [ ] Improve accessibility features

---

Built with ❤️ using [Astro](https://astro.build)
