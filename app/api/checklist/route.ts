import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return Response.json([], { status: 401 });

  const { data } = await supabase
    .from("checklist")
    .select("done")
    .eq("user_email", session.user.email)
    .single();

  return Response.json(data?.done ?? []);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({}, { status: 401 });

  const done = await req.json();

  await supabase.from("checklist").upsert(
    { user_email: session.user.email, done },
    { onConflict: "user_email" },
  );

  return Response.json({ ok: true });
}
