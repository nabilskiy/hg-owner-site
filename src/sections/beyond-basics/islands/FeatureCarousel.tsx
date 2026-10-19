import useEmblaCarousel from 'embla-carousel-react';

export interface FeatureCard {
  title: string;
  body: string;
  points: readonly string[];
}

interface Props {
  label: string;
  previousLabel: string;
  nextLabel: string;
  cards: readonly FeatureCard[];
}

export default function FeatureCarousel({ label, previousLabel, nextLabel, cards }: Props) {
  const [ref, api] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          className="rounded-pill ring-navy inline-flex min-h-11 items-center px-4 text-sm font-semibold ring-1"
          onClick={() => api?.scrollPrev()}
        >
          {previousLabel}
        </button>
        <button
          type="button"
          className="rounded-pill ring-navy inline-flex min-h-11 items-center px-4 text-sm font-semibold ring-1"
          onClick={() => api?.scrollNext()}
        >
          {nextLabel}
        </button>
      </div>
      <div className="overflow-hidden" ref={ref} aria-label={label}>
        <ul className="flex">
          {cards.map((card) => (
            <li
              key={card.title}
              className="min-w-0 shrink-0 grow-0 basis-[85%] pr-4 md:basis-1/2 lg:basis-1/3"
            >
              <article className="bg-navy h-full rounded-lg p-6 text-white">
                <h3 className="text-xl font-semibold">{card.title}</h3>
                {card.body ? <p className="mt-3 text-white/90">{card.body}</p> : null}
                {card.points.length > 0 ? (
                  <ul className="mt-4 flex flex-col gap-1 text-sm">
                    {card.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
