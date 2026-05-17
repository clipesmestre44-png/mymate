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
  await supabase.from("transactions").insert({
    id: body.id,
    user_email: session.user.email,
    name: body.name,
    amount: body.amount,
    category: body.category,
    account_id: body.accountId,
    date: body.date,
    tags: body.tags ?? [],
  });

  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({}, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await supabase
    .from("transactions")
    .delete()
    .eq("id", id!)
    .eq("user_email", session.user.email);

  return Response.json({ ok: true });
}
