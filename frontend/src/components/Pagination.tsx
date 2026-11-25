interface Props {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

// ojo: la api empieza en la pagina 1
function Pagination({ page, totalPages, setPage }: Props) {
  return (
    <div className="flex gap-4 justify-center mt-4">
      <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="border px-3 py-1 rounded disabled:opacity-40">
        Anterior
      </button>
      <span>
        Página {page} de {totalPages}
      </span>
      <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border px-3 py-1 rounded disabled:opacity-40">
        Siguiente
      </button>
    </div>
  );
}

export default Pagination;
