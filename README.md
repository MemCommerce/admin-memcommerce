
# 🛍️ MemCommerce Admin

**MemCommerce Admin** is a powerful frontend application for managing a fashion-related e-commerce platform. Built with **React**, it provides an intuitive UI for managing stock, including products, colors, sizes, variants, and more. The application also includes an innovative **AI Assistant** that enables text-based control of all admin operations — streamlining workflows and making store management smarter and faster.

---

## 🚀 Features

### 🧩 Inventory Management
- **Products**: Create, update, and delete products.
- **Variants**: Manage multiple product variants (color, size, SKU, etc.).
- **Colors & Sizes**: Define standardized attributes for better catalog consistency.

### 🤖 AI Assistant
- Fully integrated **AI-driven assistant** that supports natural language commands.
- Perform tasks like “Add a red medium T-shirt to stock” or “List all out-of-stock items”.
- Reduces learning curve and accelerates admin tasks with minimal UI interaction.

### ⚙️ Additional Capabilities
- Dashboard overview with key metrics.
- Search and filter across products and variants.
- Optimized UX for fast, efficient workflows.

---

## 🛠️ Tech Stack

- **React** — Modern SPA architecture using Vite for blazing-fast builds.
- **TypeScript** — Strong typing for safer, maintainable code.
- **Tailwind CSS** — Utility-first styling for a clean and responsive design.
- **OpenAI / LangChain (optional)** — For AI Assistant capabilities.
- **Firebase / Firestore or REST API (depending on backend)** — For real-time data and authentication (optional).

---

## 🧪 Getting Started

### Prerequisites

- Node.js >= 18.x
- Yarn or npm
- Backend service running (e.g., Firebase, REST API)

### Installation

```bash
git clone https://github.com/MemCommerce/memcommerce-admin.git
cd memcommerce-admin
npm install
# or
yarn install
```

### Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 💡 Using the AI Assistant

Once logged in, you can activate the AI Assistant from the toolbar. Example commands:

- "Add a new black hoodie, size L, price 49.99."
- "What products are out of stock?"
- "Show me all size M red items."

The assistant uses natural language processing to parse and perform operations on your data.

---

## 📁 Project Structure (simplified)

```
src/
├── components/       # Reusable UI components
├── pages/            # Route-based views
├── services/         # API & AI integrations
├── hooks/            # Custom React hooks
├── context/          # Global state/context providers
├── assets/           # Static files (images, etc.)
└── App.tsx           # Main app entry
```

---

## ✅ To-Do

- [ ] Role-based access controls
- [ ] Image uploads & management
- [ ] Export to CSV / Excel
- [ ] Advanced AI training for complex workflows

---

## 📄 License

This project is open-source under the MIT License.

---

## 👨‍💻 Author & Credits

Developed by Damyan Dimitrov
Part of the **MemCommerce** platform  
For more details, visit: [memcommerce.shop](https://memcommerce.shop)
