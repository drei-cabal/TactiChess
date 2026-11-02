export function DatasetStatus({ state, headingId }) {
  const failed = state.status === 'error';

  return (
    <section className="panel empty dataset-status">
      <div role={failed ? 'alert' : 'status'}>
        <h1 id={headingId} className="page-heading">
          {failed ? 'Unable to load the dataset' : 'Loading TactiChess…'}
        </h1>
        <p>{failed ? state.message : 'Loading the frozen training rules and puzzle exports.'}</p>
      </div>
      {failed && (
        <button type="button" className="primary" onClick={() => window.location.reload()}>
          Reload page
        </button>
      )}
    </section>
  );
}
