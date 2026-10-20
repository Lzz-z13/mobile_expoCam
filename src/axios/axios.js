import axios from "axios";

const api = axios.create({
  baseURL: "https://io.adafruit.com/api/v2/Luizzz3//feeds/",
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
    "X-AIO-Key": "aio_BZHB728YEMSUFiNrOjCRSmLzdr68",
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
};

export default sheets;
