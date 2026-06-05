import { createContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyIframe from "@daily-co/daily-js";
import { apiClient } from "../api/apiClient.js";
import useApi from "../hooks/useApi.js";

const ContextoVideollamada = createContext(null);

const ProveedorVideollamada = ({ children }) => {
  const URL_SALA_DAILY = import.meta.env.VITE_DAILY_ROOM_URL;
  const DURACION_LLAMADA_SEGUNDOS = 120;
  const modalInicial = { visible: false, idLlamada: null, accion: null };

  //Aquí tenemos los estados (hacen que la UI cambie visualmente)
  const [avisoCamara, setAvisoCamara] = useState(false);
  const [colgando, setColgando] = useState(false);
  const [modal, setModal] = useState(modalInicial);
  const [tiempoRestante, setTiempoRestante] = useState(DURACION_LLAMADA_SEGUNDOS);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);
  const [otroUsuario, setOtroUsuario] = useState(null);

  //Aquí tenemos las referencias (No provocan que cambie la UI)
  const frameRef = useRef(null); //Guarda la instancia del reproductor de video (Daily)
  const intervaloTemporizadorRef = useRef(null);
  const idLlamadaRef = useRef(null);
  const tiempoRestanteRef = useRef(DURACION_LLAMADA_SEGUNDOS); //Está sincronizado con el estado para que setInterval lea le valor actual

  const { ejecutar } = useApi();
  const navegar = useNavigate();

  //CONTROL DEL TIEMPO
  const detenerTemporizador = () => {
    if (intervaloTemporizadorRef.current) {
      clearInterval(intervaloTemporizadorRef.current);
      intervaloTemporizadorRef.current = null;
    }
    setTemporizadorActivo(false);
  };

  const iniciarTemporizador = () => {
    if (intervaloTemporizadorRef.current) return;//Evita arrancar dos temporizadores a la vez
    setTemporizadorActivo(true);

    intervaloTemporizadorRef.current = setInterval(() => {
      setTiempoRestante((segundos) => {
        //Si el tiempo se acaba, paramos el reloj y forzamos el modal de salida
        if (segundos <= 1) {
          clearInterval(intervaloTemporizadorRef.current);
          intervaloTemporizadorRef.current = null;
          setTemporizadorActivo(false);
          tiempoRestanteRef.current = 0;
          if (idLlamadaRef.current) {
            setModal({
              visible: true,
              idLlamada: idLlamadaRef.current,
              accion: "salir",
            });
          }
          return 0;
        }
        //Actualizamos tanto la referencua como el estado
        tiempoRestanteRef.current = segundos - 1;
        return segundos - 1;
      });
    }, 1000);//Se ejecuta cada segundo
  };

  //Para meterse en la sala
  const unirseASala = async (contenedor, usuario, idLlamada) => {
    if (!contenedor || frameRef.current) return;//Si ya hay videollamada, no hacemos nada

    //REseteamos a los valores iniciales
    setAvisoCamara(false);
    setOtroUsuario(null);
    setTiempoRestante(DURACION_LLAMADA_SEGUNDOS);
    tiempoRestanteRef.current = DURACION_LLAMADA_SEGUNDOS;
    idLlamadaRef.current = idLlamada;

    //Pedimos al backend los datos de nuestro "Match" para pintar su nombre
    try {
      const datos = await ejecutar(apiClient.get(`/llamadas/${idLlamada}`));
      setOtroUsuario(datos);
    } catch {
      // no bloqueamos la llamada si falla. Preferimos que entre a la cita sin ver el nombre, antes que bloquear
    }

    //Instanciamos el iframe de Daily.co y lo inyectamos en el div 'contenedor'
    const frame = DailyIframe.createFrame(contenedor, {
      iframeStyle: { width: "100%", height: "100%", border: "none" },
      showLeaveButton: false,
      showFullscreenButton: false,
    });
    frameRef.current = frame;

    //Listeners: para escuchar eventos de la videollamada
    frame.on("camera-error", () => setAvisoCamara(true));
    frame.on("participant-joined", iniciarTemporizador);
    frame.on("joined-meeting", (evento) => {
      //Aquí se revisa si el otro usuario ya estab dentro, al entrar nosotros
      const otros = Object.values(evento?.participants ?? {}).filter(
        (p) => !p.local,
      );
      if (otros.length > 0) iniciarTemporizador();
    });

    frame.on("participant-left", (evento) => {
      //Si el otro usuario se va, paramos el reloj y sacamos el modal para avanzar
      if (evento?.participant?.local) return;
      detenerTemporizador();
      setModal((actual) => {
        if (actual.visible || !idLlamadaRef.current) return actual;
        return {
          visible: true,
          idLlamada: idLlamadaRef.current,
          accion: "siguiente",
        };
      });
    });
    //Finalmente nos conectamos a la URL proporcionada
    frame
      .join({ url: URL_SALA_DAILY, userName: usuario?.username })
      .catch(() => setAvisoCamara(true));
  };

  //Limpieza y cierre
  const destruirFrame = async () => {
    detenerTemporizador();
    if (!frameRef.current) return;
    //salimos de la sala y destruimos el iframe
    await frameRef.current.leave().catch(() => {});
    frameRef.current.destroy();
    frameRef.current = null;
  };

  const salir = async () => {
    await destruirFrame();
  };

  const finalizarYNavegar = async (idLlamada, destino) => {
    setColgando(true);
    try {
      await destruirFrame();
      //calculamos cuanto duró la cita restando el tiempo restante del total
      const duracion = DURACION_LLAMADA_SEGUNDOS - tiempoRestanteRef.current;
      //Avisamos al backend de que la llamada ha terminado y lo que ha durado
      await ejecutar(
        apiClient.put(`/llamadas/finalizar/${idLlamada}`, {
          duracion,
          estado: "COMPLETADA",
        }),
      );
    } catch {
      // seguimos navegando para no dejar al usuario atrapado
    } finally {
      navegar(destino);
      setColgando(false);
    }
  };

  const pedirMatch = (idLlamada, accion) => {
    detenerTemporizador();
    setModal({ visible: true, idLlamada, accion }); // Cerramos el modal
  };

  const responderMatch = async (quiereMatch, accion) => {
    const { idLlamada } = modal;
    setModal(modalInicial);

    try {
      await ejecutar(
        apiClient.put(`/voto/${idLlamada}`, {
          voto: quiereMatch ? "LIKE" : "NEXT",
        }),
      );
    } catch (err) {
      console.error("[VOTO] Error al registrar voto:", err?.response?.data ?? err?.message);
    }
    const destino = accion === "siguiente" ? "/sala-espera" : "/inicio";
    await finalizarYNavegar(idLlamada, destino);
  };
  
  const enviarReporte = async (callId, acusadoId, motivo) => {
    await ejecutar(apiClient.post("/reportes", { acusadoId, callId, motivo }));
  };

  const datosAProveer = {
    avisoCamara,
    colgando,
    modal,
    tiempoRestante,
    temporizadorActivo,
    otroUsuario,
    unirseASala,
    salir,
    pedirMatch,
    responderMatch,
    enviarReporte,
  };

  return (
    <ContextoVideollamada.Provider value={datosAProveer}>
      {children}
    </ContextoVideollamada.Provider>
  );
};

export default ProveedorVideollamada;
export { ContextoVideollamada };
