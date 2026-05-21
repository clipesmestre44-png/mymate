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
  if (!session?.user?.email) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const { error } = await supabase.from("accounts").insert({
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

  if (error) {
    console.error("Supabase insert error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({}, { status: 401 });

  const body = await req.json();

  // Full account update
  const fields: Record<string, unknown> = { balance: body.balance };
  if (body.name       !== undefined) fields.name        = body.name;
  if (body.institution !== undefined) fields.institution = body.institution;
  if (body.type       !== undefined) fields.type        = body.type;
  if (body.currency   !== undefined) fields.currency    = body.currency;
  if (body.number     !== undefined) fields.number      = body.number;

  await supabase
    .from("accounts")
    .update(fields)
    .eq("id", body.id)
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
