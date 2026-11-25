/**
 * One overview statistic. All values come in as props, calculated in App from
 * the task state, so nothing here is hardcoded.
 */
export default function StatCard({ title, value, icon: Icon, tone, caption, progress }) {
  return (
    <article className={`stat stat--${tone}`}>
      <div className="stat__icon" aria-hidden="true">
        <Icon size={22} />
      </div>
      <div className="stat__body">
        <h3 className="stat__title">{title}</h3>
        <p className="stat__value">{value}</p>
        {caption && <p className="stat__caption">{caption}</p>}
        {typeof progress === 'number' && (
          <div
            className="stat__bar"
            role="progressbar"
            aria-label="Completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </article>
  );
}
