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
- **Público-alvo**: 13+ (ou "todas as idades" se não quiser entrar na política de apps para crianças; se marcar
  menores de 13, a política *Families* exige revisão extra).
- **Anúncios**: não contém anúncios.
- **Compras no app**: não.
- **Segurança dos dados (Data safety)**:
  - Coleta de dados: **Não** (o app não envia nada para fora do aparelho).
  - Compartilhamento de dados: **Não**.
  - Criptografia em trânsito / exclusão de dados: não se aplica (sem dados enviados).
  - Se você reativar o Google Analytics dentro do app, será preciso declarar "ID do dispositivo / interações
    do app" coletados e atualizar a política de privacidade.
- **Permissões**: `INTERNET` e `VIBRATE` (sem permissões sensíveis).
- **Categoria**: Jogos › Quebra-cabeça. **Contato**: e-mail de suporte público: `wagner1junior1@gmail.com` (obrigatório na Play).
- **Acesso ao app**: sem login, tudo acessível.

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
