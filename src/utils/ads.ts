import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
  MaxAdContentRating
} from "@capacitor-community/admob";
import { isNativeApp } from "./platform";

// ID do bloco de anúncios Banner (AdMob). IDs do AdMob não são segredo.
// Para testar sem gerar tráfego inválido na conta, compile com VITE_ADMOB_BANNER_ID=ca-app-pub-3940256099942544/6300978111
// (ID de teste do Google); o ID do app fica em android/app/src/main/res/values/strings.xml.
const BANNER_ID =
  (import.meta.env.VITE_ADMOB_BANNER_ID as string | undefined) || "ca-app-pub-1871959449564340/8100817372";

let started = false;

/**
 * Pede consentimento (UMP), inicializa o AdMob e mostra a faixa de anúncio na base da tela.
 * Só existe no app nativo; `onHeightChange` informa a altura (px CSS) ocupada pela faixa.
 */
export async function startAdBanner(onHeightChange: (heightPx: number) => void): Promise<void> {
  if (!isNativeApp || started) return;
  started = true;

  try {
    try {
      let consent = await AdMob.requestConsentInfo();
      if (consent.isConsentFormAvailable && consent.status === AdmobConsentStatus.REQUIRED) {
        consent = await AdMob.showConsentForm();
      }
      if (!consent.canRequestAds) return;
    } catch (consentError) {
      // Ex.: mensagem de consentimento ainda não publicada no AdMob. O próprio SDK do Google
      // limita os anúncios onde o consentimento é obrigatório, então seguimos com a inicialização.
      console.warn("Consentimento (UMP) indisponível:", consentError);
    }

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
