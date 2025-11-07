# Configuração do Storage do Supabase

Para fazer o upload de imagens e vídeos funcionar, você precisa criar o bucket de storage no Supabase.

## Opção 1: Via Interface do Supabase (Mais Fácil)

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Storage** no menu lateral
4. Clique em **"New bucket"** ou **"Criar bucket"**
5. Configure o bucket:
   - **Name (Nome):** `media`
   - **Public bucket:** ✅ Marque esta opção (para permitir acesso público às imagens)
6. Clique em **"Create bucket"** ou **"Criar"**

## Opção 2: Via SQL Editor

1. Acesse o painel do Supabase
2. Vá em **SQL Editor** no menu lateral
3. Clique em **"New query"** ou **"Nova consulta"**
4. Cole o conteúdo do arquivo `scripts/05-create-storage-bucket.sql`
5. Clique em **"Run"** ou **"Executar"**

## Verificar se funcionou

Depois de criar o bucket, você deve conseguir:
- ✅ Fazer upload de imagens ao criar/editar veículos
- ✅ Ver as imagens nos cards dos veículos
- ✅ Ver a galeria de imagens na página de detalhes
- ✅ Remover imagens ao editar veículos

## Troubleshooting

Se ainda não funcionar:
1. Verifique se o bucket `media` aparece em Storage
2. Confirme que está marcado como "Public"
3. Verifique se as variáveis de ambiente estão corretas no arquivo `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

