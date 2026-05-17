import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return Response.json([], { status: 401 });

  const { data } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_email", session.user.email)
    .order("created_at");

  const accounts = (data ?? []).map((a) => ({
    id: a.id,
    name: a.name,
    institution: a.institution,
    type: a.type,
    balance: Number(a.balance),
    currency: a.currency,
    number: a.number,
    createdAt: a.created_at,
  }));

  return Response.json(accounts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({}, { status: 401 });

  const body = await req.json();
  await supabase.from("accounts").insert({
    id: body.id,
    user_email: session.user.email,
    name: body.name,
    institution: body.institution,
    type: body.type,
    balance: body.balance,
    currency: body.currency,
    number: body.number,
    created_at: body.createdAt,
  });

  return Response.json({ ok: true });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({}, { status: 401 });

  const { id, balance } = await req.json();
  await supabase
    .from("accounts")
    .update({ balance })
    .eq("id", id)
    .eq("user_email", session.user.email);

  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({}, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await supabase
    .from("accounts")
    .delete()
    .eq("id", id!)
    .eq("user_email", session.user.email);

  return Response.json({ ok: true });
}
