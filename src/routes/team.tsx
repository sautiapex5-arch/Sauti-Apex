import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Crown, ExternalLink, Mail } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team — SautiApex" },
      {
        name: "description",
        content: "Meet the consultants, project managers, and specialists behind SautiApex.",
      },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["public-team"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("is_ceo", { ascending: false })
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <SiteLayout>
      <PageHeader
        kicker="Our People"
        title="The team behind SautiApex"
        subtitle="Senior consultants, project managers, and sector specialists committed to your transformation."
      />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {isLoading ? (
          <p className="text-muted-foreground">Loading team…</p>
        ) : members.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            Our team profiles are being prepared. Check back shortly.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <article
                key={m.id}
                className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="aspect-[4/3] bg-brand-navy/5 overflow-hidden">
                  {m.photo_url ? (
                    <img
                      src={m.photo_url}
                      alt={m.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-serif text-brand-navy/30">
                      {m.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    {m.is_ceo && <Crown size={16} className="text-brand-gold-deep" />}
                    <h3 className="font-serif text-xl text-brand-navy">{m.full_name}</h3>
                  </div>
                  {m.title && (
                    <p className="text-sm text-brand-gold-deep font-medium mt-0.5">{m.title}</p>
                  )}
                  {m.bio && (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
                  )}
                  <div className="mt-4 flex gap-3 text-muted-foreground">
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="hover:text-brand-navy">
                        <Mail size={16} />
                      </a>
                    )}
                    {m.linkedin_url && (
                      <a
                        href={m.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-brand-navy"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
