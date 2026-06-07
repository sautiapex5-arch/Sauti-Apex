import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function HubTabs({
  defaultValue,
  tabs,
}: {
  defaultValue: string;
  tabs: { value: string; label: string; content: ReactNode }[];
}) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="mb-6">
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.value} value={t.value}>
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
