import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
  MaxAdContentRating,
  RewardAdPluginEvents
} from "@capacitor-community/admob";
import type { PluginListenerHandle } from "@capacitor/core";
import { isNativeApp } from "./platform";
import { isAdsRemoved } from "./billing";

// ID do bloco de anúncios Banner (AdMob). IDs do AdMob não são segredo.
// Para testar sem gerar tráfego inválido na conta, compile com VITE_ADMOB_BANNER_ID=ca-app-pub-3940256099942544/6300978111
// (ID de teste do Google); o ID do app fica em android/app/src/main/res/values/strings.xml.
const BANNER_ID =
  (import.meta.env.VITE_ADMOB_BANNER_ID as string | undefined) || "ca-app-pub-1871959449564340/8100817372";

// ID do bloco de anúncios Premiado (AdMob). Precisa ser criado no AdMob (formato "Premiado");
// enquanto não houver ID, o botão de assistir anúncio fica escondido. Para testar sem gerar tráfego
// inválido, compile com VITE_ADMOB_REWARDED_ID=ca-app-pub-3940256099942544/5224354917 (ID de teste do Google).
const REWARDED_ID = (import.meta.env.VITE_ADMOB_REWARDED_ID as string | undefined) || "";

export const isRewardedAdConfigured = isNativeApp && REWARDED_ID !== "";

let started = false;
let adMobReady: Promise<boolean> | null = null;

/**
 * Pede consentimento (UMP) e inicializa o AdMob uma única vez; banner e anúncio premiado dividem isto.
 * Resolve `false` quando o consentimento não permite anúncios ou o SDK falha.
 */
function initAdMob(): Promise<boolean> {
  adMobReady ??= (async () => {
    try {
      try {
        let consent = await AdMob.requestConsentInfo();
        if (consent.isConsentFormAvailable && consent.status === AdmobConsentStatus.REQUIRED) {
          consent = await AdMob.showConsentForm();
        }
        if (!consent.canRequestAds) return false;
      } catch (consentError) {
        // Ex.: mensagem de consentimento ainda não publicada no AdMob. O próprio SDK do Google
        // limita os anúncios onde o consentimento é obrigatório, então seguimos com a inicialização.
        console.warn("Consentimento (UMP) indisponível:", consentError);
      }

      await AdMob.initialize({ maxAdContentRating: MaxAdContentRating.General });
      return true;
    } catch (error) {
      adMobReady = null; // permite tentar de novo depois
      console.warn("AdMob indisponível:", error);
      return false;
    }
  })();
  return adMobReady;
}

/**
 * Mostra a faixa de anúncio na base da tela.
 * Só existe no app nativo; `onHeightChange` informa a altura (px CSS) ocupada pela faixa.
 */
export async function startAdBanner(onHeightChange: (heightPx: number) => void): Promise<void> {
  if (!isNativeApp || started || isAdsRemoved()) return;
  started = true;

  try {
    if (!(await initAdMob())) {
      started = false;
      onHeightChange(0);
      return;
    }

    await AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => onHeightChange(size.height));
    await AdMob.addListener(BannerAdPluginEvents.FailedToLoad, () => onHeightChange(0));

    await AdMob.showBanner({
      adId: BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0
    });
  } catch (error) {
    // Sem internet ou falha do SDK: o jogo segue normalmente, sem anúncio
    started = false;
    onHeightChange(0);
    console.warn("AdMob indisponível:", error);
  }
}

/** Chamado quando o jogador compra "remover anúncios": tira a faixa da tela. */
export async function stopAdBanner(): Promise<void> {
  if (!isNativeApp) return;
  started = false;
  try {
    await AdMob.removeBanner();
  } catch {
    // Sem faixa ativa: nada a remover
  }
}

export type RewardedAdResult = "rewarded" | "dismissed" | "unavailable";

// Segurança contra o anúncio nunca avisar que fechou (um vídeo premiado dura bem menos que isto)
const REWARDED_TIMEOUT_MS = 3 * 60 * 1000;

/**
 * Carrega e mostra um anúncio premiado em tela cheia.
 * "rewarded": o jogador assistiu até o fim e deve receber a recompensa;
 * "dismissed": fechou antes de completar; "unavailable": sem anúncio agora (sem internet, sem estoque, etc.).
 */
export async function showRewardedAd(): Promise<RewardedAdResult> {
  if (isAdsRemoved()) return "rewarded"; // quem removeu os anúncios ganha a vida extra sem assistir
  if (!isRewardedAdConfigured || !(await initAdMob())) return "unavailable";

  const handles: PluginListenerHandle[] = [];
  let earned = false;
  let failed = false;
  let finish!: () => void;
  const closed = new Promise<void>((resolve) => (finish = resolve));

  try {
    handles.push(
      await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        earned = true;
      })
    );
    handles.push(await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => finish()));
    handles.push(
      await AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
        failed = true;
        finish();
      })
    );

    await AdMob.prepareRewardVideoAd({ adId: REWARDED_ID });
    await AdMob.showRewardVideoAd();
    await Promise.race([closed, new Promise<void>((resolve) => setTimeout(resolve, REWARDED_TIMEOUT_MS))]);

    if (earned) return "rewarded";
    return failed ? "unavailable" : "dismissed";
  } catch (error) {
    console.warn("Anúncio premiado indisponível:", error);
    return earned ? "rewarded" : "unavailable";
  } finally {
    handles.forEach((handle) => handle.remove());
  }
}
