# Publicação na Google Play – Sudoku Master Pro

Pacote: `com.sudokumasterpro.app` · versão atual: `1.0.0` (versionCode `1`)

## 1. Pré-requisitos (feitos uma única vez)

1. Conta de desenvolvedor Google Play (taxa única de US$ 25) e verificação de identidade concluída.
   - Contas **pessoais** novas precisam de **teste fechado com 12+ testadores por 14 dias** antes de liberar para produção.
2. **Política de privacidade publicada** (exigida pela Play). O arquivo já está em
   `public/politica-de-privacidade.html`; após o deploy na Vercel a URL fica
   `https://sudoku-chi-two.vercel.app/politica-de-privacidade`. Abra no navegador e confirme que carrega antes de enviar à Play.
3. JDK 21 e Android SDK (ver README).

## 2. Chave de upload (JÁ GERADA)

A chave foi criada fora do repositório, em `C:\Users\Wagner\sudoku-master-pro-keys\`:

- `sudoku-upload-key.jks` (alias `upload`) e `keystore.properties.backup` (senhas).
- SHA-256: `DD:1A:F0:12:95:8E:FF:33:44:29:86:42:21:9E:AD:2C:59:1F:1A:6A:4A:40:E8:02:66:06:4B:DF:47:89:FB:12`
- **Faça backup dessa pasta agora** (pendrive ou gerenciador de senhas). Nunca a versione.
- `android/keystore.properties` já aponta para ela (está no `.gitignore`).
- Na Play Console, ative **Play App Signing** (padrão): o Google guarda a chave final e você só usa a chave de upload.
  Se perder a chave de upload, é possível pedir redefinição ao suporte da Play.

## 3. Gerar o AAB

```bash
npm install
npm run cap:sync
cd android
./gradlew bundleRelease
# saída: android/app/build/outputs/bundle/release/app-release.aab
# AAB 1.0.0 já gerado e assinado: store/Sudoku-Master-Pro-1.0.0-release.aab
```

Alternativa na nuvem: configure os secrets `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`,
`ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` no GitHub e rode o workflow **Build Android AAB**.

> Para cada nova versão enviada, aumente `versionCode` (e ajuste `versionName`) em `android/app/build.gradle`.

## 4. Ficha da loja (copiar e colar)

Textos prontos em [store/listing-pt-BR.md](store/listing-pt-BR.md). Gráficos em `store/`:

| Item | Arquivo | Requisito da Play |
|---|---|---|
| Ícone do app | `store/icon-512.png` | 512×512 PNG |
| Imagem de destaque | `store/feature-graphic-1024x500.png` | 1024×500 |
| Capturas de tela | `store/screenshots/` | mínimo 2, proporção 9:16 ou 16:9 |

## 5. Declarações da Play Console

- **Classificação de conteúdo (IARC)**: jogo de quebra-cabeça, sem violência, sem conteúdo adulto, sem
  interação entre usuários, sem compras → deve resultar em *Livre*.
- **Público-alvo**: **13+** (não marque menores de 13: a política *Families* só permite SDKs de anúncio certificados
  e exigiria outra configuração do AdMob).
- **Anúncios**: **SIM, contém anúncios** (Google AdMob, faixa inferior).
- **Compras no app**: **SIM** — um produto único "Remover anúncios" (ver seção 5.2). Na ficha, a Play mostra "Contém compras no app" sozinha.
- **ID de publicidade**: declare que o app **usa** (finalidade: publicidade). A permissão `AD_ID` entra sozinha pelo SDK.
- **Segurança dos dados (Data safety)** — o AdMob coleta/compartilha dados com o Google:
  - Coleta: **Sim** → *Identificadores de dispositivo ou outros* (ID de publicidade), *Localização aproximada* (IP),
    *Informações do app e desempenho* (diagnósticos) e *Atividade no app* (interações com anúncios).
    Finalidades: **Publicidade ou marketing** e **Análise**. Compartilhado com terceiros: **Sim** (Google).
  - Os dados do jogo (progresso, nome do jogador) ficam só no aparelho: não são coletados.
  - Confira a lista oficial: <https://support.google.com/admob/answer/10130996>
  - Criptografia em trânsito: sim (SDK do Google). Exclusão de dados: o usuário redefine o ID de publicidade no Android.
- **Permissões** (todas normais, sem sensíveis): `INTERNET`, `ACCESS_NETWORK_STATE`, `VIBRATE`, `AD_ID` e as do SDK de anúncios (`ACCESS_ADSERVICES_*`, `WAKE_LOCK`, `FOREGROUND_SERVICE`).
- **Categoria**: Jogos › Quebra-cabeça. **Contato**: e-mail de suporte público: `wagner1junior1@gmail.com` (obrigatório na Play).
- **Acesso ao app**: sem login, tudo acessível.

## 5.1 Configurar o AdMob (obrigatório antes de publicar)

O app está com os **IDs de TESTE do Google**: mostra anúncios de teste e não gera receita.

1. Crie a conta em <https://admob.google.com> e adicione o app Android (`com.sudokumasterpro.app`).
   (Só dá para vincular à loja depois que o app existir na Play; pode adicionar "sem publicar" e vincular depois.)
2. Copie o **ID do app** (`ca-app-pub-XXXX~YYYY`) para `android/app/src/main/res/values/strings.xml` (`admob_app_id`).
3. Crie um bloco de anúncios **Banner** e copie o **ID do bloco** (`ca-app-pub-XXXX/ZZZZ`) para um arquivo `.env.production`
   na raiz: `VITE_ADMOB_BANNER_ID=ca-app-pub-XXXX/ZZZZ` (opcional: o ID de produção já é o padrão do código). No GitHub Actions, defina o mesmo valor
   como *variable* e exporte no passo de build.
4. No AdMob › **Privacidade e mensagens**, crie e **publique** a mensagem de consentimento (GDPR/UMP). Sem ela, usuários
   do EEE/Reino Unido não verão anúncios.
5. Rode `npm run cap:sync` e gere o AAB de novo (aumente o `versionCode`).
6. Nunca clique nos seus próprios anúncios de produção (risco de suspensão da conta).

## 5.2 Compra "Remover anúncios" (R$ 3,99)

O app já tem a compra pronta (modal "Remover anúncios" na tela inicial, restauração automática ao abrir o app).
Falta criar o produto na Play Console e testar:

1. **Perfil de pagamentos:** em Play Console › Configuração › Perfil de pagamentos, preencha os dados do comerciante
   (obrigatório para vender; contas de pessoa física também precisam do perfil).
2. **Criar o produto** (só aparece depois de o app ter um AAB com a permissão de cobrança enviado, em qualquer faixa):
   Monetizar › Produtos › **Produtos no app** › Criar produto:
   - **ID do produto: `remove_ads`** (exatamente assim; não dá para mudar depois)
   - Nome: Remover anúncios · Descrição: Remove todos os anúncios do jogo, para sempre.
   - Preço: **R$ 3,99** (Definir preços: o Google converte para outras moedas) · Status: **Ativo**.
3. **Testar sem cobrar:** Play Console › Configurações › **Testadores de licença** › adicione seu e-mail Gmail. Instale
   o app pela faixa de teste interno e compre: aparece "compra de teste, não será cobrado".
4. Seu e-mail de testador também vê a opção de *reembolsar* a compra para testar a volta dos anúncios.

Detalhes técnicos: compra não consumível, reconhecida automaticamente (a Play reembolsa se não for reconhecida em
3 dias); ao abrir o app ele consulta as compras da conta Google, então reinstalar ou trocar de aparelho restaura sozinho.
A validação é no aparelho (sem servidor próprio), suficiente para um jogo de compra única de baixo valor.

## 6. Fluxo recomendado

1. Play Console › Criar app › preencher ficha, declarações e política de privacidade.
2. **Teste interno** (até 100 testadores, sem revisão) → instale pelo link e valide.
3. **Teste fechado** (obrigatório 12 testadores × 14 dias em contas pessoais novas).
4. **Produção**.
5. Verifique o relatório **pré-lançamento** (Play executa o app em aparelhos reais) antes de promover.

## 7. Itens que dependem de você

- [ ] Fazer push/deploy na Vercel e conferir que https://sudoku-chi-two.vercel.app/politica-de-privacidade abre.
- [ ] Fazer backup da pasta de chaves (item 2).
- [ ] Informar `wagner1junior1@gmail.com` como e-mail de suporte na Play Console (já consta na política de privacidade).
- [ ] Decidir se mantém o Google Analytics apenas na versão web (estado atual) ou também no app.
