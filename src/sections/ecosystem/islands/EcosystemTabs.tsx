import * as Tabs from '@radix-ui/react-tabs';

export interface EcosystemTab {
  id: string;
  label: string;
  title: string;
  body: string;
  points: readonly string[];
  cta: string;
  ctaHref: string;
}

export default function EcosystemTabs({
  label,
  tabs,
}: {
  label: string;
  tabs: readonly EcosystemTab[];
}) {
  const first = tabs[0]?.id ?? 'sell';

  return (
    <Tabs.Root defaultValue={first}>
      <Tabs.List aria-label={label} className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.id}
            value={tab.id}
            className="rounded-pill ring-line data-[state=active]:bg-navy inline-flex min-h-11 shrink-0 items-center px-4 text-sm font-semibold ring-1 data-[state=active]:text-white"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content key={tab.id} value={tab.id} className="mt-6">
          <h3 className="text-2xl font-semibold">{tab.title || tab.label}</h3>
          {tab.body ? <p className="text-muted mt-3 max-w-3xl">{tab.body}</p> : null}
          {tab.points.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2">
              {tab.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : null}
          {tab.cta ? (
            <a
              className="rounded-pill bg-primary mt-6 inline-flex min-h-11 items-center px-5 text-lg font-semibold text-white"
              href={tab.ctaHref}
            >
              {tab.cta}
            </a>
          ) : null}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
