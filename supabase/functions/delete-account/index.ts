import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.1";

const documentsBucket = "medical-documents";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return send(405, { message: "This account action is not available." });
  }

  try {
    const token = authToken(req);
    if (!token) {
      return send(401, { message: "Please sign in again before deleting your account." });
    }

    const supabaseUrl = requiredEnv("SUPABASE_URL");
    const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return send(401, { message: "Please sign in again before deleting your account." });
    }

    const userId = userData.user.id;
    await deleteUserFiles(supabase, userId);

    await supabase.from("medical_documents").delete().eq("user_id", userId);
    await supabase.from("wellness_records").delete().eq("user_id", userId);

    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteUserError) {
      console.error(JSON.stringify({ event: "delete_account_failed", stage: "auth_delete", userId, error: deleteUserError.message }));
      return send(500, { message: "Your saved data was removed, but the account could not be fully deleted. Please contact support." });
    }

    console.log(JSON.stringify({ event: "delete_account_complete", userId }));
    return send(200, { message: "Your account and saved data were deleted." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Your account could not be deleted. Please try again.";
    console.error(JSON.stringify({ event: "delete_account_failed", stage: "unexpected", error: message }));
    return send(500, { message: "Your account could not be deleted. Please try again." });
  }
});

async function deleteUserFiles(supabase: ReturnType<typeof createClient>, userId: string) {
  const paths: string[] = [];
  const folders = [userId];

  while (folders.length) {
    const folder = folders.pop();
    if (!folder) continue;

    const { data, error } = await supabase.storage.from(documentsBucket).list(folder, {
      limit: 1000,
      sortBy: { column: "name", order: "asc" }
    });

    if (error) {
      console.warn(JSON.stringify({ event: "delete_account_storage_list_failed", folder, error: error.message }));
      continue;
    }

    for (const item of data || []) {
      const path = `${folder}/${item.name}`;
      if (item.id) {
        paths.push(path);
      } else {
        folders.push(path);
      }
    }
  }

  for (let index = 0; index < paths.length; index += 100) {
    const batch = paths.slice(index, index + 100);
    const { error } = await supabase.storage.from(documentsBucket).remove(batch);
    if (error) {
      console.warn(JSON.stringify({ event: "delete_account_storage_remove_failed", count: batch.length, error: error.message }));
    }
  }
}

function authToken(req: Request) {
  const header = req.headers.get("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function send(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
