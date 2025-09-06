import React, { useState, useEffect } from "react";
import './App.css'; // se precisar importar CSS
// Importe Bootstrap no index.html ou via npm e import no index.js

const slides = [
  {
    type: "image",
    src: "barnela.jpeg",
    alt: "Descrição da imagem 1",
    backgroundColor: "#FFFFE0",
    height: "1000px",
  },
  {
    type: "text",
    backgroundColor: "#FFFFE0",
    content: (
      <>
        <h2 style={{ color: "dimgray" }}>Sobre a Lista de Presentes</h2>
        <p style={{ color: "dimgray" }}>
          Preparamos uma lista com itens que vão nos ajudar a montar nosso novo lar.
          Sinta-se à vontade para escolher um ou mais presentes que deseja contribuir 💕. Junto com o presente, enviar também um bilhete com uma mensagem para nós, pois fará parte de uma brincadeira que teremos no dia.
        </p>
      </>
    ),
  },
  {
    type: "image",
    src: "palheta.jpg",
    alt: "Descrição da imagem 2",
    backgroundColor: "#FFFFE0",
    height: "1000px",
  },
  {
    type: "custom",
    backgroundColor: "#FFFFE0",
    content: null, // conteúdo especial renderizado no slide custom
  },
];

// ... seu array slides permanece o mesmo

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [section, setSection] = useState("form");
  const [presentes, setPresentes] = useState([]); // vai guardar objetos { id, value, label }
  const [selectedPresentes, setSelectedPresentes] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    async function carregarPresentes() {
      try {
        const corsProxy = "https://api.allorigins.win/raw?url=";
const url = "http://159.65.164.149:8080/pessoas/presentes";

const response = await fetch(`${corsProxy}${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error("Erro ao buscar presentes");
        const presentesHtmlArray = await response.json();

        // Parsear a string HTML para extrair value e label
        const parser = new DOMParser();
        const parsedPresentes = presentesHtmlArray.map((htmlStr) => {
          const doc = parser.parseFromString(htmlStr, "text/html");
          const input = doc.querySelector("input");
          const label = doc.querySelector("label");
          return {
            id: input?.id || Math.random().toString(36).substr(2, 9),
            value: label?.textContent.trim() || "",  // Use label text as value here
            label: label?.textContent || "",
          };
        });
        setPresentes(parsedPresentes);
      } catch (error) {
        console.error("Erro ao carregar presentes:", error);
      }
    }
    carregarPresentes();
  }, []);

  function prevSlide() {
    setCurrentSlide((s) => (s === 0 ? slides.length - 1 : s - 1));
  }

  function nextSlide() {
    setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
  }

  // Lidar com checkbox toggle
  function togglePresente(value) {
    setSelectedPresentes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }

  // Envio do form
  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim() || !telefone.trim()) {
      alert("Por favor, preencha nome e telefone.");
      return;
    }
    if (selectedPresentes.length === 0) {
      alert("Selecione ao menos um presente.");
      return;
    }

    const data = {
      nome,
      telefone,
      presentes: selectedPresentes,
    };

    try {
      const res = await fetch("https://corsproxy.io/?http://159.65.164.149:8080/pessoas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      

      if (res.ok) {
        alert("Presente registrado com sucesso!");
        setNome("");
        setTelefone("");
        setSelectedPresentes([]);
      } else {
        alert("Erro ao enviar o presente.");
      }
    } catch (err) {
      alert("Erro ao enviar o presente.");
      console.error(err);
    }
  }

  return (
    <div className="CSSgal" style={{ color: "#fff", textAlign: "center", position: "relative", height: "100vh" }}>
      {/* Slider */}
      <div
        className="slider"
        style={{
          height: "100%",
          whiteSpace: "nowrap",
          fontSize: 0,
          transition: "0.8s",
          transform: `translateX(-${currentSlide * 100}%)`,
          display: "flex",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              fontSize: "1rem",
              display: "inline-block",
              whiteSpace: "normal",
              verticalAlign: "top",
              height: "100%",
              width: "100%",
              background: slide.backgroundColor,
              flexShrink: 0,
              padding: slide.type === "custom" ? "40px" : 0,
              minHeight: slide.type === "custom" ? "100vh" : undefined,
            }}
          >
            {slide.type === "image" && (
              <img
                src={slide.src}
                alt={slide.alt}
                style={{ maxWidth: "100%", height: slide.height }}
              />
            )}
            {slide.type === "text" && slide.content}
            {slide.type === "custom" && (
              <>
                <div className="text-center mb-5">
                  <button
                    className={`btn btn-outline-dark me-2 ${section === "form" ? "active" : ""}`}
                    onClick={() => setSection("form")}
                  >
                    Presentear com Lista
                  </button>
                  <button
                    className={`btn btn-outline-dark ${section === "pix" ? "active" : ""}`}
                    onClick={() => setSection("pix")}
                  >
                    Presentear com PIX
                  </button>
                </div>

                {section === "form" && (
                  <div id="secao-form" style={{ maxWidth: 600, margin: "auto" }}>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label style={{ color: "dimgray" }} htmlFor="fname" className="form-label">
                          Nome completo
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="fname"
                          name="name"
                          placeholder="Seu nome"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label style={{ color: "dimgray" }} htmlFor="ftel" className="form-label">
                          Telefone
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="ftel"
                          name="tel"
                          placeholder="Digite seu telefone"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3 text-start">
                        <label style={{ color: "dimgray" }} className="form-label">
                          Escolha os presentes
                        </label>
                        <div
                          id="presentes-list"
                          style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #ddd", padding: "10px", borderRadius: "4px", background: "#fff", color: "#000" }}
                        >
                          {presentes.length > 0 ? (
                            presentes.map(({ id, value, label }) => (
                              <div className="form-check" key={id}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={id}
                                  value={value}
                                  checked={selectedPresentes.includes(value)}
                                  onChange={() => togglePresente(value)}
                                />
                                <label className="form-check-label" htmlFor={id}>
                                  {label}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p style={{ color: "gray" }}>Carregando presentes...</p>
                          )}
                        </div>
                      </div>

                      <div className="text-center">
                        <button type="submit" className="btn btn-success px-5">
                          Enviar
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {section === "pix" && (
                  <div
                    id="secao-pix"
                    style={{ maxWidth: 600, margin: "auto", textAlign: "center", color: "dimgray" }}
                  >
                    <h4 className="mb-3">Presentear via PIX</h4>
                    <p>Use a chave PIX abaixo para enviar seu presente 💖</p>

                    <div className="bg-light border rounded p-3 mb-3" style={{ color: "dimgray" }}>
                      <strong>Chave PIX:</strong>
                      <br />
                      <span style={{ fontSize: "1.2rem" }}>alexandramessias00@gmail.com</span>
                    </div>

                    <img src="pix.png" alt="QR Code PIX" style={{ maxWidth: "100%", height: "auto" }} />

                    <p className="mt-3">
                      Por favor, envie seu nome no comprovante para (11) 97364-7021 🙏
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

       {/* Prev/Next */}
      <div
        className="prevNext"
        style={{ position: "absolute", top: "50%", width: "100%", zIndex: 1 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            aria-label="Anterior"
            onClick={prevSlide}
            style={{
              background: "#636260",
              width: 60,
              height: 60,
              lineHeight: "60px",
              textAlign: "center",
              opacity: 0.7,
              borderRadius: "50%",
              border: "none",
              color: "rgba(0,0,0,0.8)",
              cursor: "pointer",
              marginLeft: 10,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            &#10094;
          </button>
          <button
            aria-label="Próximo"
            onClick={nextSlide}
            style={{
              background: "#636260",
              width: 60,
              height: 60,
              lineHeight: "60px",
              textAlign: "center",
              opacity: 0.7,
              borderRadius: "50%",
              border: "none",
              color: "rgba(0,0,0,0.8)",
              cursor: "pointer",
              marginRight: 10,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* Bullets */}
      <div
        className="bullets"
        style={{
          position: "absolute",
          bottom: 0,
          padding: "10px 0",
          width: "100%",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            style={{
              display: "inline-block",
              width: 30,
              height: 30,
              lineHeight: "30px",
              margin: "0 3px",
              borderRadius: "50%",
              border: "none",
              background:
                i === currentSlide
                  ? "rgba(255,255,255,1)"
                  : "rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

