import { useEffect, useState } from "react";

import { View, Text, Button } from "react-native";

import { useNavigation } from "@react-navigation/native";

import api from "./axios/axios";

const HomeScreen = () => {
  // Estado atual do alarme
  const [alarmeAtivo, setAlarmeAtivo] = useState(false);

  // Última distância conhecida
  const [distancia, setDistancia] = useState(0);

  const [limite, setLimite] = useState(15);

  const [intrusao, setIntrusao] = useState(false);

  const navigation = useNavigation();

  // ------------------------------------------------
  // CAMERA
  // ------------------------------------------------

  const handleCam = () => {
    navigation.navigate("Cam");
  };

  // ------------------------------------------------
  // CONSULTAR ADAFRUIT IO
  // ------------------------------------------------

  async function atualizarDados() {
    const consultas = [
      {
        nome: "Alarme",
        executar: api.getAlarme,
        atualizar: (valor) => {
          setAlarmeAtivo(String(valor).trim().toLowerCase() === "true");
        },
      },
      {
        nome: "Distância",
        executar: api.getDistancia,
        atualizar: (valor) => {
          const numero = Number(valor);
          if (Number.isFinite(numero)) {
            setDistancia(numero);
          }
        },
      },
      {
        nome: "Limite",
        executar: api.getLimite,
        atualizar: (valor) => {
          const numero = Number(valor);
          if (Number.isFinite(numero)) {
            setLimite(numero);
          }
        },
      },
      {
        nome: "Intrusão",
        executar: api.getIntrusao,
        atualizar: (valor) => {
          setIntrusao(String(valor).trim().toLowerCase() === "true");
        },
      },
    ];

    await Promise.all(
      consultas.map(async ({ nome, executar, atualizar }) => {
        try {
          const resposta = await executar();
          atualizar(resposta.data.value);
        } catch (error) {
          console.log(`Erro ao consultar ${nome}:`, {
            status: error.response?.status,
            endpoint: error.config?.url,
            resposta: error.response?.data,
          });
        }
      }),
    );
  }

  // ------------------------------------------------
  // POLLING
  // ------------------------------------------------

  useEffect(() => {
    // Atualiza assim que
    // a tela for aberta
    atualizarDados();

    // Depois consulta novamente
    // a cada 3 segundos
    const intervalo = setInterval(atualizarDados, 3000);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  // ------------------------------------------------
  // ARMAR / DESARMAR
  // ------------------------------------------------

  async function alternarAlarme() {
    try {
      const novoEstado = !alarmeAtivo;

      await api.setAlarme(novoEstado);

      setAlarmeAtivo(novoEstado);

      if (!novoEstado) {
        setIntrusao(false);
      }
    } catch (error) {
      console.log("Erro ao alterar alarme:", error.message);
      console.log("Endpoint:", error.config?.url);
      console.log("Resposta:", error.response?.data);
    }
  }

  // ------------------------------------------------
  // ESTADO VISUAL
  // ------------------------------------------------

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Sistema de Alarme
      </Text>

      <Text
        style={{
          fontSize: 22,
          marginBottom: 10,
        }}
      >
        {alarmeAtivo ? "ALARME ARMADO" : "ALARME DESARMADO"}
      </Text>

      <Text
        style={{
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        Distância: {distancia} cm
      </Text>

      {intrusao ? (
        <Text
          style={{
            color: "red",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          INTRUSÃO DETECTADA!
        </Text>
      ) : (
        <Text
          style={{
            color: "green",
            fontSize: 20,
          }}
        >
          AMBIENTE SEGURO
        </Text>
      )}

      <View
        style={{
          marginBottom: 20,
        }}
      >
        <Button
          title={alarmeAtivo ? "Desarmar Alarme" : "Armar Alarme"}
          onPress={alternarAlarme}
          color={alarmeAtivo ? "red" : "green"}
        />
      </View>

      <Button title="Abrir Câmera" onPress={handleCam} color="blue" />

      <Text>
        Limite atual:
        {limite} cm
      </Text>

      <Button title="Limite 10 cm" onPress={() => api.setLimite(10)} />

      <Button title="Limite 20 cm" onPress={() => api.setLimite(20)} />

      <Button title="Limite 30 cm" onPress={() => api.setLimite(30)} />
    </View>
  );
};

export default HomeScreen;
