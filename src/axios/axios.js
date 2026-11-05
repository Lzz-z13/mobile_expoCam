import axios from "axios";

const api = axios.create({
  baseURL: "https://io.adafruit.com/api/v2/Luizzz3/feeds/",
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
    "X-AIO-Key": "aio_vyNg65sXKI8jRajXExIWKwH5Mox6",
  },
});

const sheets = {
  toggleLed: (stateLed) => api.post("botaoled/data", stateLed),
  getLED: () => api.get("botaoled/data/last"),

  // Altera o estado do alarme
  setAlarme: (valor) =>
    api.post("botao/data", {
      value: String(valor),
    }),

  // Consulta o último estado do alarme
  getAlarme: () => api.get("botao/data/last"),

  // Consulta a última distância
  getDistancia: () => api.get("distanciaultrassom/data/last"),

  // Consulta o limite atual
  getLimite: () => api.get("limitealarme/data/last"),

  // Altera o limite
  setLimite: (valor) =>
    api.post("limitealarme/data", {
      value: String(valor),
    }),

  // Consulta situação de intrusão
  getIntrusao: () => api.get("intrusao/data/last"),
};

export default sheets;
