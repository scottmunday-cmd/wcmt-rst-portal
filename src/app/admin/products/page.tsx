import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { EditableProductRow } from "@/components/admin/EditableProductRow";
import type { Product } from "@/types/database";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  let products: Product[] = [];
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase.from("products").select("*").order("name");
    if (error) throw error;
    products = data ?? [];
  } catch {
    loadError = "Couldn't load products yet — check migrations have run and this account has the admin role.";
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Products &amp; Pricing</h1>
      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}
      <div className="space-y-2">
        {products.map((product) => (
          <EditableProductRow key={product.id} product={product} />
        ))}
        {!loadError && products.length === 0 && (
          <p className="text-sm text-slate-500">No products yet — add rows to the `products` table.</p>
        )}
      </div>
    </div>
  );
}
