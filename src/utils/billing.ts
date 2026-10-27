import { NativePurchases, PURCHASE_TYPE } from "@capgo/native-purchases";
import { isNativeApp } from "./platform";

// Produto único (não consumível) criado na Play Console: Monetizar › Produtos › Produtos no app
export const REMOVE_ADS_PRODUCT_ID = "remove_ads";
export const REMOVE_ADS_FALLBACK_PRICE = "R$ 3,99";

const ADS_REMOVED_KEY = "sudoku_ads_removed_v1";

export type PurchaseResult = "purchased" | "cancelled" | "unavailable";

// A compra fica guardada no aparelho para funcionar offline; syncAdsRemoved() a confirma com a Google Play
export function isAdsRemoved(): boolean {
  try {
    return localStorage.getItem(ADS_REMOVED_KEY) === "1";
  } catch {
    return false;
  }
}

function saveAdsRemoved(value: boolean): void {
  try {
    if (value) localStorage.setItem(ADS_REMOVED_KEY, "1");
    else localStorage.removeItem(ADS_REMOVED_KEY);
  } catch {
    // Ignore
  }
}

/** Preço já formatado na moeda do usuário, ou null se a loja não respondeu. */
export async function loadRemoveAdsPrice(): Promise<string | null> {
  if (!isNativeApp) return null;
  try {
    const { products } = await NativePurchases.getProducts({
      productIdentifiers: [REMOVE_ADS_PRODUCT_ID],
      productType: PURCHASE_TYPE.INAPP
    });
    return products[0]?.priceString ?? null;
  } catch (error) {
    console.warn("Produto de compra indisponível:", error);
    return null;
  }
}

/**
 * Consulta as compras da conta Google. Se a consulta funcionar, o resultado manda
 * (restaura em aparelho novo e desfaz após reembolso); se falhar, mantém o que está salvo.
 */
export async function syncAdsRemoved(): Promise<boolean> {
  if (!isNativeApp) return isAdsRemoved();
  try {
    const { purchases } = await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.INAPP });
    const owned = purchases.some(
      (purchase) => purchase.productIdentifier === REMOVE_ADS_PRODUCT_ID && purchase.purchaseState === "1"
    );
    saveAdsRemoved(owned);
    return owned;
  } catch (error) {
    console.warn("Não foi possível consultar as compras:", error);
    return isAdsRemoved();
  }
}

export async function purchaseRemoveAds(): Promise<PurchaseResult> {
  if (!isNativeApp) return "unavailable";
  try {
    await NativePurchases.purchaseProduct({
      productIdentifier: REMOVE_ADS_PRODUCT_ID,
      productType: PURCHASE_TYPE.INAPP
    });
    saveAdsRemoved(true);
    return "purchased";
  } catch (error) {
    const { code, message } = error as { code?: string; message?: string };
    if (code === "ITEM_ALREADY_OWNED") {
      // Já comprou antes (ex.: reinstalou o app): só confirma e libera
      return (await syncAdsRemoved()) ? "purchased" : "unavailable";
    }
    if (code === "USER_CANCELED" || /cancel/i.test(message ?? "")) return "cancelled";
    console.warn("Falha na compra:", error);
    return "unavailable";
  }
}
