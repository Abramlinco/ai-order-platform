"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Variant = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "In stock" | "Low stock" | "Out of stock";
  variants: Variant[];
};

type ProductErrors = Partial<Record<"name" | "category" | "price" | "stock", string>>;
type VariantErrors = Partial<Record<"name" | "price" | "stock", string>>;

type BulkRow = {
  name: string;
  category: string;
  price: string;
  stock: string;
  errors: ProductErrors;
};


type DeleteTarget =
  | { type: "product"; product: Product }
  | { type: "variant"; variant: Variant }
  | null;

const emptyProduct = { name: "", category: "", price: "", stock: "" };
const emptyVariant = { name: "", price: "", stock: "" };

function money(value: number) {
  return `₦${value.toLocaleString()}`;
}

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "package":
      return <svg {...common}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /><path d="M8 5.25 16 9.75" /></svg>;
    case "tag":
      return <svg {...common}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1-.6-1.4V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.4.6l7.4 7a2 2 0 0 1 0 2.8Z" /><circle cx="8" cy="8" r="1.2" /></svg>;
    case "money":
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M7 8h.01M17 16h.01" /></svg>;
    case "box":
      return <svg {...common}><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
    case "filter":
      return <svg {...common}><path d="M4 6h16M7 12h10M10 18h4" /></svg>;
    case "edit":
      return <svg {...common}><path d="m4 16.5-.8 4.3 4.3-.8L19 8.5a2.1 2.1 0 0 0-3-3L4 16.5Z" /><path d="m14.5 7.5 2 2" /></svg>;
    case "trash":
      return <svg {...common}><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></svg>;
    case "layers":
      return <svg {...common}><path d="m12 3 8 4-8 4-8-4 8-4Z" /><path d="m4 12 8 4 8-4M4 17l8 4 8-4" /></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "close":
      return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
    case "alert":
      return <svg {...common}><path d="M10.3 4.2 2.7 17.3A2 2 0 0 0 4.4 20h15.2a2 2 0 0 0 1.7-2.7L13.7 4.2a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 16h.01" /></svg>;
    case "check":
      return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
    case "upload":
      return <svg {...common}><path d="M12 16V4M8 8l4-4 4 4M5 20h14" /></svg>;
    case "mic":
      return <svg {...common}><rect x="8" y="3" width="8" height="12" rx="4" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></svg>;
    case "file":
      return <svg {...common}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h4M9 13h6M9 17h6" /></svg>;
    case "truck":
      return <svg {...common}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>;
    case "receipt":
      return <svg {...common}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>;
    case "chevron":
      return <svg {...common}><path d="m7 10 5 5 5-5" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
      <Icon name="alert" size={14} />
      {children}
    </p>
  );
}

function IconButton({
  label,
  icon,
  onClick,
  tone = "default",
}: {
  label: string;
  icon: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg p-2 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${
        tone === "danger"
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      }`}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showProductImportMenu, setShowProductImportMenu] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [productErrors, setProductErrors] = useState<ProductErrors>({});
  const [productFormError, setProductFormError] = useState("");

  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([]);
  const [bulkError, setBulkError] = useState("");
  const [bulkSuccess, setBulkSuccess] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceElapsed, setVoiceElapsed] = useState(0);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const voiceRecognitionRef = useRef<any>(null);
  const voiceActiveRef = useRef(false);
  const voiceTranscriptRef = useRef("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const voiceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [variantProduct, setVariantProduct] = useState<Product | null>(null);
  const [variantForm, setVariantForm] = useState(emptyVariant);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [variantErrors, setVariantErrors] = useState<VariantErrors>({});
  const [variantFormError, setVariantFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/product", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Unable to load products");
      setProducts(data.products);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("add") === "1" || params.get("add") === "true") {
      setShowProductImportMenu(true);
      window.history.replaceState({}, "", "/Products");
    }
  }, []);

  function resetProductForm() {
    setProductForm(emptyProduct);
    setProductErrors({});
    setProductFormError("");
  }

  function openNewProduct() {
    setEditingProduct(null);
    resetProductForm();
    setShowProductModal(true);
    
    setShowProductImportMenu(false);
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    });
    setProductErrors({});
    setProductFormError("");
    setShowProductModal(true);
  }

  function suggestCategory(name: string) {
    const value = name.toLowerCase();
    const rules: Array<[string[], string]> = [
      [["jean", "shirt", "trouser", "dress", "skirt", "hoodie", "jacket", "shoe", "sneaker", "bag", "cap", "clothing"], "Fashion"],
      [["chicken", "beef", "fish", "rice", "bread", "milk", "egg", "food", "meat", "yam", "drink", "juice"], "Food"],
      [["phone", "laptop", "tablet", "charger", "earphone", "headphone", "keyboard", "mouse", "computer"], "Electronics"],
      [["soap", "cream", "shampoo", "perfume", "lotion", "makeup", "cosmetic"], "Beauty"],
      [["chair", "table", "sofa", "mattress", "pillow", "curtain", "furniture"], "Home"],
      [["oil", "filter", "brake", "tyre", "tire", "battery", "spark plug", "car part", "motor"], "Automotive"],
    ];
    for (const [keywords, category] of rules) {
      if (keywords.some((keyword) => value.includes(keyword))) return category;
    }
    return "";
  }

  function applySmartCategory(name: string, currentCategory: string) {
    if (currentCategory.trim()) return currentCategory;
    return suggestCategory(name);
  }

  function validateProductForm(): boolean {
    const next: ProductErrors = {};
    const price = Number(productForm.price);
    const stock = Number(productForm.stock);

    if (!productForm.name.trim()) next.name = "Product name is required.";
    if (!productForm.category.trim()) next.category = "Category is required.";
    if (productForm.price === "" || !Number.isInteger(price) || price < 0) next.price = "Enter a valid price.";
    if (productForm.stock === "" || !Number.isInteger(stock) || stock < 0) next.stock = "Enter a valid stock quantity.";

    setProductErrors(next);
    setProductFormError("");
    return Object.keys(next).length === 0;
  }

  async function saveProduct() {
    if (!validateProductForm()) return;
    const price = Number(productForm.price);
    const stock = Number(productForm.stock);

    try {
      setSaving(true);
      const response = await fetch(
        editingProduct ? `/api/product/${editingProduct.id}` : "/api/product",
        {
          method: editingProduct ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: productForm.name.trim(),
            category: productForm.category.trim(),
            price,
            stock,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Unable to save product");

      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
      await loadProducts();
    } catch (err) {
      console.error(err);
      setProductFormError(err instanceof Error ? err.message : "Unable to save product");
    } finally {
      setSaving(false);
    }
  }

  function validateBulkRows(rows: BulkRow[]) {
    return rows.map((row) => {
      const errors: ProductErrors = {};
      const smartCategory = applySmartCategory(row.name, row.category);
      const normalizedRow = smartCategory && !row.category.trim() ? { ...row, category: smartCategory } : row;
      const price = Number(normalizedRow.price);
      const stock = Number(normalizedRow.stock);
      if (!normalizedRow.name.trim()) errors.name = "Product name is required.";
      if (!normalizedRow.category.trim()) errors.category = "Category is required.";
      if (normalizedRow.price === "" || !Number.isInteger(price) || price < 0) errors.price = "Enter a valid price.";
      if (normalizedRow.stock === "" || !Number.isInteger(stock) || stock < 0) errors.stock = "Enter a valid stock quantity.";
      return { ...normalizedRow, errors };
    });
  }

  function openBulkImport() {
    setShowProductImportMenu(false);
    setBulkRows([]);
    setBulkError("");
    setBulkSuccess("");
    setShowBulkImport(true);
  }

  function parseCsv(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = "";
    let quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      const next = text[i + 1];
      if (ch === '"' && quoted && next === '"') { cell += '"'; i += 1; continue; }
      if (ch === '"') { quoted = !quoted; continue; }
      if (ch === "," && !quoted) { row.push(cell.trim()); cell = ""; continue; }
      if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && next === "\n") i += 1;
        row.push(cell.trim()); cell = "";
        if (row.some(Boolean)) rows.push(row);
        row = [];
        continue;
      }
      cell += ch;
    }
    row.push(cell.trim());
    if (row.some(Boolean)) rows.push(row);
    return rows;
  }

  async function handleImportFile(file: File) {
    setBulkError("");
    setBulkSuccess("");
    try {
      const ext = file.name.toLowerCase().split(".").pop();
      let rows: BulkRow[] = [];

      if (ext === "csv") {
        const matrix = parseCsv(await file.text());
        if (matrix.length < 2) throw new Error("The CSV must contain a header row and at least one product.");
        const headers = matrix[0].map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
        const index = (names: string[]) => headers.findIndex((h) => names.includes(h));
        const nameIndex = index(["name", "productname"]);
        const categoryIndex = index(["category"]);
        const priceIndex = index(["price", "baseprice"]);
        const stockIndex = index(["stock", "quantity"]);
        if ([nameIndex, categoryIndex, priceIndex, stockIndex].some((i) => i < 0)) {
          throw new Error("CSV headers must include name, category, price, and stock.");
        }
        rows = matrix.slice(1).map((r) => ({ name: r[nameIndex] || "", category: r[categoryIndex] || "", price: r[priceIndex] || "", stock: r[stockIndex] || "", errors: {} }));
      } else if (ext === "xlsx" || ext === "xls") {
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
        const first = workbook.Sheets[workbook.SheetNames[0]];
        const matrix = XLSX.utils.sheet_to_json(first, { header: 1, defval: "" }) as unknown[][];
        if (matrix.length < 2) throw new Error("The Excel file must contain a header row and at least one product.");
        const headers = (matrix[0] as unknown[]).map((h) => String(h).toLowerCase().replace(/[^a-z]/g, ""));
        const index = (names: string[]) => headers.findIndex((h) => names.includes(h));
        const nameIndex = index(["name", "productname"]);
        const categoryIndex = index(["category"]);
        const priceIndex = index(["price", "baseprice"]);
        const stockIndex = index(["stock", "quantity"]);
        if ([nameIndex, categoryIndex, priceIndex, stockIndex].some((i) => i < 0)) {
          throw new Error("Excel headers must include name, category, price, and stock.");
        }
        rows = matrix.slice(1).map((r) => ({ name: String(r[nameIndex] ?? ""), category: String(r[categoryIndex] ?? ""), price: String(r[priceIndex] ?? ""), stock: String(r[stockIndex] ?? ""), errors: {} }));
      } else {
        throw new Error("Please choose a CSV, XLS, or XLSX file.");
      }

      const validated = validateBulkRows(rows);
      setBulkRows(validated);
      if (validated.some((r) => Object.keys(r.errors).length > 0)) {
        setBulkError("Fix every highlighted field before importing. Nothing has been published.");
      } else {
        setBulkSuccess(`${validated.length} product${validated.length === 1 ? "" : "s"} ready to import.`);
      }
    } catch (err) {
      setBulkRows([]);
      setBulkError(err instanceof Error ? err.message : "Unable to read the file.");
    }
  }

  function updateBulkRow(index: number, field: keyof Omit<BulkRow, "errors">, value: string) {
    setBulkRows((current) => validateBulkRows(current.map((row, i) => i === index ? { ...row, [field]: value } : row)));
    setBulkError("");
    setBulkSuccess("");
  }

  async function publishBulkRows() {
    const validated = validateBulkRows(bulkRows);
    setBulkRows(validated);
    if (!validated.length) { setBulkError("Add at least one product before importing."); return; }
    if (validated.some((r) => Object.keys(r.errors).length > 0)) { setBulkError("Every product must pass validation before it can be published."); return; }

    try {
      setSaving(true);
      const response = await fetch("/api/product/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: true, products: validated.map(({ name, category, price, stock }) => ({ name: name.trim(), category: category.trim(), price: Number(price), stock: Number(stock) })) }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Unable to import products");
      setBulkSuccess(`${data.count} product${data.count === 1 ? "" : "s"} imported successfully.`);
      setBulkRows([]);
      await loadProducts();
    } catch (err) {
      setBulkError(err instanceof Error ? err.message : "Unable to import products.");
    } finally {
      setSaving(false);
    }
  }

  function stopVoiceEntry() {
    voiceActiveRef.current = false;
    setIsListening(false);
    if (voiceRecognitionRef.current) {
      try { voiceRecognitionRef.current.stop(); } catch {}
    }
    voiceRecognitionRef.current = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    mediaRecorderRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    voiceTimerRef.current = null;
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => undefined);
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    setVoiceLevel(0);
  }

  function wordsToNumber(value: string) {
    const cleaned = value.toLowerCase().replace(/[,₦]/g, " ").replace(/\bngn\b/g, "").trim();
    if (!cleaned) return "";
    if (/^\d+(?:\.\d+)?$/.test(cleaned)) return String(Math.round(Number(cleaned)));

    const units: Record<string, number> = {
      zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
      ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
      seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
      sixty: 60, seventy: 70, eighty: 80, ninety: 90,
    };
    const tokens = cleaned.split(/\s+/).filter(Boolean);
    let total = 0;
    let current = 0;
    let found = false;
    for (const token of tokens) {
      if (token === "and") continue;
      if (units[token] !== undefined) { current += units[token]; found = true; continue; }
      if (token === "hundred") { current = (current || 1) * 100; found = true; continue; }
      if (token === "thousand") { total += (current || 1) * 1000; current = 0; found = true; continue; }
      if (token === "million") { total += (current || 1) * 1000000; current = 0; found = true; continue; }
      return "";
    }
    return found ? String(total + current) : "";
  }

  function processVoiceTranscript(transcript: string) {
    const clean = transcript.replace(/\s+/g, " ").trim();
    if (!clean) {
      setBulkError("No speech was captured. Please try again.");
      return;
    }

    // A voice entry is one or more product commands. We split only at an explicit
    // product boundary so fields belonging to one product cannot leak into another.
    const chunks = clean
      .split(/(?:^|\s)(?:add|next product|next item)\s+/gi)
      .map((chunk) => chunk.replace(/^[,;:.\s]+|[,;:.\s]+$/g, "").trim())
      .filter(Boolean);

    const parsed: BulkRow[] = chunks.map((chunk) => {
      const fieldPattern = /\b(?:category|price|cost|stock|quantity)\b/i;
      const nameMatch = chunk.match(/^(?:product name|product|name)\s*(?:is|:)?\s*(.*?)(?=\s+\b(?:category|price|cost|stock|quantity)\b|$)/i);
      const fallbackName = chunk.match(/^(.*?)(?=\s+\b(?:category|price|cost|stock|quantity)\b|$)/i);
      const name = (nameMatch?.[1] || fallbackName?.[1] || "").replace(/[,;:.]+$/g, "").trim();

      const getField = (label: string, nextLabels: string[]) => {
        const next = nextLabels.join("|");
        const match = chunk.match(new RegExp(`\\b${label}\\b\\s*(?:is|:)?\\s*(.*?)(?=\\s+\\b(?:${next})\\b|$)`, "i"));
        return match?.[1]?.replace(/[,;:.]+$/g, "").trim() || "";
      };

      const explicitCategory = getField("category", ["price", "cost", "stock", "quantity"]);
      const priceText = getField("price", ["category", "stock", "quantity", "cost"]);
      const costText = getField("cost", ["category", "price", "stock", "quantity"]);
      const stockText = getField("stock", ["category", "price", "cost", "quantity"]);
      const quantityText = getField("quantity", ["category", "price", "cost", "stock"]);
      const price = wordsToNumber(priceText || costText);
      const stock = wordsToNumber(stockText || quantityText);
      const category = applySmartCategory(name, explicitCategory);

      const errors: ProductErrors = {};
      if (!name || fieldPattern.test(name)) errors.name = "Voice could not identify a clean product name. Review this field.";
      if (!category || fieldPattern.test(category)) errors.category = "Category could not be identified clearly. Review this field.";
      if (!price) errors.price = "Voice could not identify a valid price. Review this field.";
      if (!stock) errors.stock = "Voice could not identify a valid stock quantity. Review this field.";

      return { name, category, price, stock, errors };
    });

    const validated = validateBulkRows(parsed).map((row) => {
      // Preserve the stricter voice-structure errors instead of allowing a malformed
      // transcript to appear green merely because its fields are non-empty.
      const voiceErrors = parsed.find((candidate) => candidate.name === row.name && candidate.price === row.price && candidate.stock === row.stock)?.errors || {};
      return { ...row, errors: { ...row.errors, ...voiceErrors } };
    });

    setBulkRows(validated);
    const hasErrors = validated.some((r) => Object.keys(r.errors).length > 0);
    setBulkError(hasErrors ? "Voice was captured, but some fields could not be structured safely. Review the highlighted cells before publishing." : "");
    setBulkSuccess(!hasErrors ? `${validated.length} product${validated.length === 1 ? "" : "s"} ready to import.` : "");
  }

  async function startVoiceEntry() {
    setShowProductImportMenu(false);
    setShowBulkImport(true);
    setBulkRows([]);
    setBulkError("");
    setBulkSuccess("");
    setVoiceTranscript("");
    voiceTranscriptRef.current = "";
    setVoiceElapsed(0);
    setVoiceLevel(0);
    setVoiceSupported(true);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      setBulkError("Live speech recognition is not available in this browser. Try Chrome/Edge or use Excel/CSV.");
      return;
    }

    voiceActiveRef.current = true;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-NG";
    recognition.interimResults = true;
    recognition.continuous = true;
    voiceRecognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setBulkError("");
    };
    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = String(event.results[i]?.[0]?.transcript || "").trim();
        if (event.results[i].isFinal) finalText += `${text} `;
        else interimText += `${text} `;
      }
      if (finalText) voiceTranscriptRef.current = `${voiceTranscriptRef.current} ${finalText}`.trim();
      setVoiceTranscript(`${voiceTranscriptRef.current} ${interimText}`.trim());
    };
    recognition.onerror = (event: any) => {
      if (!voiceActiveRef.current) return;
      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        voiceActiveRef.current = false;
        setIsListening(false);
        setBulkError("Microphone permission was blocked. Allow microphone access and try again.");
      }
    };
    recognition.onend = () => {
      if (voiceActiveRef.current) {
        try { recognition.start(); } catch {}
      } else {
        setIsListening(false);
      }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const context = new AudioContextClass();
        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        audioContextRef.current = context;
        analyserRef.current = analyser;
        const data = new Uint8Array(analyser.frequencyBinCount);
        const animate = () => {
          if (!voiceActiveRef.current || !analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(data);
          const average = data.reduce((sum, value) => sum + value, 0) / data.length;
          setVoiceLevel(Math.min(1, average / 90));
          animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();
      }
      if (typeof MediaRecorder !== "undefined") {
        const recorder = new MediaRecorder(stream);
        recorder.start(1000);
        mediaRecorderRef.current = recorder;
      }
      voiceTimerRef.current = setInterval(() => setVoiceElapsed((value) => value + 1), 1000);
      recognition.start();
    } catch {
      voiceActiveRef.current = false;
      setIsListening(false);
      setBulkError("Microphone access is required for voice entry. Please allow microphone access and try again.");
    }
  }

  function requestRemoveProduct(product: Product) {
    setDeleteTarget({ type: "product", product });
  }

  function openVariants(product: Product) {
    setVariantProduct(product);
    setVariantForm(emptyVariant);
    setEditingVariant(null);
    setVariantErrors({});
    setVariantFormError("");
  }

  function openEditVariant(variant: Variant) {
    setEditingVariant(variant);
    setVariantForm({ name: variant.name, price: String(variant.price), stock: String(variant.stock) });
    setVariantErrors({});
    setVariantFormError("");
  }

  function validateVariantForm(): boolean {
    const next: VariantErrors = {};
    const price = Number(variantForm.price);
    const stock = Number(variantForm.stock);

    if (!variantForm.name.trim()) next.name = "Variant name is required.";
    if (variantForm.price === "" || !Number.isInteger(price) || price < 0) next.price = "Enter a valid price.";
    if (variantForm.stock === "" || !Number.isInteger(stock) || stock < 0) next.stock = "Enter a valid stock quantity.";

    setVariantErrors(next);
    setVariantFormError("");
    return Object.keys(next).length === 0;
  }

  async function saveVariant() {
    if (!variantProduct || !validateVariantForm()) return;
    const price = Number(variantForm.price);
    const stock = Number(variantForm.stock);

    try {
      setSaving(true);
      const response = await fetch(
        editingVariant ? `/api/product-variant/${editingVariant.id}` : "/api/product-variant",
        {
          method: editingVariant ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: variantProduct.id,
            name: variantForm.name.trim(),
            price,
            stock,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Unable to save variant");

      setVariantForm(emptyVariant);
      setEditingVariant(null);
      setVariantErrors({});
      await refreshVariantProduct(variantProduct.id);
    } catch (err) {
      console.error(err);
      setVariantFormError(err instanceof Error ? err.message : "Unable to save variant");
    } finally {
      setSaving(false);
    }
  }

  function requestRemoveVariant(variant: Variant) {
    setDeleteTarget({ type: "variant", variant });
  }

  async function refreshVariantProduct(productId: string) {
    await loadProducts();
    const response = await fetch("/api/product", { cache: "no-store" });
    const data = await response.json();
    const updated = data.products?.find((p: Product) => p.id === productId);
    if (updated) setVariantProduct(updated);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      setSaving(true);
      setError("");
      const url =
        deleteTarget.type === "product"
          ? `/api/product/${deleteTarget.product.id}`
          : `/api/product-variant/${deleteTarget.variant.id}`;

      const response = await fetch(url, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Unable to remove item");

      const deletedProductId = deleteTarget.type === "product" ? deleteTarget.product.id : null;
      setDeleteTarget(null);
      await loadProducts();

      if (deletedProductId && variantProduct?.id === deletedProductId) {
        setVariantProduct(null);
      } else if (variantProduct) {
        await refreshVariantProduct(variantProduct.id);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to remove item");
      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  }

  const categories = useMemo(
    () => ["All categories", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "All categories" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Icon name="package" size={20} />
                </span>
                <h1 className="text-2xl font-bold">Products</h1>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Manage your products, pricing, variants, and inventory.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowProductImportMenu(true)}
              className="hidden items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:inline-flex"
            >
              <Icon name="plus" size={18} />
              New Product
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Icon name="layers" size={19} />
              </span>
              <div>
                <h2 className="text-xl font-bold">All Products</h2>
                <p className="mt-1 text-sm text-slate-500">Products and inventory are loaded from the database.</p>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="search" size={18} /></span>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="relative sm:w-56">
                <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"><Icon name="filter" size={17} /></span>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  aria-label="Filter by category"
                  className="h-12 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-10 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="chevron" size={16} /></span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-4 mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6">
              <Icon name="alert" size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-slate-500">Loading products...</div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Variants</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Icon name="package" size={18} /></span>
                            <div>
                              <div className="font-semibold text-slate-900">{product.name}</div>
                              <div className="mt-1 text-xs text-slate-500">{product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5"><span className="inline-flex items-center gap-2 text-slate-600"><Icon name="tag" size={16} />{product.category}</span></td>
                        <td className="px-6 py-5 font-semibold"><span className="inline-flex items-center gap-2"><Icon name="money" size={16} />{money(product.price)}</span></td>
                        <td className="px-6 py-5"><span className="inline-flex items-center gap-2"><Icon name="box" size={16} />{product.stock}</span></td>
                        <td className="px-6 py-5">{product.variants.length}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.status === "In stock" ? "bg-emerald-100 text-emerald-700" : product.status === "Low stock" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-1">
                            <button type="button" onClick={() => openVariants(product)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"><Icon name="layers" size={16} />Variants</button>
                            <IconButton label="Edit product" icon="edit" onClick={() => openEditProduct(product)} />
                            <IconButton label="Remove product" icon="trash" tone="danger" onClick={() => requestRemoveProduct(product)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 p-4 lg:hidden">
                {filteredProducts.map((product) => (
                  <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><Icon name="package" size={20} /></span>
                        <div className="min-w-0">
                          <p className="truncate font-bold">{product.name}</p>
                          <p className="mt-1 truncate text-xs text-slate-500">{product.id}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${product.status === "In stock" ? "bg-emerald-100 text-emerald-700" : product.status === "Low stock" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{product.status}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                      <div className="flex items-center gap-2"><Icon name="tag" size={16} /><span className="text-slate-500">Category</span></div><span className="text-right font-medium">{product.category}</span>
                      <div className="flex items-center gap-2"><Icon name="money" size={16} /><span className="text-slate-500">Price</span></div><span className="text-right font-semibold">{money(product.price)}</span>
                      <div className="flex items-center gap-2"><Icon name="box" size={16} /><span className="text-slate-500">Stock</span></div><span className="text-right font-medium">{product.stock}</span>
                      <div className="flex items-center gap-2"><Icon name="layers" size={16} /><span className="text-slate-500">Variants</span></div><span className="text-right font-medium">{product.variants.length}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <button type="button" onClick={() => openVariants(product)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-2 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Icon name="layers" size={16} />Variants</button>
                      <button type="button" onClick={() => openEditProduct(product)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-300 px-2 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"><Icon name="edit" size={16} />Edit</button>
                      <button type="button" onClick={() => requestRemoveProduct(product)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-300 px-2 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"><Icon name="trash" size={16} />Remove</button>
                    </div>
                  </article>
                ))}
              </div>

              {filteredProducts.length === 0 && <div className="px-6 py-12 text-center text-sm text-slate-500">No products match your search or filters.</div>}
            </>
          )}
        </div>
      </section>


      {showProductImportMenu && (
        <div className="fixed inset-0 z-[53] flex items-end bg-slate-950/30 backdrop-blur-[2px] sm:items-center sm:justify-center sm:p-4">
          <button
            type="button"
            aria-label="Close add product options"
            onClick={() => setShowProductImportMenu(false)}
            className="absolute inset-0"
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />
            <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Products</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">How do you want to add products?</h2>
                <p className="mt-1 text-sm text-slate-500">Choose a method. You can review everything before it is saved.</p>
              </div>
              <IconButton label="Close" icon="close" onClick={() => setShowProductImportMenu(false)} />
            </div>

            <div className="space-y-3 px-5 pb-6 sm:px-6">
              <button
                type="button"
                onClick={openNewProduct}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 active:translate-y-0"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-200">
                  <Icon name="plus" size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-900">Add manually</span>
                  <span className="mt-0.5 block text-xs text-slate-500">Enter one product using the product form.</span>
                </span>
                <Icon name="chevron" size={18} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProductImportMenu(false);
                  setBulkRows([]);
                  setBulkError("");
                  setBulkSuccess("");
                  setShowBulkImport(true);
                  window.setTimeout(() => fileInputRef.current?.click(), 80);
                }}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 active:translate-y-0"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-emerald-100 group-hover:text-emerald-700">
                  <Icon name="upload" size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-900">Import Excel / CSV</span>
                  <span className="mt-0.5 block text-xs text-slate-500">Bring in a spreadsheet, review the rows, then submit.</span>
                </span>
                <Icon name="chevron" size={18} />
              </button>

              <button
                type="button"
                onClick={startVoiceEntry}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 active:translate-y-0"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-200">
                  <Icon name="mic" size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-900">Add by voice</span>
                  <span className="mt-0.5 block text-xs text-slate-500">Speak naturally, finish when ready, then review the generated sheet.</span>
                </span>
                <Icon name="chevron" size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkImport && (
        <div className="fixed inset-0 z-[54] flex items-end bg-slate-900/40 p-3 sm:items-center sm:justify-center">
          <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
              <div>
                <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><Icon name={isListening ? "mic" : "file"} size={18} /></span><h2 className="text-xl font-bold">Product Import & Voice Entry</h2></div>
                <p className="mt-2 text-sm text-slate-500">Structure first. Validate every required field. Publish only when everything is correct.</p>
              </div>
              <IconButton label="Close" icon="close" onClick={() => { stopVoiceEntry(); setShowBulkImport(false); }} />
            </div>

            <div className="space-y-5 px-5 py-6 sm:px-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700"><Icon name="upload" /></span>
                  <span><span className="block font-semibold">Import Excel / CSV</span><span className="block text-xs text-slate-500">name, category, price, stock</span></span>
                  <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => e.target.files?.[0] && handleImportFile(e.target.files[0])} />
                </label>
                <button type="button" onClick={startVoiceEntry} disabled={isListening} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-60">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><Icon name="mic" /></span><span><span className="block font-semibold">{isListening ? "Listening…" : "Add by voice"}</span><span className="block text-xs text-slate-500">Say name, category, price, stock.</span></span>
                </button>
                <button type="button" onClick={() => setBulkRows((r) => [...r, { name: "", category: "", price: "", stock: "", errors: { name: "Product name is required.", category: "Category is required.", price: "Enter a valid price.", stock: "Enter a valid stock quantity." } }])} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left hover:border-emerald-300 hover:bg-emerald-50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><Icon name="plus" /></span><span><span className="block font-semibold">Add row manually</span><span className="block text-xs text-slate-500">Add another product to the sheet.</span></span>
                </button>
              </div>

              {isListening && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900"><span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-white"><Icon name="mic" size={18} /><span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" /></span>Listening</p>
                      <p className="mt-1 text-xs text-emerald-800">Speak naturally. You can keep talking and say “next product” between products.</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-800">{Math.floor(voiceElapsed / 60).toString().padStart(2, "0")}:{(voiceElapsed % 60).toString().padStart(2, "0")}</span>
                  </div>
                  <div className="mt-5 flex h-16 items-end justify-center gap-1 overflow-hidden rounded-xl bg-white px-4 py-3">
                    {Array.from({ length: 28 }).map((_, index) => {
                      const wave = 8 + Math.round(Math.abs(Math.sin(index * 1.7 + voiceElapsed * 2.2)) * 22 * Math.max(0.15, voiceLevel));
                      return <span key={index} className="w-1.5 rounded-full bg-emerald-600 transition-all duration-100" style={{ height: `${wave}px` }} />;
                    })}
                  </div>
                  <div className="mt-4 rounded-xl bg-white p-3 text-sm text-slate-700">
                    {voiceTranscript ? voiceTranscript : "Listening for product details…"}
                  </div>
                  <button type="button" onClick={() => { stopVoiceEntry(); processVoiceTranscript(voiceTranscriptRef.current); }} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"><Icon name="check" size={18} />Done — process voice</button>
                </div>
              )}

              {!isListening && !voiceSupported && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><p className="font-semibold">Voice recognition unavailable</p><p className="mt-1">Use a supported browser such as Chrome or Edge for live voice-to-sheet processing.</p></div>
              )}

              {!isListening && voiceTranscript && !bulkRows.length && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold">Voice captured</p>
                  <p className="mt-1 text-sm text-slate-600">The transcript is ready to be structured into the product sheet.</p>
                  <button type="button" onClick={() => processVoiceTranscript(voiceTranscript)} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white"><Icon name="check" size={16} />Process into sheet</button>
                </div>
              )}

              {bulkError && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700"><Icon name="alert" size={17} /><span>{bulkError}</span></div>}
              {bulkSuccess && <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700"><Icon name="check" size={17} /><span>{bulkSuccess}</span></div>}

              {bulkRows.length > 0 ? (
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Products to add</p>
                      <p className="text-xs text-slate-500">Add as many products as you need, then validate and submit.</p>
                    </div>
                    <button type="button" onClick={() => setBulkRows((r) => [...r, { name: "", category: "", price: "", stock: "", errors: { name: "Product name is required.", category: "Category is required.", price: "Enter a valid price.", stock: "Enter a valid stock quantity." } }])} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100" title="Add another product">
                      <Icon name="plus" size={16} /> Add product
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-[760px] w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-3">Product name</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Price</th><th className="px-3 py-3">Stock</th><th className="px-3 py-3">Validation</th></tr></thead>
                    <tbody className="divide-y divide-slate-200">
                      {bulkRows.map((row, index) => {
                        const field = (key: keyof ProductErrors) => row.errors[key];
                        return <tr key={index} className="align-top">
                          {(["name", "category", "price", "stock"] as const).map((key) => <td key={key} className="px-3 py-3"><input value={row[key]} onChange={(e) => updateBulkRow(index, key, e.target.value)} className={`h-10 w-full min-w-[150px] rounded-lg border px-3 outline-none ${field(key) ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-emerald-600"}`} /></td>)}
                          <td className="px-3 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${Object.keys(row.errors).length ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}><Icon name={Object.keys(row.errors).length ? "alert" : "check"} size={13} />{Object.keys(row.errors).length ? "Needs correction" : "Valid"}</span>{Object.values(row.errors).length > 0 && <ul className="mt-2 space-y-1 text-xs text-red-600">{Object.values(row.errors).map((e, i) => <li key={i}>{e}</li>)}</ul>}</td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                  </div>
                </div>
              ) : <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500">No products are staged yet. Choose Excel/CSV, use voice, or add a row manually.</div>}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setShowBulkImport(false)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button>
                <button type="button" disabled={saving || !bulkRows.length || bulkRows.some((r) => Object.keys(r.errors).length)} onClick={publishBulkRows} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"><Icon name="check" size={17} />{saving ? "Publishing…" : "Validate & Publish"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProductModal && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><Icon name="package" size={18} /></span><h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Add New Product"}</h2></div><p className="mt-2 text-sm text-slate-500">{editingProduct ? "Update your product information." : "Add a product to your inventory."}</p></div>
                <IconButton label="Close" icon="close" onClick={() => { setShowProductModal(false); resetProductForm(); }} />
              </div>
            </div>

            <div className="space-y-5 px-5 py-6 sm:px-6">
              {productFormError && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700"><Icon name="alert" size={17} /><span>{productFormError}</span></div>}

              <div>
                <label className="mb-1.5 block text-sm font-medium">Product name</label>
                <div className="relative"><span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${productErrors.name ? "text-red-500" : "text-slate-400"}`}><Icon name="package" size={17} /></span><input value={productForm.name} onChange={(e) => { const name = e.target.value; const suggested = suggestCategory(name); setProductForm({ ...productForm, name, category: productForm.category.trim() ? productForm.category : suggested }); if (productErrors.name) setProductErrors({ ...productErrors, name: undefined }); if (suggested && productErrors.category) setProductErrors({ ...productErrors, name: undefined, category: undefined }); }} className={`h-11 w-full rounded-lg border pl-10 pr-3 text-sm outline-none ${productErrors.name ? "border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"}`} placeholder="e.g. Black Shirt" /></div>
                <FieldError>{productErrors.name}</FieldError>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Category</label>
                <div className="relative"><span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${productErrors.category ? "text-red-500" : "text-slate-400"}`}><Icon name="tag" size={17} /></span><input value={productForm.category} onChange={(e) => { setProductForm({ ...productForm, category: e.target.value }); if (productErrors.category) setProductErrors({ ...productErrors, category: undefined }); }} className={`h-11 w-full rounded-lg border pl-10 pr-3 text-sm outline-none ${productErrors.category ? "border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"}`} placeholder="e.g. Shirts" /></div>
                {!productForm.category.trim() && suggestCategory(productForm.name) && !productErrors.category && (
                  <button type="button" onClick={() => setProductForm({ ...productForm, category: suggestCategory(productForm.name) })} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"><Icon name="tag" size={13} />Suggested category: {suggestCategory(productForm.name)}</button>
                )}
                <FieldError>{productErrors.category}</FieldError>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Base price</label>
                  <div className="relative"><span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${productErrors.price ? "text-red-500" : "text-slate-400"}`}><Icon name="money" size={17} /></span><input type="number" min="0" value={productForm.price} onChange={(e) => { setProductForm({ ...productForm, price: e.target.value }); if (productErrors.price) setProductErrors({ ...productErrors, price: undefined }); }} className={`h-11 w-full rounded-lg border pl-10 pr-3 text-sm outline-none ${productErrors.price ? "border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"}`} placeholder="12000" /></div>
                  <FieldError>{productErrors.price}</FieldError>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Base stock</label>
                  <div className="relative"><span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${productErrors.stock ? "text-red-500" : "text-slate-400"}`}><Icon name="box" size={17} /></span><input type="number" min="0" value={productForm.stock} onChange={(e) => { setProductForm({ ...productForm, stock: e.target.value }); if (productErrors.stock) setProductErrors({ ...productErrors, stock: undefined }); }} className={`h-11 w-full rounded-lg border pl-10 pr-3 text-sm outline-none ${productErrors.stock ? "border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"}`} placeholder="50" /></div>
                  <FieldError>{productErrors.stock}</FieldError>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">
              <button type="button" onClick={() => { setShowProductModal(false); resetProductForm(); }} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="button" disabled={saving} onClick={saveProduct} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"><Icon name={saving ? "box" : "check"} size={17} />{saving ? "Saving..." : editingProduct ? "Save Changes" : "Add Product"}</button>
            </div>
          </div>
        </div>
      )}

      {variantProduct && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
              <div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700"><Icon name="layers" size={15} />Product variants</p><h2 className="mt-1 text-xl font-bold">{variantProduct.name}</h2></div>
              <IconButton label="Close" icon="close" onClick={() => setVariantProduct(null)} />
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold"><Icon name={editingVariant ? "edit" : "plus"} size={17} />{editingVariant ? "Edit variant" : "Add variant"}</p>
                {variantFormError && <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700"><Icon name="alert" size={17} /><span>{variantFormError}</span></div>}
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div><div className="relative"><span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${variantErrors.name ? "text-red-500" : "text-slate-400"}`}><Icon name="tag" size={16} /></span><input placeholder="Variant name e.g. Large" value={variantForm.name} onChange={(e) => { setVariantForm({ ...variantForm, name: e.target.value }); if (variantErrors.name) setVariantErrors({ ...variantErrors, name: undefined }); }} className={`h-11 w-full rounded-lg border pl-9 pr-3 text-sm outline-none ${variantErrors.name ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-emerald-600"}`} /></div><FieldError>{variantErrors.name}</FieldError></div>
                  <div><div className="relative"><span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${variantErrors.price ? "text-red-500" : "text-slate-400"}`}><Icon name="money" size={16} /></span><input type="number" min="0" placeholder="Price" value={variantForm.price} onChange={(e) => { setVariantForm({ ...variantForm, price: e.target.value }); if (variantErrors.price) setVariantErrors({ ...variantErrors, price: undefined }); }} className={`h-11 w-full rounded-lg border pl-9 pr-3 text-sm outline-none ${variantErrors.price ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-emerald-600"}`} /></div><FieldError>{variantErrors.price}</FieldError></div>
                  <div><div className="relative"><span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${variantErrors.stock ? "text-red-500" : "text-slate-400"}`}><Icon name="box" size={16} /></span><input type="number" min="0" placeholder="Stock" value={variantForm.stock} onChange={(e) => { setVariantForm({ ...variantForm, stock: e.target.value }); if (variantErrors.stock) setVariantErrors({ ...variantErrors, stock: undefined }); }} className={`h-11 w-full rounded-lg border pl-9 pr-3 text-sm outline-none ${variantErrors.stock ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-emerald-600"}`} /></div><FieldError>{variantErrors.stock}</FieldError></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" disabled={saving} onClick={saveVariant} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><Icon name={saving ? "box" : "check"} size={16} />{saving ? "Saving..." : editingVariant ? "Save Variant" : "Add Variant"}</button>
                  {editingVariant && <button type="button" onClick={() => { setEditingVariant(null); setVariantForm(emptyVariant); setVariantErrors({}); setVariantFormError(""); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-white"><Icon name="close" size={16} />Cancel edit</button>}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4"><Icon name="layers" size={18} /><h3 className="font-semibold">Current variants</h3></div>
                {variantProduct.variants.length === 0 ? <div className="px-4 py-8 text-center text-sm text-slate-500">No variants yet.</div> : <div className="divide-y divide-slate-100">
                  {variantProduct.variants.map((variant) => <div key={variant.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Icon name="tag" size={17} /></span><div><p className="font-semibold">{variant.name}</p><p className="mt-1 text-sm text-slate-500">{money(variant.price)} · {variant.stock} in stock</p></div></div>
                    <div className="flex gap-1 self-end sm:self-auto"><IconButton label={`Edit ${variant.name}`} icon="edit" onClick={() => openEditVariant(variant)} /><IconButton label={`Remove ${variant.name}`} icon="trash" tone="danger" onClick={() => requestRemoveVariant(variant)} /></div>
                  </div>)}
                </div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 p-4" onMouseDown={() => setDeleteTarget(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"><Icon name="trash" size={20} /></span>
              <div className="min-w-0"><h2 className="text-lg font-bold">{deleteTarget.type === "product" ? "Remove product?" : "Remove variant?"}</h2><p className="mt-2 text-sm leading-6 text-slate-600">Are you sure you want to remove <span className="font-semibold text-slate-900">{deleteTarget.type === "product" ? deleteTarget.product.name : deleteTarget.variant.name}</span>? This action cannot be undone.</p></div>
            </div>
            <div className="mt-6 flex gap-3"><button type="button" onClick={() => setDeleteTarget(null)} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button><button type="button" disabled={saving} onClick={confirmDelete} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"><Icon name="trash" size={17} />{saving ? "Removing..." : "Remove"}</button></div>
          </div>
        </div>
      )}
    </main>
  );
}
