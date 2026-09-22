# Banco de dados GLM

## Ativar a conexão

1. No Supabase, execute `schema.sql` uma vez em um projeto sem essas tabelas. **Se já executou, pule esta etapa.**
2. Execute `access.sql` no **SQL Editor** para liberar o envio de agendamentos e configurar as permissões da equipe.
3. Em **Authentication → Users → Add user**, crie o usuário da equipe com e-mail e senha e confirme o e-mail.
4. Em `authorize-operator.sql`, substitua `SUBSTITUA_PELO_EMAIL_DA_EQUIPE` pelo e-mail criado e execute no SQL Editor.
5. O `.env` deve ter `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Reinicie o servidor após alterar essas variáveis. Em hospedagem, configure as mesmas variáveis e faça novo build.
6. Acesse `/voucher` e entre com o e-mail e a senha da equipe. Agendamentos em `/agendamento` não exigem login.

A chave pública não permite executar esses scripts administrativos. Não é necessário colocar a senha do banco nem uma chave `service_role` no site.

- `bookings`: solicitações de agendamento, com todos os campos de `BookingRequest`.
- `vouchers`: dados necessários para gerar novamente o PDF, incluindo valor base e forma de pagamento. O PDF em si não é armazenado.
- `vouchers.booking_id`: vínculo opcional com um agendamento. Vouchers manuais podem usar `null`.
- Não há coluna `route`: a descrição é montada com serviço, origem, destino e dados operacionais.

## Conversão dos dados do site

Os campos mantêm os nomes atuais, exceto:

| Campo no site | Coluna no banco |
| --- | --- |
| `createdAt` | `bookings.created_at` |
| `issuedAt` | `vouchers.issued_at` |
| `arrivalTime` | `vouchers.arrival_time` |
| `savedAt` | `vouchers.saved_at` |

`passengers` deve ser enviado como inteiro. Datas usam `YYYY-MM-DD`. Horários opcionais vazios devem virar `null`; ao ler, converter `null` para `""` e horários para `HH:mm`.

`price` é o valor base em reais: `"1.200,00"` no formulário vira `1200.00` no banco. Usar o equivalente a `priceInCents(price) / 100` ao gravar e formatar novamente em pt-BR ao ler. Não salvar o total com acréscimo nesse campo: o PDF já soma R$ 10,00 por passageiro quando o pagamento é `Crédito`.

Em novos agendamentos, omitir `code` e deixar o banco gerar `GML-0001`, `GML-0002` etc. Omitir também `id` e `created_at` para usar os padrões. Ao criar um voucher de um agendamento, copiar seu código e informar `booking_id`. Vouchers manuais exigem um código único. Ao atualizar um voucher por código (`upsert`), enviar também `saved_at` atualizado.

## Como o site usa o banco

`BookingForm` envia os agendamentos diretamente ao Supabase e só confirma o envio depois da gravação. IDs, códigos e datas de criação são gerados no banco. A inserção pública não solicita a leitura do registro criado.

`VoucherGenerator` carrega agendamentos pendentes e vouchers do banco. O botão de atualização busca novos dados; abrir o histórico também atualiza a consulta. Ao gerar um voucher, o site salva o valor base e os demais dados no banco antes de baixar o PDF. Se a gravação falhar, o formulário é preservado e mostra o erro. Salvar um voucher não altera automaticamente o status do agendamento.

A página `/voucher` exige login via Supabase Auth. As políticas RLS verificam `app_metadata.glm_role = operator` também no banco, sem confiar apenas na interface. Um usuário autenticado sem essa permissão não pode consultar dados operacionais. A aplicação não oferece cadastro público de operadores. O SDK mantém a sessão de autenticação no navegador; os agendamentos e vouchers são armazenados no banco.

Referência: [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Dados que já estão no navegador

Executar o SQL não importa os dados existentes. Exportar `glm-booking-requests` e `glm-saved-vouchers` de cada navegador que contém registros, converter os campos acima e importar primeiro os agendamentos, depois os vouchers. Descartar o antigo campo opcional `route`.

Revisar códigos repetidos entre navegadores antes da importação: cada navegador mantinha sua própria numeração. Associar `booking_id` apenas quando o vínculo for confirmado. Depois de importar os códigos antigos, executar o ajuste abaixo para que os novos códigos não colidam com os existentes nas duas tabelas:

```sql
select setval(
  'public.booking_code_seq',
  greatest(
    (select last_value from public.booking_code_seq),
    coalesce((
      select max(substring(code from '^GML-([0-9]+)$')::bigint)
      from (
        select code from public.bookings
        union all
        select code from public.vouchers
      ) as existing_codes
    ), 0) + 1
  ),
  false
);
```

Fazer esse ajuste sem novas gravações concorrentes durante a importação.
