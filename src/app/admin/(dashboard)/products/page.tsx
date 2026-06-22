import { getCategories, getProducts } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { ProductManager } from "@/components/admin/ProductManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-ink">Products</h1>
      <p className="mt-2 font-sans text-base text-clay">
        Add new pieces, choose their category, upload photos, and remove old ones.
      </p>

      {!isSupabaseConfigured() && (
        <p className="mt-4 border border-dashed border-sand bg-bone/60 p-3 font-sans text-xs text-clay">
          Supabase isn’t configured, so the list below is the read-only seed
          catalogue and saving is disabled. Add your Supabase keys (see{" "}
          <code className="text-ink">src/lib/supabase/schema.sql</code>) to enable
          creating, editing and deleting products.
        </p>
      )}

      <ProductManager
        products={products}
        categories={categories}
        supabaseConfigured={isSupabaseConfigured()}
      />
    </div>
  );
}
