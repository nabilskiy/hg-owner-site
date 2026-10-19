import { useState } from 'react';

export interface PlannerBooking {
  time: string;
  title: string;
  capacity: string;
  person: string;
  status: string;
  statusId: string;
}

export interface PlannerCopy {
  label: string;
  date: string;
  filtersLabel: string;
  filters: readonly string[];
  bookings: readonly PlannerBooking[];
  detailId: string;
  detailTitle: string;
  guestsLabel: string;
  guests: string;
  sourceLabel: string;
  source: string;
  paymentLabel: string;
  payment: string;
  guestLabel: string;
  guest: string;
  checkIn: string;
  appsLabel: string;
  apps: readonly string[];
}

const statusClass: Record<string, string> = {
  confirmed: 'bg-success-soft text-success',
  unpaid: 'bg-warning-soft text-warning',
  needsStaff: 'bg-warning-soft text-warning',
  open: 'bg-info-soft text-info',
};

export default function PlannerMockup({ copy }: { copy: PlannerCopy }) {
  const [filter, setFilter] = useState(0);
  const bookings = copy.bookings.filter((booking) => {
    if (filter === 0) {
      return true;
    }
    if (filter === 1) {
      return booking.statusId !== 'confirmed';
    }
    return booking.statusId === 'confirmed';
  });

  return (
    <div className="bg-surface shadow-card rounded-lg p-4">
      <p className="text-navy text-sm font-semibold">
        {copy.label}
        <span className="text-muted"> · {copy.date}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={copy.filtersLabel}>
        {copy.filters.map((name, index) => (
          <button
            key={name}
            type="button"
            className="rounded-pill ring-line inline-flex min-h-11 items-center bg-white px-4 text-sm font-semibold ring-1"
            aria-pressed={filter === index}
            onClick={() => setFilter(index)}
          >
            {name}
          </button>
        ))}
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        {bookings.map((booking) => (
          <li key={booking.time} className="ring-line rounded-md bg-white p-3 ring-1">
            <p className="text-muted text-sm">{booking.time}</p>
            <p className="font-semibold">{booking.title}</p>
            <p className="text-muted text-sm">
              {booking.capacity} · {booking.person}
            </p>
            <p>
              <span
                className={`rounded-pill inline-flex min-h-8 items-center px-3 text-sm font-semibold ${statusClass[booking.statusId] ?? ''}`}
              >
                {booking.status}
              </span>
            </p>
          </li>
        ))}
      </ul>
      <div className="ring-line mt-4 rounded-md bg-white p-4 ring-1">
        <p className="text-primary text-sm font-semibold">{copy.detailId}</p>
        <p className="text-lg font-semibold">{copy.detailTitle}</p>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-muted">{copy.guestsLabel}</dt>
            <dd>{copy.guests}</dd>
          </div>
          <div>
            <dt className="text-muted">{copy.sourceLabel}</dt>
            <dd>{copy.source}</dd>
          </div>
          <div>
            <dt className="text-muted">{copy.paymentLabel}</dt>
            <dd>{copy.payment}</dd>
          </div>
          <div>
            <dt className="text-muted">{copy.guestLabel}</dt>
            <dd>{copy.guest}</dd>
          </div>
        </dl>
        <p className="rounded-pill bg-navy mt-3 inline-flex min-h-11 items-center px-4 font-semibold text-white">
          {copy.checkIn}
        </p>
      </div>
      <ul className="mt-4 flex gap-2 overflow-x-auto" aria-label={copy.appsLabel}>
        {copy.apps.map((app) => (
          <li
            key={app}
            className="rounded-pill ring-line shrink-0 bg-white px-3 py-2 text-sm font-semibold ring-1"
          >
            {app}
          </li>
        ))}
      </ul>
    </div>
  );
}
