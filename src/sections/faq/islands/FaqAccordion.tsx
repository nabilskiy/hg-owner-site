import * as Accordion from '@radix-ui/react-accordion';

export interface FaqEntry {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: readonly FaqEntry[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Accordion.Root type="single" collapsible defaultValue="faq-0" className="flex flex-col gap-3">
      {items.map((item, index) => (
        <Accordion.Item
          key={item.q}
          value={`faq-${index}`}
          className="ring-line rounded-lg bg-white ring-1"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex min-h-11 w-full items-center justify-between px-4 py-3 text-start text-lg font-semibold">
              {item.q}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="text-muted px-4 pb-4">{item.a}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
