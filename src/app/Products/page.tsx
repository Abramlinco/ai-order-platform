"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "In stock" | "Low stock" | "Out of stock";
};

export default function ProductsPage() {
    const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [products, setProducts] = useState<Product[]>([
    {
      id: "PRD-1001",
      name: "Black Shirt",
      category: "Shirts",
      price: 12000,
      stock: 120,
      status: "In stock",
    },
    {
      id: "PRD-1002",
      name: "White Shirt",
      category: "Shirts",
      price: 14000,
      stock: 45,
      status: "In stock",
    },
    {
      id: "PRD-1003",
      name: "Sneakers",
      category: "Footwear",
      price: 27500,
      stock: 12,
      status: "Low stock",
    },
    {
      id: "PRD-1004",
      name: "Hoodie",
      category: "Clothing",
      price: 18500,
      stock: 28,
      status: "In stock",
    },
    {
      id: "PRD-1005",
      name: "Polo Shirt",
      category: "Shirts",
      price: 11500,
      stock: 0,
      status: "Out of stock",
    },
  ]);

  const [showAddProduct, setShowAddProduct] = useState(false);
const [editingProduct, setEditingProduct] = useState<Product | null>(null);
useEffect(() => {
  if (searchParams.get("add") === "true") {
    setEditingProduct(null);

    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
    });

    setShowAddProduct(true);
  }
}, [searchParams]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All categories" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter, products]);

  const handleAddProduct = () => {
    if (
      !newProduct.name.trim() ||
      !newProduct.category.trim() ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      return;
    }

    const stock = Number(newProduct.stock);

            const product: Product = {
        id: `PRD-${Date.now()}`,
        name: newProduct.name.trim(),
        category: newProduct.category.trim(),
        price: Number(newProduct.price),
        stock,
        status:
            stock === 0
            ? "Out of stock"
            : stock <= 15
            ? "Low stock"
            : "In stock",
        };

    setProducts((current) => [product, ...current]);

    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
    });

    setShowAddProduct(false);
  };

const handleEditProduct = (product: Product) => {
  setEditingProduct(product);

  setNewProduct({
    name: product.name,
    category: product.category,
    price: product.price.toString(),
    stock: product.stock.toString(),
  });
};

const handleUpdateProduct = () => {
  if (
    !editingProduct ||
    !newProduct.name.trim() ||
    !newProduct.category.trim() ||
    !newProduct.price ||
    newProduct.stock === ""
  ) {
    return;
  }

  const stock = Number(newProduct.stock);

  setProducts((current) =>
    current.map((product) =>
      product.id === editingProduct.id
        ? {
            ...product,
            name: newProduct.name.trim(),
            category: newProduct.category.trim(),
            price: Number(newProduct.price),
            stock,
            status:
              stock === 0
                ? "Out of stock"
                : stock <= 15
                ? "Low stock"
                : "In stock",
          }
        : product
    )
  );

  setNewProduct({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  setEditingProduct(null);
};

  const handleDeleteProduct = (productId: string) => {
    setProducts((current) =>
      current.filter((product) => product.id !== productId)
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* PAGE HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Products</h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your products, pricing, and inventory.
              </p>
            </div>

            {/* DESKTOP ADD PRODUCT */}
            <button
              type="button"
              onClick={() => setShowAddProduct(true)}
              className="hidden rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:block"
            >
              + New Product
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCTS CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* SECTION HEADER */}
          <div className="border-b border-slate-200 px-6 py-6">
            <h2 className="text-xl font-bold">All Products</h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all products in your inventory.
            </p>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="h-12 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                aria-label="Filter by category"
                className="h-12 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option>All categories</option>
                <option>Shirts</option>
                <option>Footwear</option>
                <option>Clothing</option>
              </select>
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-900">
                        {product.name}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {product.id}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {product.category}
                    </td>

                    <td className="px-6 py-5 font-semibold">
                      ₦{product.price.toLocaleString()}
                    </td>

                    <td className="px-6 py-5">
                      {product.stock}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          product.status === "In stock"
                            ? "bg-emerald-100 text-emerald-700"
                            : product.status === "Low stock"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            className="font-medium text-emerald-700 transition hover:text-emerald-800"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="font-medium text-red-600 transition hover:text-red-700"
                        >
                            Remove
                        </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE PRODUCT CARDS */}
          <div className="space-y-3 p-4 lg:hidden">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {product.id}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.status === "In stock"
                        ? "bg-emerald-100 text-emerald-700"
                        : product.status === "Low stock"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Price</span>
                    <span className="font-semibold">
                      ₦{product.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Stock</span>
                    <span className="font-medium">
                      {product.stock}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
  <button
    type="button"
    onClick={() => handleEditProduct(product)}
    className="rounded-lg border border-emerald-300 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
  >
    Edit product
  </button>

  <button
    type="button"
    onClick={() => handleDeleteProduct(product.id)}
    className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
  >
    Remove
  </button>
</div>
              </article>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredProducts.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No products match your search or filters.
            </div>
          )}
        </div>
      </section>

      {/* MOBILE ADD BUTTON */}
      <button
        type="button"
        onClick={() => setShowAddProduct(true)}
        aria-label="Add new product"
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-2xl font-medium text-white shadow-lg transition hover:bg-emerald-800 sm:hidden"
      >
        +
      </button>

      {/* ADD PRODUCT MODAL */}
      {(showAddProduct || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                    {editingProduct
                        ? "Update your product information."
                        : "Add a product to your inventory."}
                    </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
  setShowAddProduct(false);
  setEditingProduct(null);

  setNewProduct({
    name: "",
    category: "",
    price: "",
    stock: "",
  });
}}
                  className="text-2xl text-slate-400 hover:text-slate-700"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Product name
                </label>

                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(event) =>
                    setNewProduct({
                      ...newProduct,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Black Shirt"
                  className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Category
                </label>

                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(event) =>
                    setNewProduct({
                      ...newProduct,
                      category: event.target.value,
                    })
                  }
                  placeholder="e.g. Shirts"
                  className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Price
                  </label>

                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(event) =>
                      setNewProduct({
                        ...newProduct,
                        price: event.target.value,
                      })
                    }
                    placeholder="12000"
                    className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Stock
                  </label>

                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(event) =>
                      setNewProduct({
                        ...newProduct,
                        stock: event.target.value,
                      })
                    }
                    placeholder="50"
                    className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => {
  setShowAddProduct(false);
  setEditingProduct(null);

  setNewProduct({
    name: "",
    category: "",
    price: "",
    stock: "",
  });
}}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                className="flex-1 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                {editingProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}