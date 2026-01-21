const { useState, useEffect } = React;
const { Shuffle, TrendingUp, BarChart3, Calendar, Clock, Trophy, Plus, Save, Trash2, Sparkles, Target, History } = lucide;

const animalitos = [
  { numero: '00', nombre: 'Delfín', color: 'bg-blue-500' },
  { numero: '01', nombre: 'Carnero', color: 'bg-amber-600' },
  { numero: '02', nombre: 'Toro', color: 'bg-red-700' },
  { numero: '03', nombre: 'Ciempiés', color: 'bg-gray-600' },
  { numero: '04', nombre: 'Alacrán', color: 'bg-yellow-600' },
  { numero: '05', nombre: 'León', color: 'bg-orange-500' },
  { numero: '06', nombre: 'Rana', color: 'bg-green-600' },
  { numero: '07', nombre: 'Perico', color: 'bg-green-500' },
  { numero: '08', nombre: 'Ratón', color: 'bg-gray-500' },
  { numero: '09', nombre: 'Águila', color: 'bg-yellow-700' },
  { numero: '10', nombre: 'Tigre', color: 'bg-orange-600' },
  { numero: '11', nombre: 'Gato', color: 'bg-gray-700' },
  { numero: '12', nombre: 'Caballo', color: 'bg-amber-700' },
  { numero: '13', nombre: 'Mono', color: 'bg-amber-500' },
  { numero: '14', nombre: 'Paloma', color: 'bg-gray-400' },
  { numero: '15', nombre: 'Zorro', color: 'bg-orange-700' },
  { numero: '16', nombre: 'Oso', color: 'bg-amber-800' },
  { numero: '17', nombre: 'Pavo', color: 'bg-red-600' },
  { numero: '18', nombre: 'Burro', color: 'bg-gray-600' },
  { numero: '19', nombre: 'Chivo', color: 'bg-amber-600' },
  { numero: '20', nombre: 'Cochino', color: 'bg-pink-400' },
  { numero: '21', nombre: 'Gallo', color: 'bg-red-500' },
  { numero: '22', nombre: 'Camello', color: 'bg-yellow-600' },
  { numero: '23', nombre: 'Cebra', color: 'bg-gray-800' },
  { numero: '24', nombre: 'Iguana', color: 'bg-green-700' },
  { numero: '25', nombre: 'Gallina', color: 'bg-red-400' },
  { numero: '26', nombre: 'Vaca', color: 'bg-amber-500' },
  { numero: '27', nombre: 'Perro', color: 'bg-amber-700' },
  { numero: '28', nombre: 'Zamuro', color: 'bg-gray-900' },
  { numero: '29', nombre: 'Elefante', color: 'bg-gray-600' },
  { numero: '30', nombre: 'Caimán', color: 'bg-green-800' },
  { numero: '31', nombre: 'Lapa', color: 'bg-blue-600' },
  { numero: '32', nombre: 'Ardilla', color: 'bg-orange-400' },
  { numero: '33', nombre: 'Pescado', color: 'bg-blue-400' },
  { numero: '34', nombre: 'Venado', color: 'bg-amber-600' },
  { numero: '35', nombre: 'Jirafa', color: 'bg-yellow-500' },
  { numero: '36', nombre: 'Culebra', color: 'bg-green-600' }
];

const horariosLottoactivo = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
];

const horariosGranjita = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
];

// Implementación simple de storage usando localStorage
if (!window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value };
    },
    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true };
    }
  };
}

function PronosticosAnimalitos() {
  const [cantidadJugar, setCantidadJugar] = useState(5);
  const [pronosticos, setPronosticos] = useState([]);
  const [sorteo, setSorteo] = useState('lottoactivo');
  const [vistaActual, setVistaActual] = useState('pronosticos');
  const [resultados, setResultados] = useState([]);
  const [nuevoResultado, setNuevoResultado] = useState({
    fecha: new Date().toISOString().split('T')[0],
    sorteo: 'lottoactivo',
    horario: '08:00 AM',
    numero: '00'
  });
  const [periodoEstadistica, setPeriodoEstadistica] = useState('mes');
  const [fechaBusqueda, setFechaBusqueda] = useState('');

  useEffect(() => {
    cargarResultados();
  }, []);

  const cargarResultados = async () => {
    try {
      const data = await window.storage.get('resultados-animalitos');
      if (data) {
        setResultados(JSON.parse(data.value));
      }
    } catch (error) {
      console.log('No hay resultados guardados aún');
    }
  };

  const guardarResultados = async (nuevosResultados) => {
    try {
      await window.storage.set('resultados-animalitos', JSON.stringify(nuevosResultados));
      setResultados(nuevosResultados);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const agregarResultado = () => {
    const resultado = {
      ...nuevoResultado,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    const nuevosResultados = [...resultados, resultado];
    guardarResultados(nuevosResultados);
    
    setNuevoResultado({
      ...nuevoResultado,
      numero: '00'
    });
  };

  const eliminarResultado = (id) => {
    const nuevosResultados = resultados.filter(r => r.id !== id);
    guardarResultados(nuevosResultados);
  };

  const generarPronosticos = () => {
    const shuffled = [...animalitos].sort(() => Math.random() - 0.5);
    setPronosticos(shuffled.slice(0, cantidadJugar));
  };

  const generarPrediccion = () => {
    const stats = calcularEstadisticas();
    
    const ultimosResultados = obtenerResultadosFiltrados().slice(-20);
    
    const predicciones = stats.map(animal => {
      let peso = 0;
      
      peso += parseFloat(animal.porcentaje) * 0.4;
      
      const aparicionesRecientes = ultimosResultados.slice(-10).filter(r => r.numero === animal.numero).length;
      peso += (aparicionesRecientes / 10) * 100 * 0.3;
      
      const promedioEsperado = 100 / 37;
      const diferencia = promedioEsperado - parseFloat(animal.porcentaje);
      if (diferencia > 0) {
        peso += Math.abs(diferencia) * 2 * 0.3;
      }
      
      return {
        ...animal,
        pesoPrediccion: peso,
        aparicionesRecientes
      };
    });
    
    return predicciones.sort((a, b) => b.pesoPrediccion - a.pesoPrediccion);
  };

  const obtenerResultadosFiltrados = () => {
    const ahora = new Date();
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    
    return resultados.filter(r => {
      const fechaResultado = new Date(r.fecha);
      
      if (periodoEstadistica === 'dia') {
        return fechaResultado >= hoy;
      } else if (periodoEstadistica === 'semana') {
        const unaSemanaAtras = new Date(hoy);
        unaSemanaAtras.setDate(hoy.getDate() - 7);
        return fechaResultado >= unaSemanaAtras;
      } else {
        const unMesAtras = new Date(hoy);
        unMesAtras.setMonth(hoy.getMonth() - 1);
        return fechaResultado >= unMesAtras;
      }
    });
  };

  const calcularEstadisticas = () => {
    const filtrados = obtenerResultadosFiltrados();
    const stats = {};
    
    animalitos.forEach(animal => {
      stats[animal.numero] = {
        ...animal,
        veces: 0,
        porcentaje: 0
      };
    });

    filtrados.forEach(resultado => {
      if (stats[resultado.numero]) {
        stats[resultado.numero].veces++;
      }
    });

    const total = filtrados.length;
    Object.keys(stats).forEach(key => {
      stats[key].porcentaje = total > 0 ? ((stats[key].veces / total) * 100).toFixed(2) : 0;
    });

    return Object.values(stats);
  };

  const getTopAnimalitos = () => {
    return calcularEstadisticas()
      .sort((a, b) => b.veces - a.veces)
      .slice(0, 10);
  };

  const getMenosFrequentes = () => {
    return calcularEstadisticas()
      .sort((a, b) => a.veces - b.veces)
      .slice(0, 10);
  };

  const obtenerResultadosHoy = () => {
    const hoy = new Date().toISOString().split('T')[0];
    return resultados.filter(r => r.fecha === hoy && r.sorteo === sorteo);
  };

  const getPeriodoTexto = () => {
    if (periodoEstadistica === 'dia') return 'Hoy';
    if (periodoEstadistica === 'semana') return 'Última Semana';
    return 'Último Mes';
  };

  return React.createElement('div', { className: "min-h-screen bg-gradient-to-br from-green-600 to-blue-700 p-4" },
    React.createElement('div', { className: "max-w-4xl mx-auto" },
      React.createElement('div', { className: "bg-white rounded-2xl shadow-2xl p-6 mb-6" },
        React.createElement('div', { className: "text-center mb-6" },
          React.createElement('h1', { className: "text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2" },
            React.createElement(TrendingUp, { className: "text-green-600", size: 32 }),
            'Pronósticos Animalitos'
          ),
          React.createElement('p', { className: "text-gray-600" }, 'Registra resultados y analiza estadísticas')
        ),
        
        // Navegación
        React.createElement('div', { className: "grid grid-cols-6 gap-2 mb-6" },
          React.createElement('button', {
            onClick: () => setVistaActual('pronosticos'),
            className: `py-3 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 text-xs ${vistaActual === 'pronosticos' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          },
            React.createElement(Shuffle, { size: 16 }),
            'Pronósticos'
          ),
          React.createElement('button', {
            onClick: () => setVistaActual('recomendacion'),
            className: `py-3 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 text-xs ${vistaActual === 'recomendacion' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          },
            React.createElement(TrendingUp, { size: 16 }),
            'IA'
          ),
          React.createElement('button', {
            onClick: () => setVistaActual('agregar'),
            className: `py-3 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 text-xs ${vistaActual === 'agregar' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          },
            React.createElement(Plus, { size: 16 }),
            'Agregar'
          ),
          React.createElement('button', {
            onClick: () => setVistaActual('historico'),
            className: `py-3 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 text-xs ${vistaActual === 'historico' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          },
            React.createElement(History, { size: 16 }),
            'Histórico'
          ),
          React.createElement('button', {
            onClick: () => setVistaActual('resultados'),
            className: `py-3 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 text-xs ${vistaActual === 'resultados' ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          },
            React.createElement(Trophy, { size: 16 }),
            'Hoy'
          ),
          React.createElement('button', {
            onClick: () => setVistaActual('estadisticas'),
            className: `py-3 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 text-xs ${vistaActual === 'estadisticas' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          },
            React.createElement(BarChart3, { size: 16 }),
            'Estadísticas'
          )
        ),
        
        // Contenido dinámico
        vistaActual === 'pronosticos' && React.createElement('div', null,
          React.createElement('div', { className: "space-y-4 mb-6" },
            React.createElement('div', null,
              React.createElement('label', { className: "block text-sm font-semibold text-gray-700 mb-2" }, 'Selecciona el sorteo:'),
              React.createElement('div', { className: "grid grid-cols-2 gap-3" },
                React.createElement('button', {
                  onClick: () => setSorteo('lottoactivo'),
                  className: `p-3 rounded-lg font-semibold transition-all ${sorteo === 'lottoactivo' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                }, 'Lottoactivo'),
                React.createElement('button', {
                  onClick: () => setSorteo('granjita'),
                  className: `p-3 rounded-lg font-semibold transition-all ${sorteo === 'granjita' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                }, 'La Granjita')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: "block text-sm font-semibold text-gray-700 mb-2" }, 
                `¿Cuántos animalitos quieres jugar? (${cantidadJugar})`
              ),
              React.createElement('input', {
                type: 'range',
                min: '1',
                max: '10',
                value: cantidadJugar,
                onChange: (e) => setCantidadJugar(parseInt(e.target.value)),
                className: "w-full h-2 bg-gray-300 rounded-lg cursor-pointer"
              })
            ),
            React.createElement('button', {
              onClick: generarPronosticos,
              className: "w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
            },
              React.createElement(Shuffle, { size: 24 }),
              'Generar Pronósticos'
            )
          ),
          pronosticos.length > 0 && React.createElement('div', { className: "mt-8" },
            React.createElement('h2', { className: "text-xl font-bold text-gray-800 mb-4 text-center" },
              `Tus Pronósticos para ${sorteo === 'lottoactivo' ? 'Lottoactivo' : 'La Granjita'}`
            ),
            React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
              pronosticos.map((animal, index) =>
                React.createElement('div', {
                  key: index,
                  className: "bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-md border-2 border-gray-200"
                },
                  React.createElement('div', { className: "flex items-center gap-4" },
                    React.createElement('div', {
                      className: `${animal.color} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg`
                    }, animal.numero),
                    React.createElement('div', { className: "flex-1" },
                      React.createElement('p', { className: "text-sm text-gray-500 font-medium" }, `Animalito #${index + 1}`),
                      React.createElement('p', { className: "text-xl font-bold text-gray-800" }, animal.nombre)
                    )
                  )
                )
              )
            )
          )
        )
      ),
      React.createElement('div', { className: "bg-white/90 backdrop-blur rounded-xl p-4 text-sm text-gray-700" },
        React.createElement('p', { className: "text-center" },
          React.createElement('strong', null, 'Nota: '),
          'Los resultados y estadísticas se basan en los datos que ingreses manualmente. Las probabilidades se calculan sobre el período seleccionado. Juega responsablemente.'
        )
      )
    )
  );
}

ReactDOM.render(React.createElement(PronosticosAnimalitos), document.getElementById('root'));// Aquí va TODO el código de React que está en el artifact

// Lo copias completo desde la primera línea hasta la última
