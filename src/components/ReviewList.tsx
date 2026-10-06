import { Stars } from "./Stars";

export interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  client: { name: string };
}

export function ReviewList({ reviews }: { reviews: ReviewData[] }) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        No reviews yet — be the first to share your experience.
      </p>
    );
  }
  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li
          key={r.id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {r.client.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {r.client.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Stars rating={r.rating} size={14} />
              <span className="text-xs text-slate-400">
                {new Date(r.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          {r.comment && (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {r.comment}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
