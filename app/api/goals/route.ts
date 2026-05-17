import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return Response.json([], { status: 401 });

  const { data } = await supabase
    .from("goals")
    .select("*")
    .eq("user_email", session.user.email);

  return Response.json(
    (data ?? []).map((g) => ({
      id: g.id,
      label: g.label,
      target: Number(g.target),
      current: Number(g.current),
      color: g.color,
    })),
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({}, { status: 401 });

  const body = await req.json();
  await supabase.from("goals").insert({
    id: body.id,
    user_email: session.user.email,
    label: body.label,
    target: body.target,
    current: body.current,
    color: body.color,
  });

  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({}, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await supabase
    .from("goals")
    .delete()
    .eq("id", id!)
    .eq("user_email", session.user.email);

  return Response.json({ ok: true });
}
