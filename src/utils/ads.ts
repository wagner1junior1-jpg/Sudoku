import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
  MaxAdContentRating
} from "@capacitor-community/admob";
import { isNativeApp } from "./platform";

// IDs de TESTE do Google. Em produção defina VITE_ADMOB_BANNER_ID (ID do bloco de anúncios)
// no ambiente de build e troque o admob_app_id em android/app/src/main/res/values/strings.xml.
const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
const BANNER_ID = (import.meta.env.VITE_ADMOB_BANNER_ID as string | undefined) || TEST_BANNER_ID;

let started = false;

/**
 * Pede consentimento (UMP), inicializa o AdMob e mostra a faixa de anúncio na base da tela.
 * Só existe no app nativo; `onHeightChange` informa a altura (px CSS) ocupada pela faixa.
 */
export async function startAdBanner(onHeightChange: (heightPx: number) => void): Promise<void> {
  if (!isNativeApp || started) return;
  started = true;

  try {
    let consent = await AdMob.requestConsentInfo();
    if (consent.isConsentFormAvailable && consent.status === AdmobConsentStatus.REQUIRED) {
      consent = await AdMob.showConsentForm();
    }
    if (!consent.canRequestAds) return;

    await AdMob.initialize({ maxAdContentRating: MaxAdContentRating.General });

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
