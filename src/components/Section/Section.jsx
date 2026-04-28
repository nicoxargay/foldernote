// Pestaña de una sección. Se pone activa/inactiva según la sección seleccionada.
export default function Section({ nombre, activa, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2 text-sm font-medium rounded-t-md border-t border-x transition-colors
        ${activa
          ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
          : 'bg-amber-200 border-amber-300 text-amber-800 hover:bg-amber-100'
        }
      `}
    >
      {nombre}
    </button>
  )
}
