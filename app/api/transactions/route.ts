import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return Response.json([], { status: 401 });

  const { data } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_email", session.user.email)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  const transactions = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    amount: Number(t.amount),
    category: t.category,
    accountId: t.account_id,
    date: t.date,
    tags: t.tags ?? [],
  }));

  return Response.json(transactions);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({}, { status: 401 });

  const body = await req.json();
  const { error } = await supabase.from("transactions").insert({
    id: body.id,
    user_email: session.user.email,
    name: body.name,
    amount: body.amount,
    category: body.category,
    account_id: body.accountId,
    date: body.date,
    tags: body.tags ?? [],
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Update account balance
  if (body.accountId) {
    const { data: account } = await supabase
      .from("accounts")
      .select("balance")
      .eq("id", body.accountId)
      .eq("user_email", session.user.email)
      .single();

    if (account) {
      await supabase
        .from("accounts")
        .update({ balance: Number(account.balance) + Number(body.amount) })
        .eq("id", body.accountId)
        .eq("user_email", session.user.email);
    }
  }

  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({}, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // Fetch transaction before deleting to reverse the balance
  const { data: txn } = await supabase
    .from("transactions")
    .select("amount, account_id")
    .eq("id", id!)
    .eq("user_email", session.user.email)
    .single();

  await supabase
    .from("transactions")
    .delete()
    .eq("id", id!)
    .eq("user_email", session.user.email);

  // Reverse the balance change on the account
  if (txn?.account_id) {
    const { data: account } = await supabase
      .from("accounts")
      .select("balance")
      .eq("id", txn.account_id)
      .eq("user_email", session.user.email)
      .single();

    if (account) {
      await supabase
        .from("accounts")
        .update({ balance: Number(account.balance) - Number(txn.amount) })
        .eq("id", txn.account_id)
        .eq("user_email", session.user.email);
    }
  }

  return Response.json({ ok: true });
}
