export interface SoundCard {
  title: string;
  detail?: string;
  status?: string;
}

export default function SoundFamiliarCards({ cards }: { cards: readonly SoundCard[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <li key={card.title} className="shadow-card ring-line rounded-lg bg-white p-6 ring-1">
          <h3 className="text-lg font-semibold">{card.title}</h3>
          {card.detail ? <p className="text-muted mt-2">{card.detail}</p> : null}
          {card.status ? <p className="text-primary mt-2 font-semibold">{card.status}</p> : null}
        </li>
      ))}
    </ul>
  );
}
