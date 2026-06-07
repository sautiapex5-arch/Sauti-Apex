import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ACCOUNTS = [
  {
    email: "admin@sautiapex.test",
    password: "AdminTest123!",
    role: "admin" as const,
    name: "Test Admin",
  },
  {
    email: "client@sautiapex.test",
    password: "ClientTest123!",
    role: "client" as const,
    name: "Test Client",
  },
];

export const seedTestAccounts = createServerFn({ method: "POST" }).handler(async () => {
  for (const acct of ACCOUNTS) {
    // Find existing user
    const { data: list } = await supabaseAdmin.auth.admin.listUsers();
    let user = list?.users.find((u) => u.email === acct.email);

    if (!user) {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: acct.email,
        password: acct.password,
        email_confirm: true,
        user_metadata: { display_name: acct.name },
      });
      if (error) throw new Error(`Create ${acct.email}: ${error.message}`);
      user = created.user!;
    } else {
      // Reset password to known value
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: acct.password,
        email_confirm: true,
      });
    }

    // Ensure role row (handle_new_user assigns 'client' by default; upsert desired role)
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: user.id, role: acct.role }, { onConflict: "user_id,role" });

    // Ensure profile
    await supabaseAdmin
      .from("profiles")
      .upsert(
        { id: user.id, display_name: acct.name, contact_email: acct.email },
        { onConflict: "id" },
      );
  }

  return {
    ok: true,
    accounts: ACCOUNTS.map(({ email, password, role }) => ({ email, password, role })),
  };
});
