export default function HomePage() {
  return (
    <div className="card max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Panel de Administración
      </h1>

      <p className="text-gray-600 mb-6">
        Selecciona una opción del menú para administrar torneos,
        jugadores y pagos.
      </p>

      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Gestionar torneos y cuotas</li>
        <li>Registrar jugadores</li>
        <li>Controlar pagos e inscripciones</li>
      </ul>
    </div>
  );
}
