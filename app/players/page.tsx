import { createPlayer, listActivePlayers, deactivatePlayer } from "@/src/services/player.service";

export default async function PlayersPage() {
  const players = await listActivePlayers();

  return (
    <div className="min-h-screen bg-purple-700">
      {/* Header */}
      <header className="bg-purple-800 text-white px-6 py-4 text-lg font-semibold">
        Storms · Admin
      </header>

      {/* Card */}
      <main className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Jugadores</h1>

        {/* Formulario */}
        <form
          action={async (formData) => {
            "use server";
            const fullName = formData.get("fullName") as string;
            const phone = formData.get("phone") as string;

            if (!fullName) return;

            await createPlayer({
              fullName,
              phone: phone || undefined,
            });
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <input
            name="fullName"
            placeholder="Nombre completo"
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="phone"
            placeholder="Teléfono"
            className="border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white rounded px-4 py-2 hover:bg-purple-700"
          >
            Agregar jugador
          </button>
        </form>

        {/* Tabla */}
        {players.length === 0 ? (
          <p className="text-gray-500">No hay jugadores registrados</p>
        ) : (
          <table className="w-full border-t">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Nombre</th>
                <th className="py-2">Teléfono</th>
                <th className="py-2 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b last:border-b-0">
                  <td className="py-2">{player.fullName}</td>
                  <td className="py-2">{player.phone || "-"}</td>
                  <td className="py-2 text-right">
                    <form
                      action={async () => {
                        "use server";
                        await deactivatePlayer(player.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-sm text-red-600 hover:underline"
                      >
                        Desactivar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
