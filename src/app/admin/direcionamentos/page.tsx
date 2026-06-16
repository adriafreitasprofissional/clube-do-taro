<a href="/admin/direcionamentos">
  📩 Direcionamentos
</a>
const [mensagens, setMensagens] = useState<any[]>([]);
const [selecionada, setSelecionada] = useState<any>(null);

useEffect(() => {
  carregarMensagens();
}, []);

async function carregarMensagens() {
  const response = await fetch(
    "/api/admin/direcionamentos"
  );

  const data = await response.json();

  setMensagens(data);
}

return (
  <div>
    <h1>📩 Direcionamentos</h1>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "350px 1fr",
        gap: "20px",
      }}
    >
      <div>
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            onClick={() => setSelecionada(msg)}
          >
            <strong>{msg.nome_cliente}</strong>
            <br />
            {msg.categoria}
          </div>
        ))}
      </div>

      <div>
        {selecionada && (
          <>
            <h2>
              {selecionada.nome_cliente}
            </h2>

            <p>
              <strong>Categoria:</strong>
              {selecionada.categoria}
            </p>

            <p>
              {selecionada.pergunta}
            </p>
          </>
        )}
      </div>
    </div>
  </div>
);